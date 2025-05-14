import React, { useState } from 'react'
import '../App.css'

const HabitItem = ({ habit, onToggle, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)
    try {
      await onToggle(habit.id)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(habit.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const isCompletedToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return habit.completions?.includes(today) || false
  }

  const progress = Math.min(100, (habit.streak / 7) * 100)

  return (
    <div className={`habit-item ${isLoading ? 'loading' : ''} ${isDeleting ? 'deleting' : ''}`}>
      <div className="habit-info">
        <span className={`habit-name ${isCompletedToday() ? 'completed' : ''}`}>
          {habit.name}
        </span>
        <div className="streak-container">
          <span className="streak">🔥 {habit.streak} days</span>
          {habit.streak > 0 && (
            <div className="streak-progress">
              <div 
                className="progress-bar"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                >
                  {progress}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="habit-actions">
        <button
          className={`toggle-btn ${isCompletedToday() ? 'completed' : ''} ${isLoading ? 'loading' : ''}`}
          onClick={handleToggle}
          disabled={isLoading || isDeleting}
        >
          {isLoading ? (
            <div className="spinner" />
          ) : isCompletedToday() ? (
            '✓'
          ) : (
            '○'
          )}
        </button>
        <button
          className={`delete-btn ${isDeleting ? 'loading' : ''}`}
          onClick={handleDelete}
          disabled={isLoading || isDeleting}
        >
          {isDeleting ? (
            <div className="spinner" />
          ) : (
            '×'
          )}
        </button>
      </div>
    </div>
  )
}

export default HabitItem 