"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  Users,
  Calendar,
  Edit2,
  BarChart3,
} from "lucide-react";
import CreateAttendanceModal from "../../Components/CreateAttendanceModal";
import "../../styles/CourseDetails.css";
import AdminNavBar from "./AdminNavBar";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_URL;

  const [course, setCourse] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // Fetch all courses first
        const courseRes = await fetch(`${base_url}/course/${courseId}`, {
          credentials: "include",
        });
        const courseData = await courseRes.json();
        if (!courseData.success)
          throw new Error(courseData.message || "Failed to fetch course");
        setCourse({
          id: courseData.data.id,
          title: courseData.data.course_name,
          description: courseData.data.description,
          startDate: new Date(courseData.data.start_date).toLocaleDateString(),
          endDate: new Date(courseData.data.end_date).toLocaleDateString(),
          instructor: courseData.data.instructor || "Admin",
        });

        // Fetch attendance for this course
        const attendanceRes = await fetch(
          `${base_url}/attendance/course/${courseId}`,
          {
            credentials: "include",
          }
        );
        const attendanceData = await attendanceRes.json();
        if (!attendanceData.success)
          throw new Error(
            attendanceData.message || "Failed to fetch attendance"
          );

        const formattedAttendance = attendanceData.data.map((item) => ({
          id: item.id,
          date: new Date(item.date).toLocaleDateString(),
          time: new Date(item.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          highlighted: item.status === "present",
        }));

        setAttendance(formattedAttendance);
      } catch (err) {
        console.error(err);
        setError("Failed to load course details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, base_url]);

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!course) return <p>Course not found.</p>;

  return (
    <>
      <AdminNavBar />
      <div className="course-details-container">
        {/* Header Section */}
        <div className="details-header">
          <button
            className="back-button"
            onClick={() => navigate("/admin/courses")}
          >
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
              <p className="info-value">{attendance.length} Enrolled</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon clock-icon">
              <Clock size={24} />
            </div>
            <div className="info-content">
              <p className="info-label">Sessions</p>
              <p className="info-value">{attendance.length} Scheduled</p>
            </div>
          </div>
        </div>

        {/* Attendance Section */}
        <div className="attendance-section">
          <div className="section-header">
            <h2 className="section-title">Attendance Dates</h2>
            <button className="view-all-link">View All</button>
          </div>

          <div className="attendance-grid">
            {attendance.map((att) => (
              <div
                key={att.id}
                className={`attendance-card ${
                  att.highlighted ? "highlighted" : ""
                }`}
              >
                <div className="attendance-date">
                  <span className="date-text">{att.date}</span>
                </div>
                <div className="attendance-time">
                  <Clock size={16} />
                  <span>{att.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <span className="btn-icon">+</span>
            Create Attendance
          </button>
          <button className="btn btn-secondary">
            <BarChart3 size={18} />
            Analytics
          </button>
        </div>

        {/* Modal */}
        <CreateAttendanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          courseTitle={course.title}
        />
      </div>
    </>
  );
};

export default CourseDetails;
