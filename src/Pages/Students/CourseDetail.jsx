"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AttendanceCard from "../../Components/AttendanceCard";
import RecordAttendanceModal from "../../Components/RecordAttendanceModal";
import StudentNavBar from "./StudentNavBar";
import "../../styles/CourseDetail.css";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_URL;

  const [viewMode, setViewMode] = useState("cards");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const res = await fetch(`${base_url}/auth/me`, { credentials: "include" });
        const data = await res.json();
        if (data.success) setStudentId(data.data.id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentId();
  }, [base_url]);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        const [attRes, courseRes] = await Promise.all([
          fetch(`${base_url}/attendance/course/${courseId}/student`, { credentials: "include" }),
          fetch(`${base_url}/courses/${courseId}`, { credentials: "include" }),
        ]);

        const attData = await attRes.json();
        const courseData = await courseRes.json();

        if (!attData.success) throw new Error("Failed to fetch attendance");
        if (!courseData.success) throw new Error("Failed to fetch course");

        const formatted = attData.data.map((rec) => ({
          id: rec.id,
          rawDate: rec.date,
          date: new Date(rec.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          timeStart: rec.time_start,
          timeEnd: rec.time_end,
          status: rec.status,
          code: rec.code,
        })).sort((a,b) => new Date(a.rawDate)-new Date(b.rawDate));

        setAttendanceRecords(formatted);
        setCourse(courseData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [base_url, courseId]);

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

  const latestAttendance = attendanceRecords[attendanceRecords.length - 1];

  const handlePendingClick = (record) => {
    if (!latestAttendance) return;
    if (record.id !== latestAttendance.id) return;
    if (!["absent","pending"].includes(record.status)) return;

    setSelectedAttendance(record);
    setIsModalOpen(true);
  };

  const handleAttendanceSubmit = async (code) => {
    if (!studentId || !selectedAttendance) return;
    try {
      const res = await fetch(`${base_url}/attendance/mark/code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ student_id: studentId, course_id: Number(courseId), code }),
      });
      const data = await res.json();
      if (data.success) {
        setAttendanceRecords(prev =>
          prev.map(rec => rec.id === selectedAttendance.id ? { ...rec, status: data.data.status } : rec)
        );
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <StudentNavBar />
      <div className="course-detail-container">
        <div className="course-detail-header">
          <div className="breadcrumb">
            <button onClick={() => navigate("/student/courses")} className="breadcrumb-link">Courses</button>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{course.course_name}</span>
          </div>
          <h1 className="course-title">{course.course_name}</h1>
        </div>

        <div className="attendance-section">
          <div className="attendance-header">
            <h2 className="attendance-title">Attendance</h2>
            <button onClick={() => setViewMode(viewMode==="cards"?"list":"cards")} className={`view-toggle ${viewMode==="list"?"active":""}`}>
              {viewMode==="cards"?"List":"Cards"}
            </button>
          </div>

          {viewMode==="cards" ? (
            <div className="attendance-cards-grid">
              {attendanceRecords.map(rec => (
                <AttendanceCard
                  key={rec.id}
                  date={rec.date}
                  timeStart={rec.timeStart}
                  timeEnd={rec.timeEnd}
                  status={rec.status}
                  clickable={rec.id === latestAttendance?.id && ["absent","pending"].includes(rec.status)}
                  onPendingClick={()=>handlePendingClick(rec)}
                />
              ))}
            </div>
          ) : (
            <table className="attendance-table">
              <thead><tr><th>Date</th><th>Time</th><th>Status</th></tr></thead>
              <tbody>
                {attendanceRecords.map(rec=>(
                  <tr key={rec.id}>
                    <td>{rec.date}</td>
                    <td>{rec.timeStart} — {rec.timeEnd}</td>
                    <td><span className={`status-badge ${rec.status}`}>{rec.status.charAt(0).toUpperCase()+rec.status.slice(1)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <RecordAttendanceModal
            isOpen={isModalOpen}
            onClose={()=>setIsModalOpen(false)}
            onSubmit={handleAttendanceSubmit}
            date={selectedAttendance?.date}
            time={`${selectedAttendance?.timeStart} — ${selectedAttendance?.timeEnd}`}
          />
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
