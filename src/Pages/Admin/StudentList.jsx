import { useState } from "react";
import { Search, Edit2, Trash2, X, Save, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { useStudents, useUpdateStudent, useDeleteStudent } from "../../hooks/useStudents";
import "../../styles/StudentList.css";
import LoadingPage from "../../Components/LoadingPage";

const StudentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  // Use React Query hooks
  const { data, isLoading } = useStudents();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();

  // State for Editing
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    department: "",
    year: "",
  });

  // Get students list - use search results if available, otherwise use all students
  const students = searchResults !== null 
    ? searchResults 
    : (data?.success ? data.data : []);

  // Handle search - manually trigger searchstudents endpoint
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults(null); // Clear search results
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/student/search/${searchTerm}`, {
        credentials: "include",
      });
      const searchData = await response.json();
      
      if (searchData.success) {
        setSearchResults(searchData.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      Swal.fire("Error", "Search failed", "error");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Delete Logic
  const handleDelete = async (id) => {
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

    Swal.fire({
      title: "Deleting...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    deleteStudentMutation.mutate(id, {
      onSuccess: () => {
        Swal.fire({
          title: "Deleted!",
          text: "The student has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      },
      onError: (error) => {
        console.error("Delete failed:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete student.",
          icon: "error",
        });
      },
    });
  };

  // Edit Logic
  const openEditModal = (student) => {
    setEditingStudent(student);
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

    const payload = {
      year: parseInt(editForm.year, 10),
      department: editForm.department,
    };

    updateStudentMutation.mutate(
      { id: editingStudent.id, data: payload },
      {
        onSuccess: () => {
          setEditingStudent(null);
          Swal.fire({
            icon: "success",
            title: "Updated!",
            text: "Student details updated successfully",
            timer: 2000,
            showConfirmButton: false,
          });
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to update student",
          });
        },
      }
    );
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

        {isLoading || isSearching ? (
          <LoadingPage message={isSearching ? "Searching students..." : "Loading students..."} />
        ) : (
          <>
            {searchResults !== null && (
              <div style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '10px', borderRadius: '4px' }}>
                Found {students.length} student{students.length !== 1 ? 's' : ''} matching "{searchTerm}"
                <button 
                  onClick={() => { setSearchResults(null); setSearchTerm(''); }}
                  style={{ marginLeft: '10px', padding: '4px 8px', cursor: 'pointer' }}
                >
                  Clear Search
                </button>
              </div>
            )}
          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID Number</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>BlockNumber/Room</th>
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
                          className="btn-icon view"
                          onClick={() => setViewingStudent(student)}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
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

          {/* Card View for Mobile */}
          <div className="student-cards">
            {students.length > 0 ? (
              students.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="card-header">
                    <div className="card-name">
                      {student.first_name} {student.father_name}{" "}
                      {student.grand_father_name}
                    </div>
                    <span
                      className={`status-badge ${student.is_verified ? "verified" : "pending"}`}
                    >
                      {student.is_verified ? "✓" : "⋯"}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="card-row">
                      <span className="card-label">ID:</span>
                      <span className="card-value">{student.id_number}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Department:</span>
                      <span className="card-value">
                        {student.department || "-"}
                      </span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Year:</span>
                      <span className="card-value">{student.year || "-"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Dorm:</span>
                      <span className="card-value">
                        {student.dorm_block ? `Block ${student.dorm_block}` : "-"} / Room {student.room_number || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn-icon view"
                      onClick={() => setViewingStudent(student)}
                      title="View Details"
                    >
                      <Eye size={18} />
                      <span>View</span>
                    </button>
                    <button
                      className="btn-icon edit"
                      onClick={() => openEditModal(student)}
                      title="Edit"
                    >
                      <Edit2 size={18} />
                      <span>Edit</span>
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(student.id)}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No students found.</div>
            )}
          </div>
          </>
        )}

        {/* Detail View Modal */}
        {viewingStudent && (
          <div
            className="modal-overlay"
            onClick={() => setViewingStudent(null)}
          >
            <div className="modal-content detail-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Student Details</h2>
                <button
                  className="close-btn"
                  onClick={() => setViewingStudent(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="detail-content">
                {/* Personal Information */}
                <div className="detail-section">
                  <h3 className="section-title">Personal Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">ID Number:</span>
                      <span className="detail-value">{viewingStudent.id_number}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">First Name:</span>
                      <span className="detail-value">{viewingStudent.first_name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Father Name:</span>
                      <span className="detail-value">{viewingStudent.father_name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Grandfather Name:</span>
                      <span className="detail-value">{viewingStudent.grand_father_name}</span>
                    </div>
                    {viewingStudent.christian_name && (
                      <div className="detail-item">
                        <span className="detail-label">Christian Name:</span>
                        <span className="detail-value">{viewingStudent.christian_name}</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="detail-label">Gender:</span>
                      <span className="detail-value">{viewingStudent.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="detail-section">
                  <h3 className="section-title">Contact Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{viewingStudent.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">+251 {viewingStudent.phone_number}</span>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="detail-section">
                  <h3 className="section-title">Academic Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Department:</span>
                      <span className="detail-value">{viewingStudent.department || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Year:</span>
                      <span className="detail-value">{viewingStudent.year || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Status:</span>
                      <span className={`status-badge ${viewingStudent.is_verified ? 'verified' : 'pending'}`}>
                        {viewingStudent.is_verified ? 'Verified' : 'Pending Verification'}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Graduated:</span>
                      <span className="detail-value">{viewingStudent.is_graduated ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>

                {/* Housing Information */}
                <div className="detail-section">
                  <h3 className="section-title">Housing Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Dorm Block:</span>
                      <span className="detail-value">{viewingStudent.dorm_block ? `Block ${viewingStudent.dorm_block}` : '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Room Number:</span>
                      <span className="detail-value">{viewingStudent.room_number || '-'}</span>
                    </div>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="detail-section">
                  <h3 className="section-title">Account Information</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{new Date(viewingStudent.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Last Updated:</span>
                      <span className="detail-value">{new Date(viewingStudent.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
