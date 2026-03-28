import React from 'react'
import styles from './StatsBar.module.css'

export default function StatsBar({ stats, loading }) {
  if (!stats) return <div className={styles.bar} />
  return (
    <div className={styles.bar}>
      <div className={styles.stat}>
        <span className={styles.num}>{stats.total}</span>
        <span className={styles.label}>Capteurs</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.num} style={{ color: '#00e5a0', fontSize: 12 }}>
          {stats.lastInserted ? new Date(stats.lastInserted).toLocaleDateString('fr-FR') : '—'}
        </span>
        <span className={styles.label}>Dernier ajout</span>
      </div>
    </div>
  )
}
