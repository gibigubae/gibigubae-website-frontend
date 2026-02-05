import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AttendanceCard from "../../Components/AttendanceCard";
import RecordAttendanceModal from "../../Components/RecordAttendanceModal";
import "../../styles/CourseDetail.css";
import LoadingPage from "../../Components/LoadingPage";
import ErrorPage from "../../Components/ErrorPage";

const CourseDetail = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_URL;

  const [viewMode, setViewMode] = useState("cards");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Changed to false initially
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        const [attRes, courseRes] = await Promise.all([
          fetch(`${base_url}/attendance/student/course/${courseId}`, {
            credentials: "include",
          }),
          fetch(`${base_url}/course/${courseId}`, {
            credentials: "include",
          }),
        ]);

        const attData = await attRes.json();
        const courseData = await courseRes.json();

        if (!attData.success) throw new Error("Failed to fetch attendance");
        if (!courseData.success) throw new Error("Failed to fetch course");

        const now = new Date();

        // --- FIXED MAPPING WITH EXPIRATION LOGIC ---
        const formatted = attData.data
          .map((rec) => {
            const rawDate = rec.attendance.date;

            // 1. Get the official start date/time (assuming rawDate is an ISO string or similar)
            const startDate = new Date(rawDate);

            // 2. Calculate the End Date: Start Date + 30 Minutes
            const endDate = new Date(startDate.getTime() + 30 * 60000); // 30 minutes * 60 seconds * 1000 milliseconds

            // 3. Format times (using a standard formatter for HH:MM)
            const timeOptions = {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            };
            const timeStart = startDate.toLocaleTimeString(
              "en-US",
              timeOptions,
            );
            const timeEnd = endDate.toLocaleTimeString("en-US", timeOptions);

            let status = "";
            if (rec.present === true) {
              status = "present";
            } else if (rec.present === false) {
              status = "absent";
            } else if (endDate < now) {
              // NEW LOGIC: If present is null AND the session has ended, mark as expired/absent
              status = "expired";
            } else {
              // Session is ongoing or hasn't started, and attendance is not yet marked
              status = "pending";
            }

            return {
              id: rec.attendance.id,
              rawDate: rawDate,
              date: new Date(rawDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
              timeStart: timeStart,
              timeEnd: timeEnd,
              status: status, // New status can be 'present', 'absent', 'pending', or 'expired'
              code: rec.attendance.code,
            };
          })
          .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

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

  if (loading) return <LoadingPage message="Loading course..." />;
  if (!course)
    return (
      <ErrorPage
        title="Course Not Found"
        message="The requested course could not be found."
      />
    );

  // Find the latest attendance record that is NOT 'present' and NOT 'expired'
  // This assumes the latest record in the sorted array is the one to check.
  const latestActiveRecord = attendanceRecords
    .slice()
    .reverse()
    .find((rec) => ["pending", "absent"].includes(rec.status));

  const handlePendingClick = (record) => {
    // Only allow clicking on the latestActiveRecord
    if (!latestActiveRecord || record.id !== latestActiveRecord.id) return;

    setSelectedAttendance(record);
    setIsModalOpen(true);
  };

  const handleAttendanceSubmit = async (code) => {
    if (!selectedAttendance) return;

    // This is where you would call the API to mark attendance
    try {
      const res = await fetch(`${base_url}/attendance/mark/student`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          attendanceId: selectedAttendance.id,
          code,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Update the status of the attendance record in state to 'present'
        setAttendanceRecords((prev) =>
          prev.map((rec) =>
            rec.id === selectedAttendance.id
              ? // Assuming API returns a status in data.data.status, otherwise hardcode 'present'
                { ...rec, status: data.data.status || "present" }
              : rec,
          ),
        );
        // The modal will close after the success message in RecordAttendanceModal.jsx
      } else {
        // Handle API error/wrong code submission
        alert(`Error: ${data.message || "Invalid code or system error."}`);
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while marking attendance.");
    }
  };

  return (
    <>
      <div className="course-detail-container">
        <div className="course-detail-header">
          {/* ... (Breadcrumb and Title remain the same) ... */}
          <div className="breadcrumb">
            <button
              onClick={() => navigate("/student/courses")}
              className="breadcrumb-link"
            >
              Courses
            </button>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{course.course_name}</span>
          </div>
          <h1 className="course-title">{course.course_name}</h1>
        </div>

        <div className="attendance-section">
          <div className="attendance-header">
            <h2 className="attendance-title">Attendance</h2>
            <button
              onClick={() =>
                setViewMode(viewMode === "cards" ? "list" : "cards")
              }
              className={`view-toggle ${viewMode === "list" ? "active" : ""}`}
            >
              {viewMode === "cards" ? "List" : "Cards"}
            </button>
          </div>

          {viewMode === "cards" ? (
            <div className="attendance-cards-grid">
              {attendanceRecords.map((rec) => (
                <AttendanceCard
                  key={rec.id}
                  date={rec.date}
                  timeStart={rec.timeStart}
                  timeEnd={rec.timeEnd}
                  status={rec.status}
                  // Make clickable only if it's the latest active record
                  clickable={rec.id === latestActiveRecord?.id}
                  onPendingClick={() => handlePendingClick(rec)}
                />
              ))}
            </div>
          ) : (
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    // Added onClick for table view
                    onClick={
                      rec.id === latestActiveRecord?.id
                        ? () => handlePendingClick(rec)
                        : undefined
                    }
                    style={
                      rec.id === latestActiveRecord?.id
                        ? {
                            cursor: "pointer",
                            fontWeight: "bold",
                          }
                        : {}
                    }
                  >
                    <td>{rec.date}</td>
                    <td>
                      {rec.timeStart} — {rec.timeEnd}
                    </td>
                    <td>
                      <span className={`status-badge ${rec.status}`}>
                        {rec.status.charAt(0).toUpperCase() +
                          rec.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <RecordAttendanceModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
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
