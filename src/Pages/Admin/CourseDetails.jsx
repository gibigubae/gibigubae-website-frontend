"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, Clock, Users, Calendar, Edit2, BarChart3 } from "lucide-react"
import CreateAttendanceModal from "../../Components/CreateAttendanceModal"
import "../../styles/CourseDetails.css"
import AdminNavBar from "./AdminNavBar"

const CourseDetails = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Mock data - replace with API call
  const course = {
    id: courseId || 1,
    title: "Marketing Analytics Bootcamp",
    description: "Hands-on course covering attribution, cohort analysis, experimentation, and advanced metrics.",
    instructor: "Dr. Sarah Johnson",
    students: 42,
    startDate: "Aug 20, 2025",
    endDate: "Sep 15, 2025",
    attendanceDates: [
      { id: 1, date: "Aug 20, 2025", time: "09:00 – 10:30" },
      { id: 2, date: "Aug 21, 2025", time: "10:00 – 11:30" },
      { id: 3, date: "Aug 22, 2025", time: "14:00 – 15:30" },
      { id: 4, date: "Aug 23, 2025", time: "09:00 – 10:30" },
      { id: 5, date: "Aug 24, 2025", time: "14:00 – 15:30", highlighted: true },
    ],
  }

  return (
    <>
      {/* <AdminNavBar /> */}
    <div className="course-details-container">
      {/* Header Section */}
      <div className="details-header">
        <button className="back-button" onClick={() => navigate("/admin/courses")}>
          <ChevronLeft size={20} />
          Back
        </button>
        <div className="header-content">
          <h1 className="course-title">{course.title}</h1>
          <p className="course-meta">By {course.instructor}</p>
        </div>
        <button className="edit-button">
          <Edit2 size={20} />
          Edit
        </button>
      </div>

      {/* Course Info Cards */}
      <div className="info-cards-grid">
        <div className="info-card">
          <div className="info-icon calendar-icon">
            <Calendar size={24} />
          </div>
          <div className="info-content">
            <p className="info-label">Duration</p>
            <p className="info-value">
              {course.startDate} to {course.endDate}
            </p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon users-icon">
            <Users size={24} />
          </div>
          <div className="info-content">
            <p className="info-label">Students</p>
            <p className="info-value">{course.students} Enrolled</p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon clock-icon">
            <Clock size={24} />
          </div>
          <div className="info-content">
            <p className="info-label">Sessions</p>
            <p className="info-value">{course.attendanceDates.length} Scheduled</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="details-content">
        {/* Attendance Section */}
        <div className="attendance-section">
          <div className="section-header">
            <h2 className="section-title">Attendance Dates</h2>
            <button className="view-all-link">View All</button>
          </div>

          <div className="attendance-grid">
            {course.attendanceDates.map((attendance) => (
              <div key={attendance.id} className={`attendance-card ${attendance.highlighted ? "highlighted" : ""}`}>
                <div className="attendance-date">
                  <span className="date-text">{attendance.date}</span>
                </div>
                <div className="attendance-time">
                  <Clock size={16} />
                  <span>{attendance.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <span className="btn-icon">+</span>
            Create Attendance
          </button>
          <button className="btn btn-secondary">
            <BarChart3 size={18} />
            Analytics
          </button>
        </div>
      </div>

      {/* Modal */}
      <CreateAttendanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} courseTitle={course.title} />
    </div>
    </>

  )
}

export default CourseDetails
