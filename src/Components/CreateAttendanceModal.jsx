import { useState } from "react";
import { X, Zap, AlertCircle, Check } from "lucide-react";
import { useParams } from "react-router-dom";
import { useCreateAttendance } from "../hooks/useAttendance";
import "../styles/CreateAttendanceModal.css";

const CreateAttendanceModal = ({ isOpen, onClose, onSuccess, courseTitle }) => {
  const [startTime, setStartTime] = useState(10);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { courseId } = useParams();
  
  // Use React Query mutation
  const createAttendanceMutation = useCreateAttendance();

  const handleCreateAttendance = async () => {
    setError("");

    createAttendanceMutation.mutate(
      {
        courseId: courseId,
        minutes: startTime,
      },
      {
        onSuccess: () => {
          setSuccess(true);
          if (onSuccess) onSuccess();

          setTimeout(() => {
            setSuccess(false);
            setStartTime(10);
            onClose();
          }, 1500);
        },
        onError: (err) => {
          console.error("Error:", err);
          setError(err?.response?.data?.message || err?.message || "An error occurred");
        },
      }
    );
  };

  const handleTimeChange = (e) => {
    const value = Math.min(
      Math.max(Number.parseInt(e.target.value) || 0, 0),
      120,
    );
    setStartTime(value);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-left">
            <h2 className="modal-title">Create Attendance</h2>
            <p className="modal-subtitle">{courseTitle}</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
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
                className="time-input"
              />
              <span className="time-unit">min</span>
            </div>
          </div>

          <div className="qr-section">
            <p className="qr-label">QR / Code Display</p>
            <div className="qr-placeholder">
              <div className="qr-content">
                <div className="qr-icon-large">⬜</div>
                <p className="qr-text">Code will appear here after creation.</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="message error-message">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="message success-message">
              <Check size={18} />
              <span>Attendance created successfully!</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreateAttendance}
            disabled={createAttendanceMutation.isPending || success}
          >
            {createAttendanceMutation.isPending ? "Creating..." : "Create Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAttendanceModal;
