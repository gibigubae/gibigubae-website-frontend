"use client"

import "../styles/AttendanceCard.css"

const AttendanceCard = ({ date, timeStart, timeEnd, status, onPendingClick }) => {
  const handleClick = () => {
    if (status === "pending" && onPendingClick) {
      onPendingClick({ date, timeStart, timeEnd })
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "present":
        return "✓"
      case "absent":
        return "✕"
      case "pending":
        return "⏱"
      default:
        return "?"
    }
  }

  const getStatusClass = () => {
    return `attendance-card ${status} ${status === "pending" ? "clickable" : ""}`
  }

  return (
    <div className={getStatusClass()} onClick={handleClick}>
      <div className="attendance-icon">{getStatusIcon()}</div>
      <div className="attendance-date">{date}</div>
      <div className="attendance-time">
        {timeStart} — {timeEnd}
      </div>
    </div>
  )
}

export default AttendanceCard
