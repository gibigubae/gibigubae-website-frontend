"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import CourseCard from "../../Components/CourseCard"
import "../../styles/CourseList.css"
import AdminNavBar from "./AdminNavBar"

const CourseLists = () => {
  const navigate = useNavigate()
  // Mock data - replace with API call
  const [courses] = useState([
    {
      id: 1,
      title: "Introduction to Product Design",
      description: "Learn the fundamentals of product design. UI research, wireframing, and prototyping.",
      status: "Current",
    },
    {
      id: 2,
      title: "Marketing Analytics Bootcamp",
      description: "Hands-on course covering attribution, cohort analysis, experimentation, and advanced metrics.",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Data Science with Python",
      description: "From data wrangling to model deployment—build end-to-end projects using Python.",
      status: "Current",
    },
    {
      id: 4,
      title: "Agile Project Management",
      description: "Master Scrum, Kanban, and stakeholder communication with practical exercises.",
      status: "Upcoming",
    },
    {
      id: 5,
      title: "Visual Communication Basics",
      description: "Explore layout, typography, and color theory to create compelling visuals.",
      status: "All",
    },
    {
      id: 6,
      title: "Cybersecurity Essentials",
      description: "Threat modeling, networks security, and best practices to protect modern systems.",
      status: "Current",
    },
  ])

  const [filterStatus, setFilterStatus] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter courses based on status and search term
  const filteredCourses = courses.filter((course) => {
    const matchesStatus = filterStatus === "All" || course.status === filterStatus
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const handleEdit = (courseId) => {
    console.log("Edit course:", courseId)
  }

  const handleView = (courseId) => {
    navigate(`/admin/course/${courseId}`)
  }

  return (
    <>
      <AdminNavBar />
      <div className="course-list-container">
        {/* Header */}
        <div className="course-list-header">
          <h1 className="page-title">Courses</h1>

          {/* Search Bar */}
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search courses..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {["All", "Upcoming", "Current", "Past"].map((status) => (
              <button
                key={status}
                className={`filter-tab ${filterStatus === status ? "active" : ""}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onEdit={handleEdit} onView={handleView} userType="admin" />
            ))
          ) : (
            <div className="no-courses">
              <p>No courses found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CourseLists
