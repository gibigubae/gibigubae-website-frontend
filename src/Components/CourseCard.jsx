"use client"
import { Edit2, Eye } from "lucide-react"
import "../styles/CourseCard.css"

const CourseCard = ({ course, onEdit, onView, userType = "student" }) => {
  return (
    <div className="course-card">
      {/* Status Badge */}
      <div className={`course-status-badge status-${course.status?.toLowerCase() || "all"}`}>
        {course.status || "All"}
      </div>

      {/* Course Title */}
      <h3 className="course-title">{course.title}</h3>

      {/* Course Description */}
      <p className="course-description">{course.description}</p>

      {/* Action Buttons */}
      <div className="course-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => onEdit(course.id)}
          aria-label="Edit course"
          title="Edit"
        >
          <Edit2 size={18} />
          <span className="btn-text">Edit</span>
        </button>

        <button
          className="action-btn view-btn"
          onClick={() => onView(course.id)}
          aria-label="View course"
          title="View"
        >
          <Eye size={18} />
          <span className="btn-text">View</span>
        </button>
      </div>
    </div>
  )
}

export default CourseCard
