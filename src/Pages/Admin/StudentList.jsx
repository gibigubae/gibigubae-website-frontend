import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, X, Save } from "lucide-react";
import Swal from "sweetalert2";
import "../../styles/StudentList.css";
import LoadingPage from "../../Components/LoadingPage";

const StudentList = () => {
  const base_url = import.meta.env.VITE_API_URL;
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // State for Editing
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    department: "",
    year: "",
  });

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
      Swal.fire("Error", "Failed to fetch students", "error");
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
      Swal.fire("Error", "Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // 3. Delete Logic (Fixed variable names & added Swal)
  const handleDelete = async (id) => {
    // 1. Show the custom alert
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      Swal.fire({
        title: "Deleting...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await fetch(`${base_url}/student/admin/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Delete failed");
      }

      // Show success message
      Swal.fire({
        title: "Deleted!",
        text: "The student has been deleted.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      // Update state to remove the deleted student
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete student.",
        icon: "error",
      });
    }
  };

  // 4. Edit Logic
  const openEditModal = (student) => {
    setEditingStudent(student);
    // Only populate the fields the backend allows updating
    setEditForm({
      department: student.department || "",
      year: student.year || "",
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const submitUpdate = async (e) => {
    e.preventDefault();

    // Prepare payload exactly as requested
    const payload = {
      year: parseInt(editForm.year, 10), // Ensure it is a number
      department: editForm.department,
    };

    try {
      const response = await fetch(
        `${base_url}/student/admin/update/${editingStudent.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Update local state
        setStudents((prev) =>
          prev.map((s) =>
            s.id === editingStudent.id
              ? { ...s, ...payload } // Update only modified fields in UI
              : s,
          ),
        );
        setEditingStudent(null);

        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Student details updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.message || "Could not update student",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred",
      });
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
          <LoadingPage message="Loading students..." />
        ) : (
          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID Number</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>BlockNumber/Room</th>
                  <th>Edit/Delete</th>
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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Edit Student Details</h2>
                <button
                  className="close-btn"
                  onClick={() => setEditingStudent(null)}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Informational Header */}
              <div style={{ marginBottom: "20px", color: "#666" }}>
                Editing:{" "}
                <strong>
                  {editingStudent.first_name} {editingStudent.father_name}
                </strong>{" "}
                ({editingStudent.id_number})
              </div>

              <form onSubmit={submitUpdate} className="edit-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      name="department"
                      value={editForm.department}
                      onChange={handleEditChange}
                      placeholder="e.g. Software Engineering"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      name="year"
                      type="number"
                      value={editForm.year}
                      onChange={handleEditChange}
                      placeholder="e.g. 4"
                      required
                      min="1"
                      max="7"
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
