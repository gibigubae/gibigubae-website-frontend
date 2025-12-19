import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../styles/CourseAttendanceStyle.css";

const CourseAttendance = () => {
  const { id: courseId } = useParams(); // Get courseId from URL
  const base_url = import.meta.env.VITE_API_URL;

  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch all attendance records for this course
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(
          `${base_url}/attendance/course/${courseId}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();

        if (data.success) {
          setSessions(data.data);
          // Automatically select the most recent session if available
          if (data.data.length > 0) {
            setSelectedSessionId(data.data[0].id);
          }
        } else {
          setError("Failed to load attendance records.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [base_url, courseId]);

  // 2. Handle Marking Attendance
  const handleToggleAttendance = async (
    studentId,
    attendanceId,
    currentStatus
  ) => {
    // Optimistic UI Update: Flip the boolean in the UI immediately
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === attendanceId) {
          return {
            ...session,
            students: session.students.map((student) => {
              if (student.id === studentId) {
                return {
                  ...student,
                  StudentAttendance: {
                    ...student.StudentAttendance,
                    present: !currentStatus,
                  },
                };
              }
              return student;
            }),
          };
        }
        return session;
      })
    );

    try {
      const response = await fetch(`${base_url}/attendance/mark/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studentId: studentId,
          attendanceId: attendanceId,
          present: !currentStatus, // Send the new status
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error("API failed");
      }
    } catch (err) {
      console.error("Failed to mark attendance", err);
      alert("Failed to update attendance. Reverting changes.");
      // Revert changes if API fails (Optional: Trigger a re-fetch)
    }
  };

  // Helper to get the currently selected session object
  const currentSession = sessions.find(
    (s) => s.id === parseInt(selectedSessionId)
  );

  if (loading) return <div className="loading">Loading Attendance...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="attendance-container">
      <h2 className="page-title">Course Attendance Management</h2>

      <div className="attendance-layout">
        {/* Sidebar: List of Dates/Sessions */}
        <div className="session-sidebar">
          <h3>Sessions</h3>
          {sessions.length === 0 ? (
            <p>No attendance sessions found.</p>
          ) : (
            <ul>
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className={selectedSessionId === session.id ? "active" : ""}
                  onClick={() => setSelectedSessionId(session.id)}
                >
                  <span className="session-date">
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                  <span className="session-code">Code: {session.code}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Content: Student List for Selected Session */}
        <div className="student-list-area">
          {currentSession ? (
            <>
              <div className="list-header">
                <h3>
                  Students for {new Date(currentSession.date).toDateString()}
                </h3>
                <span className="student-count">
                  Total: {currentSession.students.length}
                </span>
              </div>

              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID Number</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentSession.students.map((student) => {
                    const isPresent =
                      student.StudentAttendance?.present || false;
                    return (
                      <tr
                        key={student.id}
                        className={isPresent ? "present-row" : "absent-row"}
                      >
                        <td>
                          {student.first_name} {student.father_name}
                        </td>
                        <td>{student.id_number}</td>
                        <td>
                          <span
                            className={`status-pill ${
                              isPresent ? "present" : "absent"
                            }`}
                          >
                            {isPresent ? "Present" : "Absent"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`toggle-btn ${
                              isPresent ? "btn-absent" : "btn-present"
                            }`}
                            onClick={() =>
                              handleToggleAttendance(
                                student.id,
                                currentSession.id,
                                isPresent
                              )
                            }
                          >
                            Mark {isPresent ? "Absent" : "Present"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <div className="no-selection">
              Select a session to view students
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseAttendance;
