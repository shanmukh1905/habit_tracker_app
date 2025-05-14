import React from 'react';
import '../App.css';

const HabitGrid = ({ habit, days = 30 }) => {
  // Generate an array of days for the grid
  const generateDays = () => {
    const today = new Date();
    const daysArray = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      daysArray.push({
        date,
        completed: habit.completions?.includes(date.toISOString().split('T')[0]) || false
      });
    }
    
    return daysArray;
  };

  const daysArray = generateDays();

  return (
    <div className="habit-grid-container">
      <div className="habit-grid-header">
        <h3 className="habit-grid-title">{habit.name}</h3>
        <span className="habit-grid-streak">🔥 {habit.streak} day streak</span>
      </div>
      <div className="habit-grid">
        {daysArray.map((day, index) => (
          <div
            key={index}
            className={`habit-day ${day.completed ? 'completed' : ''}`}
            title={`${day.date.toLocaleDateString()} - ${day.completed ? 'Completed' : 'Not completed'}`}
          />
        ))}
      </div>
      <div className="habit-grid-footer">
        <span className="habit-grid-date-range">
          {daysArray[0].date.toLocaleDateString()} - {daysArray[daysArray.length - 1].date.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default HabitGrid; 