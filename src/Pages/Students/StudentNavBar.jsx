"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./StudentNavBar.css"

const StudentNavBar = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    navigate("/")
  }

  return (
    <nav className="student-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-text">GIGI GUBAE</span>
        </div>

        {/* Hamburger for small screens */}
        {/* <button
          className={`hamburger-btn ${open ? "open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button> */}

        {/* <ul className={`navbar-menu ${open ? "open" : ""}`}>
          <li>
            <a href="#" onClick={() => { setOpen(false); navigate("/student/courses") }}>
              Courses
            </a>
          </li>
          <li>
            <a href="#" onClick={() => { setOpen(false); navigate("/student/attendance") }}>
              Attendance
            </a>
          </li>
        </ul> */}

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default StudentNavBar
