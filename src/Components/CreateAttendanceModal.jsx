"use client"

import { useState } from "react"
import { X, Code, Zap, AlertCircle, Check } from "lucide-react"
import "../styles/CreateAttendanceModal.css"

const CreateAttendanceModal = ({ isOpen, onClose, courseTitle }) => {
  const [code, setCode] = useState("")
  const [startTime, setStartTime] = useState(10)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleCodeChange = (e) => {
    const value = e.target.value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 6)
    setCode(value)
    setError("")
  }

  const handleTimeChange = (e) => {
    const value = Math.min(Math.max(Number.parseInt(e.target.value) || 0, 0), 120)
    setStartTime(value)
  }

  const handleSubmit = () => {
    if (!code || code.length < 4) {
      setError("Please enter a valid attendance code (4+ characters)")
      return
    }

    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setCode("")
      setStartTime(10)
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-left">
            <h2 className="modal-title">Create Attendance</h2>
            <p className="modal-subtitle">{courseTitle}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Code Section */}
          <div className="form-section">
            <div className="section-header">
              <Code size={20} className="section-icon" />
              <div className="section-info">
                <label className="section-label">Attendance Code</label>
                <p className="section-description">Students will use this code to mark their attendance</p>
              </div>
            </div>

            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="e.g., MA-0825"
              className="code-input"
              maxLength={6}
              autoFocus
            />
          </div>

          {/* Time Section */}
          <div className="form-section">
            <div className="section-header">
              <Zap size={20} className="section-icon" />
              <div className="section-info">
                <label className="section-label">Starts In (minutes)</label>
                <p className="section-description">Code expires after this duration</p>
              </div>
            </div>

            <div className="time-input-wrapper">
              <input
                type="number"
                value={startTime}
                onChange={handleTimeChange}
                min="1"
                max="120"
                className="time-input"
              />
              <span className="time-unit">min</span>
            </div>
          </div>

          {/* QR Display Section */}
          <div className="qr-section">
            <p className="qr-label">QR / Code Display</p>
            <div className="qr-placeholder">
              <div className="qr-content">
                <div className="qr-icon-large">⬜</div>
                <p className="qr-text">
                  When you create attendance, a code and QR will appear here for students to use.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="message error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="message success-message">
              <Check size={18} />
              <span>Attendance created successfully!</span>
            </div>
          )}

          {/* Info Note */}
          <div className="info-note">
            <div className="note-icon">ℹ️</div>
            <p className="note-text">
              After the countdown, students joining within 30 minutes are marked as late. After that, they are marked
              absent.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!code}>
            Create Attendance
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateAttendanceModal
