import { useState } from "react";
import { X, Zap, AlertCircle, Check } from "lucide-react";
import { useParams } from "react-router-dom";

import "../styles/CreateAttendanceModal.css";

const CreateAttendanceModal = ({ isOpen, onClose, courseTitle }) => {
  const [startTime, setStartTime] = useState(10);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const base_url = import.meta.env.VITE_API_URL;
  const { courseId } = useParams();

  const handleCreateAttendance = async () => {
    try {
      const response = await fetch(`${base_url}/attendance/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          minutes: startTime,
        }),
      });

      const data = await response.json();
      console.log("Success:", data);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setStartTime(10);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      setError(error);
    }
  };

  const handleTimeChange = (e) => {
    const value = Math.min(
      Math.max(Number.parseInt(e.target.value) || 0, 0),
      120
    );
    setStartTime(value);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-left">
            <h2 className="modal-title">Create Attendance</h2>
            <p className="modal-subtitle">{courseTitle}</p>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Time Section */}
          <div className="form-section">
            <div className="section-header">
              <Zap size={20} className="section-icon" />
              <div className="section-info">
                <label className="section-label">Starts In (minutes)</label>
                <p className="section-description">
                  Code expires after this duration
                </p>
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
                  When you create attendance, a code and QR will appear here for
                  students to use.
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
              After the countdown, students joining within 30 minutes are marked
              as late. After that, they are marked absent.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleCreateAttendance}>
            Create Attendance
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAttendanceModal;
