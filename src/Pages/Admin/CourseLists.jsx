import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../Components/CourseCard";
import "../../styles/CourseList.css";

const CourseLists = () => {
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_URL;

  const [courses, setCourses] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [editForm, setEditForm] = useState({
    course_name: "",
    description: "",
    start_date: "",
    end_date: "",
    enrollment_start_date: "",
    enrollment_deadline: "",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${base_url}/course`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch courses");
        } else {
          const formattedCourses = data.data.map((course) => ({
            id: course.id,
            title: course.course_name,
            description: course.description,
            start_date: course.start_date,
            end_date: course.end_date,
            enrollment_start_date: course.enrollment_start_date,
            enrollment_deadline: course.enrollment_deadline,
            status:
              new Date(course.start_date) > new Date()
                ? "Upcoming"
                : new Date(course.end_date) < new Date()
                ? "Past"
                : "Current",
          }));
          setCourses(formattedCourses);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Error fetching courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [base_url]);

  const filteredCourses = courses.filter((course) => {
    const matchesStatus =
      filterStatus === "All" || course.status === filterStatus;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleEdit = (course) => {
    setEditingCourse(course.id);

    setEditForm({
      course_name: course.title,
      description: course.description,
      start_date: toDateTimeLocal(course.start_date),
      end_date: toDateTimeLocal(course.end_date),
      enrollment_start_date: toDateTimeLocal(course.enrollment_start_date),
      enrollment_deadline: toDateTimeLocal(course.enrollment_deadline),
    });
  };

  const handleView = (courseId) => {
    navigate(`/admin/course/${courseId}`);
  };

  const handleDelete = async (courseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${base_url}/course/${courseId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Delete failed");
      }

      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== courseId)
      );
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  const submitEdit = async () => {
    try {
      const response = await fetch(`${base_url}/course/${editingCourse}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) throw new Error();

      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourse
            ? {
                ...course,
                title: data.data.course_name,
                description: data.data.description,
                start_date: data.data.start_date,
                end_date: data.data.end_date,
                enrollment_start_date: data.data.enrollment_start_date,
                enrollment_deadline: data.data.enrollment_deadline,
                status:
                  new Date(data.data.start_date) > new Date()
                    ? "Upcoming"
                    : new Date(data.data.end_date) < new Date()
                    ? "Past"
                    : "Current",
              }
            : course
        )
      );

      setEditingCourse(null);
    } catch {
      alert("Failed to update course");
    }
  };

  const toDateTimeLocal = (iso) => {
    if (!iso) return "";
    return new Date(iso).toISOString().slice(0, 16);
  };

  const closeModal = () => {
    setEditingCourse(null);
    setEditForm({
      course_name: "",
      description: "",
      start_date: "",
      end_date: "",
      enrollment_start_date: "",
      enrollment_deadline: "",
    });
  };

  return (
    <>
      <div className="course-list-container">
        <div className="course-list-header">
          <h1 className="page-title">Courses</h1>

          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search courses..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-tabs">
            {["All", "Upcoming", "Current", "Past"].map((status) => (
              <button
                key={status}
                className={`filter-tab ${
                  filterStatus === status ? "active" : ""
                }`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredCourses.length > 0 ? (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEdit={() => handleEdit(course)}
                onDelete={handleDelete}
                onView={handleView}
                userType="admin"
              />
            ))}
          </div>
        ) : (
          <div className="no-courses">
            <p>No courses found matching your search.</p>
          </div>
        )}
      </div>

      {editingCourse && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Course</h2>

            <input
              type="text"
              value={editForm.course_name}
              onChange={(e) =>
                setEditForm({ ...editForm, course_name: e.target.value })
              }
              placeholder="Course Name"
            />

            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              placeholder="Description"
            />

            <input
              type="datetime-local"
              value={editForm.start_date}
              onChange={(e) =>
                setEditForm({ ...editForm, start_date: e.target.value })
              }
            />

            <input
              type="datetime-local"
              value={editForm.end_date}
              onChange={(e) =>
                setEditForm({ ...editForm, end_date: e.target.value })
              }
            />

            <input
              type="datetime-local"
              value={editForm.enrollment_start_date}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  enrollment_start_date: e.target.value,
                })
              }
            />

            <input
              type="datetime-local"
              value={editForm.enrollment_deadline}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  enrollment_deadline: e.target.value,
                })
              }
            />

            <div className="modal-actions">
              <button onClick={submitEdit}>Save</button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseLists;
