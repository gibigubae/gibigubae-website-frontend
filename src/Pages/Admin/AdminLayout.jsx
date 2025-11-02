import AdminNavBar from "./AdminNavBar"

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminNavBar />
      <main className="admin-main">{children}</main>
    </div>
  )
}

export default AdminLayout
