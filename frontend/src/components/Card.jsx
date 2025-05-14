import React from 'react'
import '../App.css'

const Card = ({
  children,
  title,
  className = '',
  onClick
}) => {
  return (
    <div className={`card ${className}`} onClick={onClick}>
      {title && <h3 className="card-title">{title}</h3>}
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}

export default Card 