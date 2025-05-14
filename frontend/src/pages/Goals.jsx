import React, { useState } from 'react'
import '../App.css'

const Goals = ({ habits }) => {
  const [newGoal, setNewGoal] = useState('')
  const [goals, setGoals] = useState([
    { id: 1, text: 'Complete all habits for 7 days straight', completed: false },
    { id: 2, text: 'Maintain a 90% completion rate for a week', completed: false },
    { id: 3, text: 'Add 3 new habits to your routine', completed: false }
  ])

  const handleAddGoal = () => {
    if (newGoal.trim() !== '') {
      setGoals([...goals, {
        id: Date.now(),
        text: newGoal,
        completed: false
      }])
      setNewGoal('')
    }
  }

  const toggleGoal = (id) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ))
  }

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id))
  }

  const completedGoals = goals.filter(goal => goal.completed).length
  const goalProgress = goals.length > 0 
    ? Math.round((completedGoals / goals.length) * 100) 
    : 0

  return (
    <div className="goals-page">
      <div className="tile">
        <h2>Your Goals</h2>
        <div className="goal-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${goalProgress}%` }}
            >
              {goalProgress}%
            </div>
          </div>
          <div className="progress-text">
            {completedGoals} of {goals.length} goals completed
          </div>
        </div>

        <div className="add-goal">
          <input
            type="text"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            placeholder="Add a new goal"
            onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
          />
          <button onClick={handleAddGoal}>Add Goal</button>
        </div>

        <div className="goals-list">
          {goals.map(goal => (
            <div key={goal.id} className="goal-item">
              <div className="goal-content">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoal(goal.id)}
                />
                <span className={goal.completed ? 'completed' : ''}>
                  {goal.text}
                </span>
              </div>
              <button 
                className="delete-btn"
                onClick={() => deleteGoal(goal.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="tile">
        <h2>Suggested Goals</h2>
        <div className="suggested-goals">
          <div className="suggested-goal">
            <h3>Consistency Challenge</h3>
            <p>Complete all habits for 30 days straight</p>
            <button>Add to My Goals</button>
          </div>
          <div className="suggested-goal">
            <h3>Habit Expansion</h3>
            <p>Add 5 new habits to your routine this month</p>
            <button>Add to My Goals</button>
          </div>
          <div className="suggested-goal">
            <h3>Streak Master</h3>
            <p>Maintain a 7-day streak for all habits</p>
            <button>Add to My Goals</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Goals 