import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCourseAttendance, useMarkAttendanceAdmin } from "../../hooks/useAttendance";
import "../../styles/CourseAttendanceStyle.css";

const CourseAttendance = () => {
  const { id: courseId } = useParams();

  const [selectedSessionId, setSelectedSessionId] = useState(null);

  // Use React Query hooks
  const { data, isLoading, error, isError } = useCourseAttendance(courseId);
  const markAttendanceMutation = useMarkAttendanceAdmin();

  // Transform data
  const sessions = data?.success ? data.data : [];

  // Automatically select the most recent session when data loads
  if (sessions.length > 0 && !selectedSessionId) {
    setSelectedSessionId(sessions[0].id);
  }

  // Handle Marking Attendance
  const handleToggleAttendance = async (studentId, attendanceId, currentStatus) => {
    markAttendanceMutation.mutate({
      studentId: studentId,
      attendanceId: attendanceId,
      present: !currentStatus,
    }, {
      onError: (err) => {
        console.error("Failed to mark attendance", err);
        alert("Failed to update attendance.");
      },
    });
  };

  // Helper to get the currently selected session object
  const currentSession = sessions.find((s) => s.id === parseInt(selectedSessionId));

  if (isLoading) return <div className="loading">Loading Attendance...</div>;
  if (isError || error) return <div className="error">{error?.response?.data?.message || error?.message || "Error loading attendance"}</div>;

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
