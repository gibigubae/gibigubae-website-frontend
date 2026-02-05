import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyCourses } from "../../hooks/useCourses";
import CourseCard from "../../Components/CourseCard";
import "../../styles/CourseList.css";
import LoadingPage from "../../Components/LoadingPage";
import ErrorPage from "../../Components/ErrorPage";

const CourseList = () => {
  const navigate = useNavigate();

  // Use React Query hook
  const { data, isLoading, error, isError } = useMyCourses();

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Transform API data
  const courses = data?.success
    ? data.data.map((course) => {
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
      })
    : [];

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

        {isLoading ? (
          <LoadingPage message="Loading courses..." />
        ) : isError ? (
          <ErrorPage
            title="Failed to Load Courses"
            message={error?.response?.data?.message || error?.message || "Failed to load courses"}
            onRetry={() => window.location.reload()}
          />
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
