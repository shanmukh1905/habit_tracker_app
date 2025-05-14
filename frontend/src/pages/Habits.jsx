import React, { useState } from 'react'
import { FaPlus, FaTrash, FaCheck, FaFilter } from 'react-icons/fa'
import Button from '../components/Button'
import '../App.css'

const Habits = ({ habits, onAddHabit, onToggleHabit, onDeleteHabit }) => {
  const [newHabitName, setNewHabitName] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState('streak') // 'streak', 'name', 'lastCompleted'

  const handleAddHabit = (e) => {
    e.preventDefault()
    if (!newHabitName.trim()) return
    onAddHabit(newHabitName.trim())
    setNewHabitName('')
  }

  const filteredHabits = habits.filter(habit => {
    if (filter === 'all') return true
    if (filter === 'active') return !habit.completions.includes(new Date().toISOString().split('T')[0])
    if (filter === 'completed') return habit.completions.includes(new Date().toISOString().split('T')[0])
    return true
  })

  const sortedHabits = [...filteredHabits].sort((a, b) => {
    if (sortBy === 'streak') return b.streak - a.streak
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'lastCompleted') {
      if (!a.lastCompleted) return 1
      if (!b.lastCompleted) return -1
      return new Date(b.lastCompleted) - new Date(a.lastCompleted)
    }
    return 0
  })

  return (
    <div className="habits-page">
      <div className="habits-header">
        <h1>My Habits</h1>
        <div className="filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Habits</option>
            <option value="active">Active Today</option>
            <option value="completed">Completed Today</option>
          </select>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="streak">Sort by Streak</option>
            <option value="name">Sort by Name</option>
            <option value="lastCompleted">Sort by Last Completed</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleAddHabit} className="add-habit-form">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Enter new habit name"
          className="habit-input"
        />
        <Button type="submit" variant="primary">
          <FaPlus /> Add Habit
        </Button>
      </form>

      <div className="habits-list">
        {sortedHabits.map(habit => (
          <div key={habit.id} className="habit-item">
            <div className="habit-info">
              <h3>{habit.name}</h3>
              <div className="habit-stats">
                <span className="streak">🔥 {habit.streak} day streak</span>
                {habit.lastCompleted && (
                  <span className="last-completed">
                    Last completed: {new Date(habit.lastCompleted).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="habit-actions">
              <Button
                variant={habit.completions.includes(new Date().toISOString().split('T')[0]) ? 'success' : 'secondary'}
                onClick={() => onToggleHabit(habit.id)}
              >
                <FaCheck />
              </Button>
              <Button
                variant="danger"
                onClick={() => onDeleteHabit(habit.id)}
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Habits 