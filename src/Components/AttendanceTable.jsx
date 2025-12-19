import { useState, useEffect } from "react";
import "../styles/AttendanceTable.css";

const AttendanceTable = ({ courseId, refreshKey }) => {
  const base_url = import.meta.env.VITE_API_URL;

  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, sessionsRes] = await Promise.all([
          fetch(`${base_url}/course/students/${courseId}`, {
            credentials: "include",
          }),
          fetch(`${base_url}/attendance/course/${courseId}`, {
            credentials: "include",
          }),
        ]);

        const studentsData = await studentsRes.json();
        const sessionsData = await sessionsRes.json();

        if (studentsData.success && sessionsData.success) {
          setStudents(studentsData.students);

          // Sort: Newest date first (Left to Right)
          const sortedSessions = sessionsData.data.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setSessions(sortedSessions);
        }
      } catch (error) {
        console.error("Error loading table data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [base_url, courseId, refreshKey]);

  const handleStatusChange = async (studentId, attendanceId, newValue) => {
    const isPresent = newValue === "Present";

    // 1. Optimistic UI Update: Directly update the boolean in local state
    setSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === attendanceId) {
          return {
            ...session,
            students: session.students.map((std) => {
              if (std.id === studentId) {
                // Ensure nested structure exists
                const currentAtt = std.StudentAttendance || {};
                return {
                  ...std,
                  StudentAttendance: {
                    ...currentAtt,
                    present: isPresent,
                  },
                };
              }
              return std;
            }),
          };
        }
        return session;
      })
    );

    // 2. API Call
    try {
      await fetch(`${base_url}/attendance/mark/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studentId: studentId,
          attendanceId: attendanceId,
          present: isPresent,
        }),
      });
    } catch (error) {
      console.error("Failed to mark attendance", error);
      alert("Failed to update status.");
    }
  };

  const getStatus = (studentId, session) => {
    const record = session.students.find((s) => s.id === studentId);

    // If no record exists yet, it's technically neither, but usually implies Absent or Not Marked
    if (!record || !record.StudentAttendance) return "";

    // Return string for dropdown
    return record.StudentAttendance.present ? "Present" : "Absent";
  };

  if (loading)
    return <div className="loading-spinner">Loading Attendance Sheet...</div>;

  return (
    <div className="attendance-table-container">
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th className="sticky-col header-col">
                Student Name{" "}
                <span className="student-count">({students.length})</span>
              </th>
              {sessions.map((session) => (
                <th key={session.id} className="date-col">
                  {new Date(session.date).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                  <div className="sub-header">{session.code}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="sticky-col name-col">
                  <div className="student-name">
                    {student.first_name} {student.father_name}
                  </div>
                  <div className="student-id">{student.id_number}</div>
                </td>
                {sessions.map((session) => {
                  const currentStatus = getStatus(student.id, session);
                  return (
                    <td key={session.id} className="status-cell">
                      <select
                        className={`status-select ${
                          currentStatus ? currentStatus.toLowerCase() : "empty"
                        }`}
                        value={currentStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            student.id,
                            session.id,
                            e.target.value
                          )
                        }
                      >
                        {/* Placeholder if data is missing */}
                        {currentStatus === "" && (
                          <option value="" disabled>
                            Select
                          </option>
                        )}
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
