"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLogout } from "../../hooks/useAuth"
import "./StudentNavBar.css"

const StudentNavBar = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const logoutMutation = useLogout({
    onSuccess: () => {
      localStorage.removeItem("userRole")
      navigate("/")
    },
    onError: (error) => {
      console.error("Logout error:", error)
      localStorage.removeItem("userRole")
      navigate("/")
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <nav className="student-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-text">GIGI GUBAE</span>
        </div>
        
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default StudentNavBar
