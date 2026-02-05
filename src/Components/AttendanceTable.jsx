import { useCourseStudents } from "../hooks/useCourses";
import { useCourseAttendance, useMarkAttendanceAdmin } from "../hooks/useAttendance";
import "../styles/AttendanceTable.css";

const AttendanceTable = ({ courseId }) => {
  // Use React Query hooks for parallel data fetching
  const { data: studentsData, isLoading: studentsLoading } = useCourseStudents(courseId);
  const { data: sessionsData, isLoading: sessionsLoading } = useCourseAttendance(courseId);
  const markAttendanceMutation = useMarkAttendanceAdmin();

  const isLoading = studentsLoading || sessionsLoading;

  // Transform data
  const students = studentsData?.success ? studentsData.students : [];
  const sessions = sessionsData?.success
    ? [...sessionsData.data].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  const handleStatusChange = async (studentId, attendanceId, newValue) => {
    const isPresent = newValue === "Present";

    // Use React Query mutation
    markAttendanceMutation.mutate({
      studentId: studentId,
      attendanceId: attendanceId,
      present: isPresent,
    }, {
      onError: (error) => {
        console.error("Failed to mark attendance", error);
        alert("Failed to update status.");
      },
    });
  };

  const getStatus = (studentId, session) => {
    const record = session.students.find((s) => s.id === studentId);

    // If no record exists yet, it's technically neither, but usually implies Absent or Not Marked
    if (!record || !record.StudentAttendance) return "";

    // Return string for dropdown
    return record.StudentAttendance.present ? "Present" : "Absent";
  };

  if (isLoading)
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
