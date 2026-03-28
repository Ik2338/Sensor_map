import React, { useState, useEffect } from 'react'
import { getSensors, deleteSensors, reseedSensors } from '../services/api'
import styles from './MongoViewer.module.css'

export default function MongoViewer({ onRefresh, showToast }) {
  const [sensors, setSensors] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const LIMIT = 10

  const fetch = async (p = page) => {
    setLoading(true)
    try {
      const res = await getSensors({ page: p, limit: LIMIT })
      setSensors(res.data.data)
      setTotal(res.data.total)
    } catch {
      showToast('Erreur chargement MongoDB', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch(page) }, [page])

  const handleDelete = async () => {
    if (!confirm('Vider toute la collection MongoDB ?')) return
    await deleteSensors()
    showToast('Collection vidée')
    fetch(1)
    onRefresh()
  }

  const handleReseed = async () => {
    await reseedSensors()
    showToast('Dataset rechargé dans MongoDB')
    setPage(1)
    fetch(1)
    onRefresh()
  }

  const totalPages = Math.ceil(total / LIMIT)

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <span className={styles.dbLabel}>
            <span className={styles.mongoIcon}>🍃</span>
            <span className={styles.dbName}>sensordb</span>
            <span className={styles.arrow}>›</span>
            <span className={styles.collName}>sensors</span>
          </span>
          <span className={styles.count}>{total} documents</span>
        </div>
        <div className={styles.toolbarRight}>
          <button className={styles.btnSecondary} onClick={handleReseed}>↺ Reseed</button>
          <button className={styles.btnDanger} onClick={handleDelete}>🗑 Vider</button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.tableWrap}>
          {loading ? (
            <div className={styles.loading}><span className={styles.spinner} /> Chargement...</div>
          ) : sensors.length === 0 ? (
            <div className={styles.empty}>
              <p>Collection vide</p>
              <button className={styles.btnPrimary} onClick={handleReseed}>Charger le dataset</button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>_id</th>
                  <th>sensorId</th>
                  <th>latitude</th>
                  <th>longitude</th>
                  <th>createdAt</th>
                  <th>updatedAt</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sensors.map(s => (
                  <tr
                    key={s._id}
                    className={selected?._id === s._id ? styles.selectedRow : ''}
                    onClick={() => setSelected(selected?._id === s._id ? null : s)}
                  >
                    <td className={styles.idCell}>{s._id}</td>
                    <td className={styles.sensorIdCell}>{s.sensorId}</td>
                    <td className={styles.numCell}>{s.latitude}</td>
                    <td className={styles.numCell}>{s.longitude}</td>
                    <td className={styles.dateCell}>{new Date(s.createdAt).toLocaleString('fr-FR')}</td>
                    <td className={styles.dateCell}>{new Date(s.updatedAt).toLocaleString('fr-FR')}</td>
                    <td>
                      <button className={styles.expandBtn} onClick={e => { e.stopPropagation(); setSelected(selected?._id === s._id ? null : s) }}>
                        {selected?._id === s._id ? '▲' : '▼'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className={styles.docPanel}>
            <div className={styles.docHeader}>
              <span>Document JSON</span>
              <button className={styles.closeDoc} onClick={() => setSelected(null)}>✕</button>
            </div>
            <pre className={styles.json}>{JSON.stringify(selected, null, 2)}</pre>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          <span className={styles.pageInfo}>Page {page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          <button disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
        </div>
      )}
    </div>
  )
}
