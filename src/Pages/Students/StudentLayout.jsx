import { Outlet } from "react-router-dom";
import StudentNavBar from "./StudentNavBar";

const StudentLayout = () => {
  return (
    <div className="student-layout">
      <StudentNavBar />
      <main className="student-main">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
