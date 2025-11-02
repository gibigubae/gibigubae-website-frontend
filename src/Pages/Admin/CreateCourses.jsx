"use client"

import { useState } from "react"
import "../../styles/CreateCourse.css"
import AdminNavBar from "./AdminNavBar"

const CreateCourses = () => {
  const [formData, setFormData] = useState({
    courseName: "",
    courseDescription: "",
    courseStartDate: "",
    courseEndDate: "",
    enrollmentStartDate: "",
    enrollmentEndDate: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required"
    }

    if (!formData.courseDescription.trim()) {
      newErrors.courseDescription = "Course description is required"
    } else if (formData.courseDescription.length > 280) {
      newErrors.courseDescription = "Description must be 280 characters or less"
    }

    if (!formData.courseStartDate) {
      newErrors.courseStartDate = "Course start date is required"
    }

    if (!formData.courseEndDate) {
      newErrors.courseEndDate = "Course end date is required"
    } else if (new Date(formData.courseEndDate) <= new Date(formData.courseStartDate)) {
      newErrors.courseEndDate = "End date must be after start date"
    }

    if (!formData.enrollmentStartDate) {
      newErrors.enrollmentStartDate = "Enrollment start date is required"
    }

    if (!formData.enrollmentEndDate) {
      newErrors.enrollmentEndDate = "Enrollment end date is required"
    } else if (new Date(formData.enrollmentEndDate) <= new Date(formData.enrollmentStartDate)) {
      newErrors.enrollmentEndDate = "Enrollment end date must be after start date"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call to create course
      console.log("[v0] Submitting course data:", formData)

      // Simulated API call
      // const response = await fetch('https://gibigubae-website-backend.onrender.com/api/courses', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Mock success for now
      alert("Course created successfully!")
      setFormData({
        courseName: "",
        courseDescription: "",
        courseStartDate: "",
        courseEndDate: "",
        enrollmentStartDate: "",
        enrollmentEndDate: "",
      })
    } catch (error) {
      console.error("[v0] Error creating course:", error)
      setErrors({ submit: "Failed to create course. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const charCount = formData.courseDescription.length

  return (
    <>
    <AdminNavBar />
    <div className="create-course-container">
      <div className="create-course-card">
        <h1 className="create-course-title">Create Course</h1>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="create-course-form">
          {/* Course Name */}
          <div className="form-group">
            <label className="form-label">Course name</label>
            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g., Introduction to Product Design"
              className={`form-input ${errors.courseName ? "input-error" : ""}`}
            />
            {errors.courseName && <span className="error-text">{errors.courseName}</span>}
          </div>

          {/* Course Description */}
          <div className="form-group">
            <label className="form-label">Course description</label>
            <textarea
              name="courseDescription"
              value={formData.courseDescription}
              onChange={handleChange}
              placeholder="Write a concise summary of the course content, learning outcomes, and prerequisites."
              className={`form-textarea ${errors.courseDescription ? "input-error" : ""}`}
              rows="4"
            />
            <div className="char-count">Keep it under 280 characters. ({charCount}/280)</div>
            {errors.courseDescription && <span className="error-text">{errors.courseDescription}</span>}
          </div>

          {/* Date Fields Row 1 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Course start date</label>
              <input
                type="date"
                name="courseStartDate"
                value={formData.courseStartDate}
                onChange={handleChange}
                className={`form-input ${errors.courseStartDate ? "input-error" : ""}`}
              />
              {errors.courseStartDate && <span className="error-text">{errors.courseStartDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Course end date</label>
              <input
                type="date"
                name="courseEndDate"
                value={formData.courseEndDate}
                onChange={handleChange}
                className={`form-input ${errors.courseEndDate ? "input-error" : ""}`}
              />
              {errors.courseEndDate && <span className="error-text">{errors.courseEndDate}</span>}
            </div>
          </div>

          {/* Date Fields Row 2 */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Enrollment start date</label>
              <input
                type="date"
                name="enrollmentStartDate"
                value={formData.enrollmentStartDate}
                onChange={handleChange}
                className={`form-input ${errors.enrollmentStartDate ? "input-error" : ""}`}
              />
              {errors.enrollmentStartDate && <span className="error-text">{errors.enrollmentStartDate}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Enrollment end date</label>
              <input
                type="date"
                name="enrollmentEndDate"
                value={formData.enrollmentEndDate}
                onChange={handleChange}
                className={`form-input ${errors.enrollmentEndDate ? "input-error" : ""}`}
              />
              {errors.enrollmentEndDate && <span className="error-text">{errors.enrollmentEndDate}</span>}
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="create-course-button">
            {isSubmitting ? "Creating course..." : "Create course"}
          </button>
        </form>
      </div>
    </div>
    </>

  )
}

export default CreateCourses
