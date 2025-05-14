import React, { useEffect, useState } from 'react'
import '../App.css'

const StatCard = ({ title, value }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    const element = document.querySelector(`.stat-card[data-title="${title}"]`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [title])

  useEffect(() => {
    if (isVisible) {
      let start = 0
      const duration = 1000 // 1 second
      const step = value / (duration / 16) // 60fps

      const timer = setInterval(() => {
        start += step
        if (start >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [value, isVisible])

  return (
    <div 
      className={`stat-card ${isVisible ? 'visible' : ''}`}
      data-title={title}
    >
      <h3>{title}</h3>
      <p className="stat-value">{displayValue}</p>
      <div className="stat-icon">
        {title === 'Total Habits' && '📊'}
        {title === 'Completed Today' && '✅'}
        {title === 'Best Streak' && '🔥'}
      </div>
    </div>
  )
}

export default StatCard 