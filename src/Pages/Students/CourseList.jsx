import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../Components/CourseCard";
import "../../styles/CourseList.css";
import StudentNavBar from "./StudentNavBar";

const CourseList = () => {
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_URL;

  const [courses, setCourses] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${base_url}/course/my`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);

        const formatted = data.data.map((course) => {
          const now = new Date();
          const start = new Date(course.start_date);
          const end = new Date(course.end_date);

          let status = "Current";
          if (start > now) status = "Upcoming";
          if (end < now) status = "Past";

          return {
            id: course.id,
            title: course.course_name,
            description: course.description,
            start_date: course.start_date,
            end_date: course.end_date,
            status,
          };
        });

        setCourses(formatted);
      } catch (err) {
        console.error(err);
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

  const handleView = (courseId) => {
    if (!courseId) return;
    navigate(`/student/course/${courseId}`);
  };

  const handleEdit = () => alert("Students cannot edit courses.");

  return (
    <>
      <StudentNavBar />
      <div className="course-list-container">
        <div className="course-list-header">
          <h1 className="page-title">Courses</h1>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
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
                onView={handleView}
                onEdit={handleEdit}
                userType="student"
              />
            ))}
          </div>
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </>
  );
};

export default CourseList;
