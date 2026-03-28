const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// ─── Fixed Dataset ────────────────────────────────────────────────────────────
const FIXED_DATASET = [
  { sensorId: '400001', latitude: 37.364085, longitude: -121.901149 },
  { sensorId: '400017', latitude: 37.253303, longitude: -121.945440 },
  { sensorId: '400030', latitude: 37.359087, longitude: -121.906538 },
  { sensorId: '400040', latitude: 37.294949, longitude: -121.873109 },
  { sensorId: '400045', latitude: 37.363402, longitude: -121.902233 },
];

// ─── MongoDB Connection ───────────────────────────────────────────────────────
const connectDB = async () => {
  let retries = 10;
  while (retries > 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:sensorpass@localhost:27017/sensordb?authSource=admin');
      console.log('✅ MongoDB connected');
      return;
    } catch (err) {
      console.log(`MongoDB connection failed, retrying... (${retries} left)`);
      retries--;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  process.exit(1);
};

// ─── Schema ───────────────────────────────────────────────────────────────────
const sensorSchema = new mongoose.Schema({
  sensorId: { type: String, unique: true, required: true },
  latitude:  { type: Number, required: true },
  longitude: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: [Number], // [lng, lat]
  },
}, { timestamps: true });

sensorSchema.index({ location: '2dsphere' });
const Sensor = mongoose.model('Sensor', sensorSchema);

// ─── Seed fixed dataset on startup ───────────────────────────────────────────
const seedDataset = async () => {
  const count = await Sensor.countDocuments();
  if (count === 0) {
    const docs = FIXED_DATASET.map(s => ({
      ...s,
      location: { type: 'Point', coordinates: [s.longitude, s.latitude] },
    }));
    await Sensor.insertMany(docs);
    console.log(`🌱 Seeded ${docs.length} sensors into MongoDB`);
  } else {
    console.log(`ℹ️  MongoDB already has ${count} sensors — skipping seed`);
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET all sensors
app.get('/api/sensors', async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [data, total] = await Promise.all([
      Sensor.find().skip(skip).limit(parseInt(limit)).sort({ sensorId: 1 }),
      Sensor.countDocuments(),
    ]);
    res.json({ success: true, total, page: parseInt(page), limit: parseInt(limit), data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET stats
app.get('/api/sensors/stats', async (req, res) => {
  try {
    const total = await Sensor.countDocuments();
    const sample = await Sensor.findOne().sort({ createdAt: -1 });
    res.json({ success: true, data: { total, lastInserted: sample?.createdAt || null } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET one sensor by id
app.get('/api/sensors/:sensorId', async (req, res) => {
  try {
    const sensor = await Sensor.findOne({ sensorId: req.params.sensorId });
    if (!sensor) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: sensor });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST reseed (reset to fixed dataset)
app.post('/api/sensors/reseed', async (req, res) => {
  try {
    await Sensor.deleteMany({});
    const docs = FIXED_DATASET.map(s => ({
      ...s,
      location: { type: 'Point', coordinates: [s.longitude, s.latitude] },
    }));
    await Sensor.insertMany(docs);
    res.json({ success: true, message: `${docs.length} capteurs rechargés`, count: docs.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE all
app.delete('/api/sensors', async (req, res) => {
  try {
    await Sensor.deleteMany({});
    res.json({ success: true, message: 'Tous les capteurs supprimés' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await seedDataset();
  app.listen(PORT, () => console.log(`🚀 Backend on port ${PORT}`));
});
