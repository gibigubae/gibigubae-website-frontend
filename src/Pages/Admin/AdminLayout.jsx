import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Assuming file is named AdminNavBar.jsx

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Pass state down to sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Dynamic margin based on collapsed state */}
      <main
        style={{
          marginLeft: collapsed ? "70px" : "240px",
          padding: "20px",
          transition: "margin-left 0.25s ease", // Smooth transition to match CSS
        }}
      >
        {/* Renders the child route components */}
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
