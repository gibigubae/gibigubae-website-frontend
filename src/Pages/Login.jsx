"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
 const apiUrl = import.meta.env.VITE_API_URL;
  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${apiUrl}/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "phone_or_email":email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Login failed")
        return
      }
      const role = data.data.user.role;
      // Store token and role
      // localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", role)

      // Admin routing is temporarily disabled to focus on the student frontend build.
      if (role === "admin" || role === "super_admin") {
        navigate("/admin/courses")
      } else {
        navigate("/student/courses")
      }

    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Right Section - Welcome Card (moved to appear first) */}
        <div className="auth-welcome-section">
          <div className="welcome-card">
            <div className="logo-circle">
              <span className="logo-text">
                GIBI
                <br />
                GUBAE
              </span>
            </div>
            <h2 className="welcome-title">Welcome back!</h2>
            <p className="welcome-message">
              Log in to your account to access your courses, track attendance, and manage your academic progress. We're
              glad to see you again!
            </p>
          </div>
        </div>

        {/* Left Section - Form (moved to appear after welcome) */}
        <div className="auth-form-section">
          <div className="auth-form">
            <h1 className="auth-title">Login</h1>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="auth-link">
              Don't have an account?{" "}
              <span onClick={() => navigate("/signup")} className="link-text">
                Sign up
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
