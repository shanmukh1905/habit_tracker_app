import React, { useState, useEffect } from 'react'
import { FaFire, FaCheck, FaTimes, FaChartLine, FaHistory } from 'react-icons/fa'
import Button from '../components/Button'
import '../App.css'
import StatCard from '../components/StatCard'

const Home = ({ habits, onToggleHabit }) => {
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    longestStreak: 0,
    totalCompletions: 0
  })
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    calculateStats(habits)
  }, [habits])

  const calculateStats = (habitsData) => {
    const today = new Date().toISOString().split('T')[0]
    const completedToday = habitsData.filter(habit => 
      habit.completions.includes(today)
    ).length

    const longestStreak = Math.max(...habitsData.map(habit => habit.streak), 0)
    const totalCompletions = habitsData.reduce((total, habit) => 
      total + habit.completions.length, 0
    )

    setStats({
      totalHabits: habitsData.length,
      completedToday,
      longestStreak,
      totalCompletions
    })

    // Calculate recent activity
    const allCompletions = habitsData.flatMap(habit => 
      habit.completions.map(date => ({
        date,
        habitName: habit.name,
        habitId: habit.id
      }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

    setRecentActivity(allCompletions)
  }

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h2>Welcome to Habit Tracker</h2>
        <p className="subtitle">Track your daily habits and build better routines</p>
      </div>

      <div className="stats-section">
        <div className="tile-grid">
          <div className="tile">
            <StatCard 
              title="Total Habits" 
              value={habits.length} 
            />
          </div>
          <div className="tile">
            <StatCard 
              title="Completed Today" 
              value={stats.completedToday} 
            />
          </div>
          <div className="tile">
            <StatCard 
              title="Best Streak" 
              value={stats.longestStreak} 
            />
          </div>
        </div>
      </div>

      <div className="motivation-section">
        <div className="tile">
          <h3>Daily Motivation</h3>
          <p className="quote">
            {/* Add a motivational quote here */}
          </p>
        </div>
      </div>

      <div className="progress-section">
        <div className="tile">
          <h3>Today's Progress</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(stats.completedToday / stats.totalHabits) * 100}%` }}
            >
              {stats.completedToday}/{stats.totalHabits} completed
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="habits-grid">
          {habits.map(habit => (
            <div key={habit.id} className="habit-card">
              <div className="habit-info">
                <h3>{habit.name}</h3>
                <p className="streak">🔥 {habit.streak} day streak</p>
              </div>
              <Button
                variant={habit.completions.includes(new Date().toISOString().split('T')[0]) ? 'success' : 'secondary'}
                onClick={() => onToggleHabit(habit.id)}
                className="toggle-btn"
              >
                {habit.completions.includes(new Date().toISOString().split('T')[0]) ? 'Completed' : 'Mark Complete'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <FaHistory />
                </div>
                <div className="activity-info">
                  <p className="habit-name">{activity.habitName}</p>
                  <p className="activity-date">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-activity">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home 