import apiClient from '../apiClient';

/**
 * Analytics Service
 * Handles all analytics and reporting operations
 */

export const analyticsService = {
  /**
   * 1. Get daily analytics overview
   * @returns {Promise} Response with daily attendance stats
   */
  getDailyOverview: async () => {
    const response = await apiClient.get('/analytics/daily/overview');
    return response.data;
  },

  /**
   * 2. Get course list analytics
   * @returns {Promise} Response with all courses analytics
   */
  getCourseListAnalytics: async () => {
    const response = await apiClient.get('/analytics/courses');
    return response.data;
  },

  /**
   * 3. Get attendance trend (last 7 days)
   * @returns {Promise} Response with daily attendance trend
   */
  getAttendanceTrend: async () => {
    const response = await apiClient.get('/analytics/attendance-trend');
    return response.data;
  },

  /**
   * 4. Get courses summary
   * @returns {Promise} Response with overall courses summary
   */
  getCoursesSummary: async () => {
    const response = await apiClient.get('/analytics/courses/summary');
    return response.data;
  },

  /**
   * 5. Get at-risk students for a specific course
   * @param {number} courseId - Course ID
   * @returns {Promise} Response with at-risk students
   */
  getAtRiskStudents: async (courseId) => {
    const response = await apiClient.get(`/analytics/courses/${courseId}/at-risk-students`);
    return response.data;
  },

  /**
   * 6. Get course attendance analysis
   * @param {number} courseId - Course ID
   * @returns {Promise} Response with course attendance analysis
   */
  getCourseAttendanceAnalysis: async (courseId) => {
    const response = await apiClient.get(`/analytics/courses/${courseId}/attendance-analysis`);
    return response.data;
  },

  /**
   * 7. Get attendance breakdown for a specific session
   * @param {number} attendanceId - Attendance session ID
   * @returns {Promise} Response with attendance breakdown
   */
  getAttendanceBreakdown: async (attendanceId) => {
    const response = await apiClient.get(`/analytics/attendance/${attendanceId}/breakdown`);
    return response.data;
  },

  /**
   * 8. Get student monthly attendance
   * @param {number} studentId - Student ID
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Promise} Response with student monthly attendance
   */
  getStudentMonthlyAttendance: async (studentId, year, month) => {
    const response = await apiClient.get(`/analytics/students/${studentId}/monthly`, {
      params: { year, month }
    });
    return response.data;
  },

  /**
   * 9. Get course monthly summary
   * @param {number} courseId - Course ID
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @returns {Promise} Response with course monthly summary
   */
  getCourseMonthlySummary: async (courseId, year, month) => {
    const response = await apiClient.get(`/analytics/courses/${courseId}/monthly-summary`, {
      params: { year, month }
    });
    return response.data;
  },

  /**
   * 10. Get course participation insights
   * @param {number} courseId - Course ID
   * @returns {Promise} Response with participation insights
   */
  getCourseParticipationInsights: async (courseId) => {
    const response = await apiClient.get(`/analytics/courses/${courseId}/participation-insights`);
    return response.data;
  },

  /**
   * 11. Get department analytics overview
   * @param {string} departmentName - Department name
   * @returns {Promise} Response with department analytics
   */
  getDepartmentAnalytics: async (departmentName) => {
    const response = await apiClient.get(`/analytics/departments/${encodeURIComponent(departmentName)}/overview`);
    return response.data;
  },

  /**
   * 12. Get course session effectiveness
   * @param {number} courseId - Course ID
   * @returns {Promise} Response with session effectiveness data
   */
  getCourseSessionEffectiveness: async (courseId) => {
    const response = await apiClient.get(`/analytics/courses/${courseId}/session-effectiveness`);
    return response.data;
  },

  /**
   * 13. Get top metrics (best vs worst courses)
   * @returns {Promise} Response with top performing and worst performing courses
   */
  getTopMetrics: async () => {
    const response = await apiClient.get('/analytics/top-metrics');
    return response.data;
  },
};

export default analyticsService;
