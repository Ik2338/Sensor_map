import React, { useState, useEffect, useCallback } from 'react'
import SensorMap from './components/SensorMap'
import Sidebar from './components/Sidebar'
import MongoViewer from './components/MongoViewer'
import StatsBar from './components/StatsBar'
import { getSensors, getSensorStats, reseedSensors } from './services/api'
import styles from './App.module.css'

export default function App() {
  const [sensors, setSensors] = useState([])
  const [stats, setStats] = useState(null)
  const [selectedSensor, setSelectedSensor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('map') // 'map' | 'mongo'
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [sRes, stRes] = await Promise.all([
        getSensors({ limit: 1000 }),
        getSensorStats()
      ])
      setSensors(sRes.data.data)
      setStats(stRes.data.data)
    } catch {
      showToast('Erreur de connexion au serveur', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleReseed = async () => {
    try {
      const res = await reseedSensors()
      showToast(res.data.message)
      fetchAll()
    } catch {
      showToast('Erreur lors du rechargement', 'error')
    }
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.dot} />
          <span>SENSOR<b>MAP</b></span>
        </div>
        <StatsBar stats={stats} loading={loading} />
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'map' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('map')}
          >
            🗺 Carte
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'mongo' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('mongo')}
          >
            🍃 MongoDB
          </button>
        </div>
        <button className={styles.reseedBtn} onClick={handleReseed} title="Recharger le dataset fixe">
          ↺ Reset Dataset
        </button>
      </header>

      <div className={styles.body}>
        {activeTab === 'map' ? (
          <>
            <Sidebar
              sensors={sensors}
              selectedSensor={selectedSensor}
              setSelectedSensor={setSelectedSensor}
              onRefresh={fetchAll}
            />
            <main className={styles.main}>
              <SensorMap
                sensors={sensors}
                selectedSensor={selectedSensor}
                setSelectedSensor={setSelectedSensor}
                loading={loading}
              />
            </main>
          </>
        ) : (
          <MongoViewer onRefresh={fetchAll} showToast={showToast} />
        )}
      </div>

      {toast && (
        <div className={`${styles.toast} ${styles[toast.type]}`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
