import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
})

export const getSensors = (params) => API.get('/api/sensors', { params })
export const getSensorStats = () => API.get('/api/sensors/stats')
export const reseedSensors = () => API.post('/api/sensors/reseed')
export const deleteSensors = () => API.delete('/api/sensors')
