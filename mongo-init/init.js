db = db.getSiblingDB('sensordb');

db.createCollection('sensors');
db.sensors.createIndex({ location: "2dsphere" });
db.sensors.createIndex({ type: 1 });
db.sensors.createIndex({ status: 1 });

print('MongoDB initialized: sensordb ready');
