import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // Assuming file is named AdminNavBar.jsx

const AdminLayout = () => {
  // Initialize collapsed state based on screen size
  const [collapsed, setCollapsed] = useState(() => {
    return window.innerWidth < 1024; // Collapsed on mobile/tablet
  });

  // Force collapse on mobile/tablet, allow toggle on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true); // Always collapsed on mobile/tablet
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
