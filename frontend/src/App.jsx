import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Habits from './pages/Habits'
import History from './pages/History'
import Goals from './pages/Goals'
import { api } from './services/api'

function AppContent() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const location = useLocation()

  // Load habits from API on initial render
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoading(true)
        const data = await api.getHabits()
        setHabits(data)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching habits:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHabits()
  }, [])

  const onToggleHabit = async (id) => {
    try {
      const updatedHabit = await api.toggleHabit(id)
      setHabits(prevHabits => {
        // Find the index of the habit to update
        const index = prevHabits.findIndex(h => h.id === id)
        if (index === -1) return prevHabits
        
        // Create a new array with the updated habit
        const newHabits = [...prevHabits]
        newHabits[index] = updatedHabit
        return newHabits
      })
    } catch (err) {
      setError(err.message)
      console.error('Error toggling habit:', err)
    }
  }

  const onDeleteHabit = async (id) => {
    try {
      await api.deleteHabit(id)
      setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting habit:', err)
    }
  }

  const onAddHabit = async (name) => {
    try {
      const newHabit = await api.addHabit(name)
      setHabits(prevHabits => [...prevHabits, newHabit])
    } catch (err) {
      setError(err.message)
      console.error('Error adding habit:', err)
    }
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar currentPage={location.pathname.slice(1) || 'home'} />
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home
                habits={habits}
                onToggleHabit={onToggleHabit}
              />
            } 
          />
          <Route 
            path="/habits" 
            element={
              <Habits
                habits={habits}
                onToggleHabit={onToggleHabit}
                onDeleteHabit={onDeleteHabit}
                onAddHabit={onAddHabit}
              />
            } 
          />
          <Route 
            path="/history" 
            element={<History habits={habits} />} 
          />
          <Route 
            path="/goals" 
            element={<Goals habits={habits} />} 
          />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
