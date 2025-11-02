"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AttendanceCard from "../../Components/AttendanceCard"
import RecordAttendanceModal from "../../Components/RecordAttendanceModal"
import "../../styles/CourseDetail.css"
import StudentNavBar from "./StudentNavBar"

const CourseDetail = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState("cards")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAttendance, setSelectedAttendance] = useState(null)
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      date: "Aug 20, 2025",
      timeStart: "08:00",
      timeEnd: "10:30",
      status: "present",
    },
    {
      id: 2,
      date: "Aug 21, 2025",
      timeStart: "10:00",
      timeEnd: "11:30",
      status: "present",
    },
    {
      id: 3,
      date: "Aug 22, 2025",
      timeStart: "14:00",
      timeEnd: "16:00",
      status: "absent",
    },
    {
      id: 4,
      date: "Aug 23, 2025",
      timeStart: "08:00",
      timeEnd: "10:30",
      status: "present",
    },
    {
      id: 5,
      date: "Aug 24, 2025",
      timeStart: "14:00",
      timeEnd: "16:30",
      status: "pending",
    },
  ])

  const course = {
    id: courseId || 1,
    title: "Marketing Analytics Bootcamp",
    description: "Hands-on course covering attribution, cohort analysis, experimentation, and advanced metrics.",
  }

  const handlePendingClick = (attendance) => {
    setSelectedAttendance(attendance)
    setIsModalOpen(true)
  }

  const handleAttendanceSubmit = (code) => {
    console.log("[v0] Recording attendance with code:", code, "for:", selectedAttendance)

    // Update the attendance record to present status
    setAttendanceRecords((prevRecords) =>
      prevRecords.map((record) =>
        record.date === selectedAttendance.date && record.timeStart === selectedAttendance.timeStart
          ? { ...record, status: "present" }
          : record,
      ),
    )

    // Close modal will happen in modal component after success animation
  }

  return (
    <>
    <StudentNavBar />
   
    <div className="course-detail-container">
      {/* Header */}
      <div className="course-detail-header">
        <div className="breadcrumb">
          <button className="breadcrumb-link" onClick={() => navigate("/student/courses")}>
            Courses
          </button>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{course.title}</span>
        </div>

        <div className="course-title-section">
          <h1 className="course-title">{course.title}</h1>
          <button className="edit-button">Edit</button>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="attendance-section">
        <div className="attendance-header">
          <h2 className="attendance-title">Attendance dates</h2>
          <button
            className={`view-toggle ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode(viewMode === "cards" ? "list" : "cards")}
          >
            {viewMode === "cards" ? "List" : "Cards"}
          </button>
        </div>

        {/* Cards View */}
        {viewMode === "cards" && (
          <div className="attendance-cards-grid">
            {attendanceRecords.map((record) => (
              <AttendanceCard
                key={record.id}
                date={record.date}
                timeStart={record.timeStart}
                timeEnd={record.timeEnd}
                status={record.status}
                onPendingClick={handlePendingClick}
              />
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="attendance-list">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.date}</td>
                    <td>{`${record.timeStart} — ${record.timeEnd}`}</td>
                    <td>
                      <span className={`status-badge ${record.status}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <RecordAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAttendanceSubmit}
        date={selectedAttendance?.date}
        time={`${selectedAttendance?.timeStart} — ${selectedAttendance?.timeEnd}`}
      />
    </div>
     </>
  )
}

export default CourseDetail
