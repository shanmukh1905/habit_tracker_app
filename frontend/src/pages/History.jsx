import React, { useState, useEffect } from 'react'
import { FaSpinner } from 'react-icons/fa'
import '../App.css'

const History = ({ habits }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('week') // 'week', 'month', 'year'
  const [completionData, setCompletionData] = useState([])

  useEffect(() => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Detailed debugging logs
      console.log('History component received habits:', habits)
      console.log('Number of habits:', habits?.length)
      console.log('Sample habit structure:', habits?.[0])
      
      if (!habits || !Array.isArray(habits)) {
        throw new Error('Invalid habits data')
      }

      const data = calculateCompletionData(habits, selectedPeriod)
      console.log('Calculated completion data:', data)
      setCompletionData(data)
    } catch (err) {
      setError('Failed to load history data: ' + err.message)
      console.error('History data error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [habits, selectedPeriod])

  const calculateCompletionData = (habits, period) => {
    const today = new Date()
    let days = []
    let numDays = 7 // Default to week

    if (period === 'month') {
      numDays = 30
    } else if (period === 'year') {
      numDays = 365
    }

    // Create array of dates for the selected period
    for (let i = numDays - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push(date)
    }

    // Calculate completion data for each day
    return days.map(date => {
      const dayHabits = habits.filter(habit => {
        // Debug each habit's completions
        console.log(`Checking habit ${habit.name}:`, {
          completions: habit.completions,
          lastCompleted: habit.lastCompleted
        })

        if (!habit.completions || !Array.isArray(habit.completions)) {
          console.log(`No completions array for habit ${habit.name}`)
          return false
        }
        
        // Check if any completion date matches the current date
        const hasCompletion = habit.completions.some(completionDate => {
          const completion = new Date(completionDate)
          const isMatch = completion.toDateString() === date.toDateString()
          console.log(`Comparing dates for ${habit.name}:`, {
            completionDate,
            currentDate: date.toDateString(),
            isMatch
          })
          return isMatch
        })

        return hasCompletion
      })

      const completionRate = habits.length > 0 
        ? Math.round((dayHabits.length / habits.length) * 100) 
        : 0

      console.log(`Completion data for ${date.toDateString()}:`, {
        dayHabits: dayHabits.length,
        totalHabits: habits.length,
        completionRate
      })

      return {
        date,
        completionRate,
        completedHabits: dayHabits
      }
    })
  }

  const getPeriodLabel = (date) => {
    if (selectedPeriod === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else if (selectedPeriod === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short' })
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!habits || habits.length === 0) {
    return (
      <div className="history-page">
        <div className="history-header">
          <h2>Habit History</h2>
          <div className="period-selector">
            <button
              className={`btn ${selectedPeriod === 'week' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedPeriod('week')}
            >
              Week
            </button>
            <button
              className={`btn ${selectedPeriod === 'month' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedPeriod('month')}
            >
              Month
            </button>
            <button
              className={`btn ${selectedPeriod === 'year' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedPeriod('year')}
            >
              Year
            </button>
          </div>
        </div>
        <div className="no-data-message">
          <p>No habits found. Start by adding some habits in the Habits page!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <h2>Habit History</h2>
        <div className="period-selector">
          <button
            className={`btn ${selectedPeriod === 'week' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </button>
          <button
            className={`btn ${selectedPeriod === 'month' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </button>
          <button
            className={`btn ${selectedPeriod === 'year' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedPeriod('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="tile">
        <h3>Completion Rate</h3>
        <div className="history-chart">
          {completionData.map((data, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="chart-fill"
                style={{ height: `${data.completionRate}%` }}
                role="progressbar"
                aria-valuenow={data.completionRate}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span className="chart-value">{data.completionRate}%</span>
              </div>
              <div className="chart-label">
                {getPeriodLabel(data.date)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tile">
        <h3>Detailed History</h3>
        <div className="history-list">
          {completionData.map((data, index) => (
            <div key={index} className="history-item">
              <div className="history-date">
                {data.date.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="history-details">
                <div className="completion-rate">
                  {data.completedHabits.length} of {habits.length} habits completed
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${data.completionRate}%` }}
                    />
                  </div>
                </div>
                <div className="completed-habits">
                  {data.completedHabits.length > 0 ? (
                    data.completedHabits.map(habit => (
                      <span key={habit.id} className="habit-tag">
                        {habit.name}
                      </span>
                    ))
                  ) : (
                    <span className="no-habits">No habits completed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default History 