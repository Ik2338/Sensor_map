import React, { useState } from 'react'
import styles from './Sidebar.module.css'

export default function Sidebar({ sensors, selectedSensor, setSelectedSensor, onRefresh }) {
  const [search, setSearch] = useState('')

  const filtered = sensors.filter(s =>
    s.sensorId?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <aside className={styles.sidebar}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>CAPTEURS ({sensors.length})</div>
        <input
          className={styles.search}
          placeholder="Rechercher par ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className={styles.refreshBtn} onClick={onRefresh}>↺ Actualiser</button>
      </div>

      <div className={styles.listWrap}>
        {filtered.map(sensor => (
          <div
            key={sensor._id}
            className={`${styles.sensorRow} ${selectedSensor?._id === sensor._id ? styles.selected : ''}`}
            onClick={() => setSelectedSensor(sensor)}
          >
            <span className={styles.dot} />
            <div className={styles.info}>
              <span className={styles.id}>{sensor.sensorId}</span>
              <span className={styles.coords}>
                {sensor.latitude?.toFixed(6)}, {sensor.longitude?.toFixed(6)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
