import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <>
      <AdminSidebar />
      <main style={{ marginLeft: "240px", padding: "20px" }}>{children}</main>
    </>
  );
};

export default AdminLayout;
