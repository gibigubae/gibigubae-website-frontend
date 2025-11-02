"use client"

import "../../styles/MarkAttendance.css"
import { useState } from "react"
import AdminNavBar from "./AdminNavBar"

// Mock data for development
const MOCK_DATA = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "present",
    color: "#3b82f6",
    avatar: "JD",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "late",
    color: "#8b5cf6",
    avatar: "JS",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "absent",
    color: "#ef4444",
    avatar: "MJ",
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily@example.com",
    status: "present",
    color: "#10b981",
    avatar: "EB",
  },
]

export default function MarkAttendance({ data, filter, setFilter }) {
  const [expandedUser, setExpandedUser] = useState(null)

  // Use mock data if real data is not provided
  const users = data && Array.isArray(data) ? data : MOCK_DATA

  const handleExportCSV = () => {
    alert("CSV exported")
  }

  const handleExportPDF = () => {
    alert("PDF exported")
  }

  const getStatusColor = (status) => {
    const colors = {
      present: "#10b981",
      late: "#f59e0b",
      absent: "#ef4444",
    }
    return colors[status] || "#ccc"
  }

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

return (
    <>
    <AdminNavBar />
    <div className="attendance-container" >
        <div className="attendance-modal">
            <div className="modal-header">
                <h2>Attendance — Aug 24, 2025</h2>
            </div>

            <div style={{ padding: "12px 20px" }}>
                {/* Quick Filters */}
                <div className="filters-section">
                    <h3>Quick filters</h3>
                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filter === "all" ? "active" : ""}`}
                            onClick={() => setFilter("all")}
                        >
                            All
                        </button>
                        <button
                            className={`filter-btn ${filter === "upcoming" ? "active" : ""}`}
                            onClick={() => setFilter("upcoming")}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`filter-btn ${filter === "current" ? "active" : ""}`}
                            onClick={() => setFilter("current")}
                        >
                            Current
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="table-section">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th className="status-header">Status</th>
                                <th className="actions-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="user-row">
                                    <td className="user-cell">
                                        <div className="user-info">
                                            <div className="avatar-wrapper">
                                                <div
                                                    className="avatar"
                                                    style={{ backgroundColor: user.color }}
                                                >
                                                    {user.avatar}
                                                </div>
                                                <div
                                                    className="status-dot"
                                                    style={{ backgroundColor: getStatusColor(user.status) }}
                                                ></div>
                                            </div>
                                            <div className="user-details">
                                                <div className="user-name">{user.name}</div>
                                                <div className="user-email">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="status-cell">
                                        <span
                                            className="status-badge"
                                            style={{
                                                color: getStatusColor(user.status),
                                                borderColor: getStatusColor(user.status),
                                            }}
                                        >
                                            {getStatusLabel(user.status)}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <div className="actions-group">
                                            <button className="action-btn">Mark Late</button>
                                            <button className="action-btn">Mark Present</button>
                                            <button className="action-btn">Mark Absent</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Export Section */}
                <div className="export-section">
                    <button className="export-btn" onClick={handleExportCSV}>
                        Export CSV
                    </button>
                    <button className="export-btn" onClick={handleExportPDF}>
                        Export PDF
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>

)
}