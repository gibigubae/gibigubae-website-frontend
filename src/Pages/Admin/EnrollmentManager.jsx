import { useState } from "react";
import {
  Search,
  ChevronRight,
  UserPlus,
  Users,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { useCourses } from "../../hooks/useCourses";
import { useStudents } from "../../hooks/useStudents";
import { useEnrolledStudents, useEnrollStudent, useUnenrollStudent } from "../../hooks/useEnrollment";
import "../../styles/EnrollmentManager.css";
import LoadingPage from "../../Components/LoadingPage";

const EnrollmentManager = () => {
  // UI States
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Use React Query hooks
  const { data: coursesData, isLoading: coursesLoading } = useCourses();
  const { data: studentsData, isLoading: studentsLoading } = useStudents();
  const { data: enrolledData, refetch: refetchEnrolled } = useEnrolledStudents(selectedCourseId);
  
  const enrollMutation = useEnrollStudent();
  const unenrollMutation = useUnenrollStudent();

  const isLoading = coursesLoading || studentsLoading;

  // Transform data
  const courses = coursesData?.success ? coursesData.data : [];
  const allStudents = studentsData?.success ? studentsData.data : [];
  const enrolledStudents = enrolledData?.success ? enrolledData.students : [];

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

  // Handle Enrollment Action
  const handleEnroll = async (student) => {
    enrollMutation.mutate({
      studentId: student.id,
      courseId: parseInt(selectedCourseId),
    }, {
      onSuccess: () => {
        // Manually refetch to ensure UI updates
        refetchEnrolled();
      },
      onError: (error) => {
        alert(error?.response?.data?.message || error?.message || "Enrollment failed");
      },
    });
  };

  const handleUnenroll = async (studentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this student from the course?",
    );
    if (!confirmed) return;

    unenrollMutation.mutate({
      studentId: studentId,
      courseId: parseInt(selectedCourseId),
    }, {
      onSuccess: () => {
        // Manually refetch to ensure UI updates
        refetchEnrolled();
      },
      onError: (error) => {
        alert(error?.response?.data?.message || error?.message || "Failed to remove enrollment");
      },
    });
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

        {isLoading ? (
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
                        disabled={enrollMutation.isPending}
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
