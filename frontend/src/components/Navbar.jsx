import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaList, FaHistory, FaBullseye, FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const location = useLocation()

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // On desktop, always keep sidebar open
      if (!mobile) {
        setIsOpen(true)
      }
    }

    // Initial setup
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-header">
          <div className="nav-brand">
            <span>Habit Tracker</span>
          </div>
          {isMobile && (
            <button 
              className="toggle-btn" 
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>
        
        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            aria-current={location.pathname === '/' ? 'page' : undefined}
          >
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
          
          <Link
            to="/habits"
            className={`nav-link ${location.pathname === '/habits' ? 'active' : ''}`}
            aria-current={location.pathname === '/habits' ? 'page' : undefined}
          >
            <FaList className="nav-icon" />
            <span>Habits</span>
          </Link>
          
          <Link
            to="/history"
            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
            aria-current={location.pathname === '/history' ? 'page' : undefined}
          >
            <FaHistory className="nav-icon" />
            <span>History</span>
          </Link>
          
          <Link
            to="/goals"
            className={`nav-link ${location.pathname === '/goals' ? 'active' : ''}`}
            aria-current={location.pathname === '/goals' ? 'page' : undefined}
          >
            <FaBullseye className="nav-icon" />
            <span>Goals</span>
          </Link>
        </nav>
      </div>
      {isOpen && isMobile && (
        <div 
          className="sidebar-overlay" 
          onClick={toggleSidebar}
          role="presentation"
        />
      )}
    </>
  )
}

export default Navbar 