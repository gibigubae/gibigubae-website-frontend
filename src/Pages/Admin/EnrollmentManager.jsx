import { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  UserPlus,
  Users,
  CheckCircle,
  Trash2,
} from "lucide-react";
import "../../styles/EnrollmentManager.css";
import LoadingPage from "../../Components/LoadingPage";

const EnrollmentManager = () => {
  const base_url = import.meta.env.VITE_API_URL;

  // Data States
  const [courses, setCourses] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Master list
  const [enrolledStudents, setEnrolledStudents] = useState([]); // Students in selected course

  // UI States
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);

  // 1. Initial Fetch: Get All Courses and All Students
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [courseRes, studentRes] = await Promise.all([
          fetch(`${base_url}/course/`, { credentials: "include" }),
          fetch(`${base_url}/student/all`, { credentials: "include" }),
        ]);

        const courseData = await courseRes.json();
        const studentData = await studentRes.json();

        if (courseData.success) setCourses(courseData.data);
        if (studentData.success) setAllStudents(studentData.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [base_url]);

  // 2. Fetch Enrolled Students when Course Changes
  useEffect(() => {
    if (!selectedCourseId) {
      setEnrolledStudents([]);
      return;
    }

    const fetchEnrolled = async () => {
      try {
        const response = await fetch(
          `${base_url}/course/students/${selectedCourseId}`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        if (data.success) {
          setEnrolledStudents(data.students || []);
        }
      } catch (error) {
        console.error("Error fetching enrolled students:", error);
      }
    };

    fetchEnrolled();
  }, [selectedCourseId, base_url]);

  // 3. Calculate Available Students (All Students - Enrolled Students)
  // Also applies Search Filter
  const getFilteredLists = () => {
    const enrolledIds = new Set(enrolledStudents.map((s) => s.id));
    const lowerSearch = searchTerm.toLowerCase();

    // Helper to filter by search term
    const matchesSearch = (s) =>
      `${s.first_name} ${s.father_name}`.toLowerCase().includes(lowerSearch) ||
      s.id_number.toLowerCase().includes(lowerSearch);

    const available = allStudents.filter(
      (s) => !enrolledIds.has(s.id) && matchesSearch(s),
    );

    const enrolled = enrolledStudents.filter((s) => matchesSearch(s));

    return { available, enrolled };
  };

  const { available, enrolled } = getFilteredLists();

  // 4. Handle Enrollment Action
  const handleEnroll = async (student) => {
    setEnrollLoading(true);
    try {
      const response = await fetch(`${base_url}/enrollment/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studentId: student.id,
          courseId: parseInt(selectedCourseId),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Optimistically update UI: Move student from Available to Enrolled
        setEnrolledStudents((prev) => [...prev, student]);
      } else {
        alert(data.message || "Enrollment failed");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      alert("Failed to connect to server");
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleUnenroll = async (studentId) => {
    // 1. Confirmation
    const confirmed = window.confirm(
      "Are you sure you want to remove this student from the course?",
    );
    if (!confirmed) return;

    try {
      // 2. API Call
      const response = await fetch(`${base_url}/enrollment/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studentId: studentId,
          courseId: parseInt(selectedCourseId),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 3. UI Update: Remove from enrolled list
        // (This automatically moves them back to 'Available' because of the logic in getFilteredLists)
        setEnrolledStudents((prev) => prev.filter((s) => s.id !== studentId));
      } else {
        alert(data.message || "Failed to remove enrollment");
      }
    } catch (error) {
      console.error("Unenroll error:", error);
      alert("Error removing student.");
    }
  };

  return (
    <>
      <div className="enrollment-container">
        <div className="page-header">
          <h1>Course Enrollment Manager</h1>
          <p>Select a course to manage its students.</p>
        </div>

        {/* Course Selector */}
        <div className="controls-bar">
          <div className="select-wrapper">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="course-select"
            >
              <option value=""> Select a Course </option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>

          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <LoadingPage message="Loading enrollment data..." />
        ) : !selectedCourseId ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>No Course Selected</h3>
            <p>Please select a course from the dropdown above to begin.</p>
          </div>
        ) : (
          <div className="dual-list-container">
            {/* LEFT: Available Students */}
            <div className="list-panel">
              <div className="panel-header">
                <h3>Available Students</h3>
                <span className="count-badge">{available.length}</span>
              </div>
              <div className="panel-body">
                {available.length === 0 ? (
                  <p className="no-items">No matching students available.</p>
                ) : (
                  available.map((student) => (
                    <div key={student.id} className="student-item available">
                      <div className="student-info">
                        <span className="student-name">
                          {student.first_name} {student.father_name}
                        </span>
                        <span className="student-id">{student.id_number}</span>
                      </div>
                      <button
                        className="action-btn enroll-btn"
                        onClick={() => handleEnroll(student)}
                        disabled={enrollLoading}
                        title="Enroll Student"
                      >
                        Enroll <ChevronRight size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* RIGHT: Enrolled Students */}
            <div className="list-panel">
              <div className="panel-header success">
                <h3>Enrolled Students</h3>
                <span className="count-badge success">{enrolled.length}</span>
              </div>
              <div className="panel-body">
                {enrolled.length === 0 ? (
                  <p className="no-items">No students enrolled yet.</p>
                ) : (
                  enrolled.map((student) => (
                    <div key={student.id} className="student-item enrolled">
                      <div className="student-left-group">
                        <div className="student-icon">
                          <CheckCircle size={18} />
                        </div>
                        <div className="student-info">
                          <span className="student-name">
                            {student.first_name} {student.father_name}
                          </span>
                          <span className="student-id">
                            {student.id_number}
                          </span>
                        </div>
                      </div>

                      <button
                        className="action-btn remove-btn"
                        onClick={() => handleUnenroll(student.id)}
                        title="Remove from Course"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EnrollmentManager;
