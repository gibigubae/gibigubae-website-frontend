"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    grandfatherName: "",
    phoneNumber: "",
    department: "",
    gender: "",
    id: "",
    idFile: null,
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError("")

    if (
      !formData.firstName ||
      !formData.fatherName ||
      !formData.grandfatherName ||
      !formData.phoneNumber ||
      !formData.department ||
      !formData.gender ||
      !formData.id ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)

    try {
      const formDataWithFile = new FormData()
      formDataWithFile.append("firstName", formData.firstName)
      formDataWithFile.append("fatherName", formData.fatherName)
      formDataWithFile.append("grandfatherName", formData.grandfatherName)
      formDataWithFile.append("phoneNumber", formData.phoneNumber)
      formDataWithFile.append("department", formData.department)
      formDataWithFile.append("gender", formData.gender)
      formDataWithFile.append("id", formData.id)
      if (formData.idFile) {
        formDataWithFile.append("idFile", formData.idFile)
      }
      formDataWithFile.append("email", formData.email)
      formDataWithFile.append("password", formData.password)

      const response = await fetch("https://gibigubae-website-backend.onrender.com/api/auth/signup", {
        method: "POST",
        body: formDataWithFile,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Sign up failed")
        return
      }

      // Store token and role
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", data.role || "student")

      // Admin routing is temporarily disabled to focus on the student frontend build.
      // if (data.role === "admin") {
      //   navigate("/admin/courses")
      // } else {
      //   navigate("/student/courses")
      // }
      // For now, route everyone to the student courses page
      navigate("/student/courses")
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Sign up error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Right Section - Welcome Card (moved to appear first) */}
        <div className="auth-welcome-section hide-on-mobile">
          <div className="welcome-card">
            <div className="logo-circle">
              <span className="logo-text">
                GIGI
                <br />
                GUBAE
              </span>
            </div>
            <h2 className="welcome-title">Hello. Welcome</h2>
            <p className="welcome-message">
              Create your account to get started. Stay connected, manage your profile, and access all available
              services. Already have an account?{" "}
              <span onClick={() => navigate("/")} className="welcome-link">
                Sign in to continue.
              </span>
            </p>
          </div>
        </div>

        {/* Left Section - Form (moved to appear after welcome) */}
        <div className="auth-form-section">
          <div className="auth-form">
            <h1 className="auth-title">Create your account</h1>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSignUp}>
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    name="fatherName"
                    placeholder="Father Name"
                    value={formData.fatherName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="grandfatherName"
                    placeholder="Grandfather Name"
                    value={formData.grandfatherName}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <div className="phone-input-wrapper">
                    <span className="phone-prefix">+251</span>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="Phone Number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="form-input phone-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select Department</option>
                  <option value="engineering">Engineering</option>
                  <option value="business">Business</option>
                  <option value="arts">Arts</option>
                  <option value="science">Science</option>
                  <option value="medicine">Medicine</option>
                </select>
              </div>

              <div className="form-group">
                <select name="gender" value={formData.gender} onChange={handleChange} required className="form-input">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <input
                    type="text"
                    name="id"
                    placeholder="ID"
                    value={formData.id}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group file-upload-group">
                  <label htmlFor="idFile" className="file-upload-label">
                    upload ID
                  </label>
                  <input
                    type="file"
                    id="idFile"
                    name="idFile"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="file-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? "Registering..." : "Register"}
                {!loading && <span className="button-arrow">→</span>}
              </button>
            </form>

            <div className="auth-link">
              Already have an account?{" "}
              <span onClick={() => navigate("/")} className="link-text">
                login
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
