import React, { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useEffect } from 'react-leaflet'
import { useEffect as useReactEffect } from 'react'
import styles from './SensorMap.module.css'

function FlyTo({ sensor }) {
  const map = useMap()
  useReactEffect(() => {
    if (sensor) map.flyTo([sensor.latitude, sensor.longitude], 15, { duration: 1.2 })
  }, [sensor])
  return null
}

export default function SensorMap({ sensors, selectedSensor, setSelectedSensor, loading }) {
  const center = useMemo(() => {
    if (!sensors.length) return [37.32, -121.9]
    const lat = sensors.reduce((s, x) => s + x.latitude, 0) / sensors.length
    const lng = sensors.reduce((s, x) => s + x.longitude, 0) / sensors.length
    return [lat, lng]
  }, [sensors.length > 0])

  return (
    <div className={styles.wrap}>
      {loading && (
        <div className={styles.overlay}>
          <span className={styles.spinner} />
          <span>Chargement...</span>
        </div>
      )}

      {!loading && sensors.length === 0 && (
        <div className={styles.empty}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 14 8 14s8-8.6 8-14a8 8 0 0 0-8-8z"/>
          </svg>
          <p>Aucun capteur</p>
        </div>
      )}

      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />

        {sensors.map(sensor => {
          const isSelected = selectedSensor?._id === sensor._id
          return (
            <CircleMarker
              key={sensor._id}
              center={[sensor.latitude, sensor.longitude]}
              radius={isSelected ? 12 : 7}
              pathOptions={{
                color: '#00e5a0',
                fillColor: '#00e5a0',
                fillOpacity: isSelected ? 1 : 0.7,
                weight: isSelected ? 3 : 1.5
              }}
              eventHandlers={{ click: () => setSelectedSensor(sensor) }}
            >
              <Popup>
                <div style={{ fontFamily: 'Space Mono, monospace', minWidth: 180 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#00e5a0', marginBottom: 8 }}>
                    #{sensor.sensorId}
                  </div>
                  <table style={{ fontSize: 12, borderCollapse: 'collapse' }}>
                    {[
                      ['_id', sensor._id?.slice(-8) + '...'],
                      ['Latitude', sensor.latitude],
                      ['Longitude', sensor.longitude],
                      ['Créé le', new Date(sensor.createdAt).toLocaleString('fr-FR')],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={{ color: '#6b7589', paddingRight: 12, paddingBottom: 4 }}>{k}</td>
                        <td style={{ color: '#e8ecf0' }}>{v}</td>
                      </tr>
                    ))}
                  </table>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}

        {selectedSensor && <FlyTo sensor={selectedSensor} />}
      </MapContainer>

      <div className={styles.counter}>{sensors.length} capteurs</div>
    </div>
  )
}
