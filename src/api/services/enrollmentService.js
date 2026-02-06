import apiClient from '../apiClient';

/**
 * Enrollment Service
 * Handles course enrollment and unenrollment operations
 */

export const enrollmentService = {
  /**
   * Get enrolled students for a course
   * @param {string|number} courseId - Course ID
   * @returns {Promise} Response with enrolled students
   */
  getEnrolledStudents: async (courseId) => {
    const response = await apiClient.get(`/course/students/${courseId}`);
    return response.data;
  },

  /**
   * Enroll a student in a course
   * @param {Object} enrollmentData - { studentId, courseId }
   * @returns {Promise} Response confirming enrollment
   */
  enrollStudent: async (enrollmentData) => {
    const response = await apiClient.post('/enrollment/', enrollmentData);
    return response.data;
  },

  /**
   * Unenroll a student from a course
   * @param {Object} enrollmentData - { studentId, courseId }
   * @returns {Promise} Response confirming unenrollment
   */
  unenrollStudent: async (enrollmentData) => {
    const response = await apiClient.delete('/enrollment/', { data: enrollmentData });
    return response.data;
  },

  /**
   * Self-enroll in a course (student enrolls themselves)
   * @param {number} courseId - Course ID to enroll in
   * @returns {Promise} Response confirming enrollment
   */
  selfEnroll: async (courseId) => {
    const response = await apiClient.post('/enrollment/self', { courseId });
    return response.data;
  },
};

export default enrollmentService;
