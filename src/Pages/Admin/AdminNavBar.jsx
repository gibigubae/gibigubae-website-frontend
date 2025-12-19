import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminNavBar.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <span className="sidebar-title">{collapsed ? "GG" : "GIGI GUBAE"}</span>

        <button
          className="collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
        >
          ☰
        </button>
      </div>

      <ul className="sidebar-menu">
        <li onClick={() => navigate("/admin/courses")}>
          📘 {!collapsed && "Courses"}
        </li>

        <li onClick={() => navigate("/admin/create-course")}>
          ➕ {!collapsed && "Create Course"}
        </li>

        <li onClick={() => navigate("/admin/attendance")}>
          📝 {!collapsed && "Mark Attendance"}
        </li>

        {/* Easy to extend */}
        {/* 
        <li onClick={() => navigate("/admin/users")}>
          👥 {!collapsed && "Users"}
        </li>
        */}
      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          🚪 {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
