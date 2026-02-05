import { Edit2, Eye, Trash2 } from "lucide-react";
import "../styles/CourseCard.css";

const CourseCard = ({
  course,
  onEdit,
  onDelete,
  onView,
  userType = "student",
}) => {
  const handleDeleteClick = async () => {
    try {
      await onDelete(course.id);
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="course-card">
      {/* Status Badge */}
      <div
        className={`course-status-badge status-${
          course.status?.toLowerCase() || "all"
        }`}
      >
        {course.status || "All"}
      </div>

      {/* Course Title */}
      <h3 className="course-title">{course.title}</h3>

      {/* Course Description */}
      <p className="course-description">{course.description}</p>

      {/* Action Buttons */}
      <div className="course-actions">
        {userType !== "student" && (
          <>
            <button
              className="action-btn edit-btn"
              onClick={() => onEdit(course)}
              aria-label="Edit course"
              title="Edit"
            >
              <Edit2 size={18} />
              <span className="btn-text">Edit</span>
            </button>

            <button
              className="action-btn delete-btn"
              onClick={handleDeleteClick}
              aria-label="Delete course"
              title="Delete"
            >
              <Trash2 size={18} />
              <span className="btn-text">Delete</span>
            </button>
          </>
        )}

        <button
          className="action-btn view-btn"
          onClick={() => onView(course.id)}
          aria-label="View course"
          title="View"
        >
          <span className="btn-text">View</span>
          <Eye size={18} />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
