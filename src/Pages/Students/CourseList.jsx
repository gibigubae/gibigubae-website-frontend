import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudentCourses } from "../../hooks/useCourses";
import { useSelfEnroll } from "../../hooks/useEnrollment";
import CourseCard from "../../Components/CourseCard";
import "../../styles/CourseList.css";
import LoadingPage from "../../Components/LoadingPage";
import ErrorPage from "../../Components/ErrorPage";
import Swal from "sweetalert2";

const CourseList = () => {
  const navigate = useNavigate();

  // Use React Query hooks
  const { data, isLoading, error, isError } = useStudentCourses();
  const enrollMutation = useSelfEnroll();

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("all");

  // Transform API data
  const allCourses = [];
  const semesterOptions = ["all"];

  if (data?.success && data?.courses) {
    // Process each semester
    Object.keys(data.courses).forEach((semesterKey) => {
      const semesterNumber = semesterKey.split("_")[1];
      if (!semesterOptions.includes(semesterKey)) {
        semesterOptions.push(semesterKey);
      }

      data.courses[semesterKey].forEach((course) => {
        const now = new Date();
        const start = new Date(course.start_date);
        const end = new Date(course.end_date);

        let status = "Current";
        if (start > now) status = "Upcoming";
        if (end < now) status = "Past";

        allCourses.push({
          id: course.id,
          title: course.course_name,
          description: course.description,
          start_date: course.start_date,
          end_date: course.end_date,
          semester: semesterNumber,
          semesterKey: semesterKey,
          status,
          alreadyEnrolled: course.alreadyEnrolled,
        });
      });
    });
  }

  const filteredCourses = allCourses.filter((course) => {
    const matchesStatus =
      filterStatus === "All" || course.status === filterStatus;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester =
      selectedSemester === "all" || course.semesterKey === selectedSemester;
    return matchesStatus && matchesSearch && matchesSemester;
  });

  const handleView = (courseId) => {
    if (!courseId) return;
    navigate(`/student/course/${courseId}`);
  };

  const handleEdit = () => {
    Swal.fire({
      icon: "info",
      title: "Action Restricted",
      text: "Students cannot edit courses.",
    });
  };

  const handleEnroll = (courseId) => {
    enrollMutation.mutate(courseId, {
      onSuccess: () => {
        // Course list will auto-refresh due to query invalidation
      },
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: "Enrollment Failed",
          text: error?.response?.data?.message || "Failed to enroll in course",
        });
      },
    });
  };

  return (
    <>
      <div className="course-list-container">
        <div className="course-list-header">
          <h1 className="page-title">Courses</h1>

          {/* {data?.student && (
            <div style={{ marginBottom: "1rem", color: "#666" }}>
              <p><strong>Student:</strong> {data.student.name} (Year {data.student.year})</p>
              <p><strong>Total Courses:</strong> {data.totalCourses}</p>
            </div>
          )} */}

          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="filter-tabs">
            <label style={{ marginRight: "1rem", fontWeight: "bold" }}>
              Semester:
            </label>
            {semesterOptions.map((semester) => (
              <button
                key={semester}
                className={`filter-tab ${
                  selectedSemester === semester ? "active" : ""
                }`}
                onClick={() => setSelectedSemester(semester)}
              >
                {semester === "all"
                  ? "All"
                  : `Semester ${semester.split("_")[1]}`}
              </button>
            ))}
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

        {isLoading ? (
          <LoadingPage message="Loading courses..." />
        ) : isError ? (
          <ErrorPage
            title="Failed to Load Courses"
            message={
              error?.response?.data?.message ||
              error?.message ||
              "Failed to load courses"
            }
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
                onEnroll={handleEnroll}
                userType="student"
                alreadyEnrolled={course.alreadyEnrolled}
                isEnrolling={enrollMutation.isPending}
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
