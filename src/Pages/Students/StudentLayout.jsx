import StudentNavBar from "./StudentNavBar"

const StudentLayout = ({ children }) => {
  return (
    <div className="student-layout">
      <StudentNavBar />
      <main className="student-main">{children}</main>
    </div>
  )
}

export default StudentLayout
