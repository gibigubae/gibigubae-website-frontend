import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./Pages/Login"
import SignUp from "./Pages/SignUp"
import StudentLayout from "./Pages/Students/StudentLayout"
// Admin routes temporarily commented out to simplify frontend build
// import AdminLayout from "./Pages/Admin/AdminLayout"
import CourseList from "./Pages/Students/CourseList"
// Admin components commented out for now
// import CourseLists from "./Pages/Admin/CourseLists"
// import CreateCourses from "./Pages/Admin/CreateCourses"
// import MarkAttendance from "./Pages/Admin/MarkAttendance"
// import CourseDetails from "./Pages/Admin/CourseDetails"
import "./App.css"
import CourseDetail from "./Pages/Students/CourseDetail"
import CourseLists from "./Pages/Admin/CourseLists"
import CreateCourses from "./Pages/Admin/CreateCourses"
import CourseDetails from "./Pages/Admin/CourseDetails"
import MarkAttendance from "./Pages/Admin/MarkAttendance"
import RecordAttendanceModal from "./Components/RecordAttendanceModal"

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token")
  const userRole = localStorage.getItem("userRole")

  if (!token) {
    return <Navigate to="/" replace />
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student/courses" element={<CourseList />} />
        <Route path="/student/course/:id" element={<CourseDetail />} />
        <Route path="/student/attendance" element={<RecordAttendanceModal />} />

        <Route path="/admin/courses" element={<CourseLists />} /> 
        <Route path="/admin/create-course" element={<CreateCourses />}/>
        <Route path="/admin/course/:courseId" element={<CourseDetails />} />
        <Route path="/admin/attendance" element={<MarkAttendance />} />

        {/* Student Routes */}
        {/* <Route
          path="/student/*"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentLayout>
                <Routes>
                  <Route path="courses" element={<CourseList />} />
                  <Route path="attendance" element={<Attendance />} />
                  <Route path="*" element={<Navigate to="/student/courses" replace />} />
                </Routes>
              </StudentLayout>
            </ProtectedRoute>
          }
        /> */}

        {/* Admin Routes commented out temporarily to focus on student frontend */}
        {/**
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout>
                <Routes>
                  <Route path="courses" element={<CourseLists />} />
                  <Route path="create-course" element={<CreateCourses />} />
                  <Route path="attendance" element={<MarkAttendance />} />
                  <Route path="course-details" element={<CourseDetails />} />
                  <Route path="*" element={<Navigate to="/admin/courses" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        */}

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
