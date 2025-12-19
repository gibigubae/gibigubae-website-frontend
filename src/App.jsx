import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Auth & Public Pages
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";

// Student Pages
import CourseList from "./Pages/Students/CourseList";
import CourseDetail from "./Pages/Students/CourseDetail";
import RecordAttendanceModal from "./Components/RecordAttendanceModal";

// Admin Layout & Pages
import AdminLayout from "./Pages/Admin/AdminLayout";
import CourseLists from "./Pages/Admin/CourseLists";
import CreateCourses from "./Pages/Admin/CreateCourses";
import CourseDetails from "./Pages/Admin/CourseDetails";
import StudentList from "./Pages/Admin/StudentList";
import EnrollmentManager from "./Pages/Admin/EnrollmentManager";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // 1. Check Token
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Check Role (if specific role required)
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* --- Student Routes --- */}
        {/* You can wrap these in a StudentLayout later if needed */}
        <Route path="/student/courses" element={<CourseList />} />
        <Route path="/student/course/:id" element={<CourseDetail />} />
        <Route path="/student/attendance" element={<RecordAttendanceModal />} />

        {/* --- Admin Routes (Wrapped in Layout) --- */}
        <Route
          path="/admin"
          element={
            // <ProtectedRoute requiredRole="admin"> {/* Uncomment to enable protection */}
            <AdminLayout />
            // </ProtectedRoute>
          }
        >
          {/* Nested Routes - These render inside the <Outlet /> of AdminLayout */}
          <Route path="courses" element={<CourseLists />} />
          <Route path="create-course" element={<CreateCourses />} />
          <Route path="course/:courseId" element={<CourseDetails />} />
          <Route path="student-management" element={<StudentList />} />
          <Route path="Enroll-students" element={<EnrollmentManager />} />

          {/* Default redirect for /admin */}
          <Route index element={<Navigate to="courses" replace />} />
        </Route>

        {/* --- Fallback Route --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
