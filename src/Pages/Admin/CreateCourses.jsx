import { useState } from "react";
import "../../styles/CreateCourse.css";

const CreateCourses = () => {
  const [formData, setFormData] = useState({
    course_name: "",
    description: "",
    year_level: "",
    semester: "",
    start_date: "",
    end_date: "",
    enrollment_start_date: "",
    enrollment_deadline: "",
  });

  const base_url = import.meta.env.VITE_API_URL;
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.course_name.trim())
      newErrors.course_name = "Course name is required";

    if (!formData.description.trim())
      newErrors.description = "Course description is required";
    else if (formData.description.length > 280)
      newErrors.description = "Description must be 280 characters or less";

    // 2. Added validation for Year Level and Semester
    if (!formData.year_level) newErrors.year_level = "Year level is required";
    if (!formData.semester) newErrors.semester = "Semester is required";

    if (!formData.start_date)
      newErrors.start_date = "Course start date is required";

    if (!formData.end_date) newErrors.end_date = "Course end date is required";
    else if (new Date(formData.end_date) <= new Date(formData.start_date))
      newErrors.end_date = "End date must be after start date";

    if (!formData.enrollment_start_date)
      newErrors.enrollment_start_date = "Enrollment start date is required";

    if (!formData.enrollment_deadline)
      newErrors.enrollment_deadline = "Enrollment end date is required";
    else if (
      new Date(formData.enrollment_deadline) <=
      new Date(formData.enrollment_start_date)
    )
      newErrors.enrollment_deadline =
        "Enrollment end date must be after start date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMsg("");

    try {
      // 3. Prepare payload: Convert year and semester to integers
      const payload = {
        ...formData,
        year_level: parseInt(formData.year_level, 10),
        semester: parseInt(formData.semester, 10),
      };

      console.log("[v0] Submitting course data:", payload);

      const response = await fetch(`${base_url}/course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await response.json();
      if (!data.success) {
        setErrors({
          submit: data.message || data.error || "Course Creation Failed",
        });
        return;
      }

      setSuccessMsg("Course created successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);

      // Reset form
      setFormData({
        course_name: "",
        description: "",
        year_level: "",
        semester: "",
        start_date: "",
        end_date: "",
        enrollment_start_date: "",
        enrollment_deadline: "",
      });
    } catch (error) {
      console.error("Error creating course:", error);
      setErrors({ submit: "Failed to create course. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = formData.description.length;

  return (
    <>
      <div className="create-course-container">
        <div className="create-course-card">
          <h1 className="create-course-title">Create Course</h1>

          {successMsg && <div className="success-popup">{successMsg}</div>}
          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <form onSubmit={handleSubmit} className="create-course-form">
            {/* Course Name */}
            <div className="form-group">
              <label className="form-label">Course name</label>
              <input
                type="text"
                name="course_name"
                value={formData.course_name}
                onChange={handleChange}
                placeholder="e.g., Introduction to Product Design"
                className={`form-input ${
                  errors.course_name ? "input-error" : ""
                }`}
              />
              {errors.course_name && (
                <span className="error-text">{errors.course_name}</span>
              )}
            </div>

            {/* Course Description */}
            <div className="form-group">
              <label className="form-label">Course description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a concise summary..."
                className={`form-textarea ${
                  errors.description ? "input-error" : ""
                }`}
                rows="4"
              />
              <div className="char-count">
                Keep it under 280 characters. ({charCount}/280)
              </div>
              {errors.description && (
                <span className="error-text">{errors.description}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Year Level</label>
                <input
                  type="number"
                  name="year_level"
                  value={formData.year_level}
                  onChange={handleChange}
                  placeholder="e.g., 3"
                  min="1"
                  className={`form-input ${
                    errors.year_level ? "input-error" : ""
                  }`}
                />
                {errors.year_level && (
                  <span className="error-text">{errors.year_level}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Semester</label>
                <input
                  type="number"
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="e.g., 1"
                  min="1"
                  max="3"
                  className={`form-input ${
                    errors.semester ? "input-error" : ""
                  }`}
                />
                {errors.semester && (
                  <span className="error-text">{errors.semester}</span>
                )}
              </div>
            </div>

            {/* Date Fields */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Course start date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.start_date ? "input-error" : ""
                  }`}
                />
                {errors.start_date && (
                  <span className="error-text">{errors.start_date}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Course end date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.end_date ? "input-error" : ""
                  }`}
                />
                {errors.end_date && (
                  <span className="error-text">{errors.end_date}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Enrollment start date</label>
                <input
                  type="date"
                  name="enrollment_start_date"
                  value={formData.enrollment_start_date}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.enrollment_start_date ? "input-error" : ""
                  }`}
                />
                {errors.enrollment_start_date && (
                  <span className="error-text">
                    {errors.enrollment_start_date}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Enrollment end date</label>
                <input
                  type="date"
                  name="enrollment_deadline"
                  value={formData.enrollment_deadline}
                  onChange={handleChange}
                  className={`form-input ${
                    errors.enrollment_deadline ? "input-error" : ""
                  }`}
                />
                {errors.enrollment_deadline && (
                  <span className="error-text">
                    {errors.enrollment_deadline}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="create-course-button"
            >
              {isSubmitting ? "Creating course..." : "Create course"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCourses;
