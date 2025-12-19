import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, X, Save } from "lucide-react";
import "../../styles/StudentList.css";

const StudentList = () => {
  const base_url = import.meta.env.VITE_API_URL;
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // State for Editing
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({});

  // 1. Initial Fetch
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${base_url}/student/all`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Search Functionality
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchStudents(); // Reset if empty
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${base_url}/student/search/${searchTerm}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Functionality
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${base_url}/student/admin/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        alert("Student deleted successfully");
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // 4. Edit Logic
  const openEditModal = (student) => {
    setEditingStudent(student);
    // Populate form with existing data
    setEditForm({
      first_name: student.first_name || "",
      father_name: student.father_name || "",
      grand_father_name: student.grand_father_name || "",
      christian_name: student.christian_name || "",
      id_number: student.id_number || "",
      email: student.email || "",
      phone_number: student.phone_number || "",
      department: student.department || "",
      year: student.year || "",
      dorm_block: student.dorm_block || "",
      room_number: student.room_number || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${base_url}/student/admin/update/${editingStudent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(editForm),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update local state to reflect changes without refreshing
        setStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? data.data : s))
        );
        setEditingStudent(null);
        alert("Student updated successfully");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update student");
    }
  };

  return (
    <>
      <div className="student-list-container">
        <div className="page-header">
          <h1>Student Management</h1>

          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Search by name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <Search size={18} />
            </button>
          </form>
        </div>

        {loading ? (
          <div className="loading">Loading students...</div>
        ) : (
          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID Number</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Dorm/Room</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.id_number}</td>
                      <td>
                        {student.first_name} {student.father_name}{" "}
                        {student.grand_father_name}
                      </td>
                      <td>{student.department || "-"}</td>
                      <td>{student.year || "-"}</td>
                      <td>
                        {student.dorm_block ? `B${student.dorm_block}` : "-"} /{" "}
                        {student.room_number || "-"}
                      </td>
                      <td className="action-cell">
                        <button
                          className="btn-icon edit"
                          onClick={() => openEditModal(student)}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="btn-icon delete"
                          onClick={() => handleDelete(student.id)}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {editingStudent && (
          <div
            className="modal-overlay"
            onClick={() => setEditingStudent(null)}
          >
            <div
              className="modal-content large"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Edit Student Details</h2>
                <button
                  className="close-btn"
                  onClick={() => setEditingStudent(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={submitUpdate} className="edit-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      name="first_name"
                      value={editForm.first_name}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Father Name</label>
                    <input
                      name="father_name"
                      value={editForm.father_name}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>G. Father Name</label>
                    <input
                      name="grand_father_name"
                      value={editForm.grand_father_name}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Christian Name</label>
                    <input
                      name="christian_name"
                      value={editForm.christian_name}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>ID Number</label>
                    <input
                      name="id_number"
                      value={editForm.id_number}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      name="phone_number"
                      value={editForm.phone_number}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      name="department"
                      value={editForm.department}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      name="year"
                      type="number"
                      value={editForm.year}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Dorm Block</label>
                    <input
                      name="dorm_block"
                      value={editForm.dorm_block}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Number</label>
                    <input
                      name="room_number"
                      value={editForm.room_number}
                      onChange={handleEditChange}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setEditingStudent(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentList;
