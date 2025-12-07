"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../../Components/CourseCard";
import "../../styles/CourseList.css";
import AdminNavBar from "./AdminNavBar";

const CourseLists = () => {
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
        const response = await fetch(`${base_url}/course`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!data.success) {
          setError(data.message || "Failed to fetch courses");
        } else {
          // Map API fields to your component
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

  // Filter courses based on status and search term
  const filteredCourses = courses.filter((course) => {
    const matchesStatus = filterStatus === "All" || course.status === filterStatus;
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleEdit = (courseId) => {
    console.log("Edit course:", courseId);
  };

  const handleView = (courseId) => {
    navigate(`/admin/course/${courseId}`);
  };

  return (
    <>
      <AdminNavBar />
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
                className={`filter-tab ${filterStatus === status ? "active" : ""}`}
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
                onEdit={handleEdit}
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
    </>
  );
};

export default CourseLists;
