import { useQuery } from '@tanstack/react-query';
import analyticsService from '../api/services/analyticsService';

/**
 * Analytics Query Keys
 */
export const analyticsKeys = {
  all: ['analytics'],
  dailyOverview: () => [...analyticsKeys.all, 'daily-overview'],
  courseList: () => [...analyticsKeys.all, 'course-list'],
  attendanceTrend: () => [...analyticsKeys.all, 'attendance-trend'],
  coursesSummary: () => [...analyticsKeys.all, 'courses-summary'],
  atRiskStudents: (courseId) => [...analyticsKeys.all, 'at-risk-students', courseId],
  courseAttendanceAnalysis: (courseId) => [...analyticsKeys.all, 'course-attendance-analysis', courseId],
  attendanceBreakdown: (attendanceId) => [...analyticsKeys.all, 'attendance-breakdown', attendanceId],
  studentMonthly: (studentId, year, month) => [...analyticsKeys.all, 'student-monthly', studentId, year, month],
  courseMonthly: (courseId, year, month) => [...analyticsKeys.all, 'course-monthly', courseId, year, month],
  courseParticipation: (courseId) => [...analyticsKeys.all, 'course-participation', courseId],
  departmentAnalytics: (departmentName) => [...analyticsKeys.all, 'department', departmentName],
  courseSessionEffectiveness: (courseId) => [...analyticsKeys.all, 'session-effectiveness', courseId],
  topMetrics: () => [...analyticsKeys.all, 'top-metrics'],
};

/**
 * Hook to fetch daily analytics overview
 */
export const useDailyOverview = () => {
  return useQuery({
    queryKey: analyticsKeys.dailyOverview(),
    queryFn: analyticsService.getDailyOverview,
  });
};

/**
 * Hook to fetch course list analytics
 */
export const useCourseListAnalytics = () => {
  return useQuery({
    queryKey: analyticsKeys.courseList(),
    queryFn: analyticsService.getCourseListAnalytics,
  });
};

/**
 * Hook to fetch attendance trend (last 7 days)
 */
export const useAttendanceTrend = () => {
  return useQuery({
    queryKey: analyticsKeys.attendanceTrend(),
    queryFn: analyticsService.getAttendanceTrend,
  });
};

/**
 * Hook to fetch courses summary
 */
export const useCoursesSummary = () => {
  return useQuery({
    queryKey: analyticsKeys.coursesSummary(),
    queryFn: analyticsService.getCoursesSummary,
  });
};

/**
 * Hook to fetch at-risk students for a course
 */
export const useAtRiskStudents = (courseId, options = {}) => {
  return useQuery({
    queryKey: analyticsKeys.atRiskStudents(courseId),
    queryFn: () => analyticsService.getAtRiskStudents(courseId),
    enabled: !!courseId,
    ...options,
  });
};

/**
 * Hook to fetch course attendance analysis
 */
export const useCourseAttendanceAnalysis = (courseId, options = {}) => {
  return useQuery({
    queryKey: analyticsKeys.courseAttendanceAnalysis(courseId),
    queryFn: () => analyticsService.getCourseAttendanceAnalysis(courseId),
    enabled: !!courseId,
    ...options,
  });
};

/**
 * Hook to fetch attendance breakdown for a session
 */
export const useAttendanceBreakdown = (attendanceId, options = {}) => {
  return useQuery({
    queryKey: analyticsKeys.attendanceBreakdown(attendanceId),
    queryFn: () => analyticsService.getAttendanceBreakdown(attendanceId),
    enabled: !!attendanceId,
    ...options,
  });
};

/**
 * Hook to fetch student monthly attendance
 */
export const useStudentMonthlyAttendance = (studentId, year, month, options = {}) => {
  return useQuery({
    queryKey: analyticsKeys.studentMonthly(studentId, year, month),
    queryFn: () => analyticsService.getStudentMonthlyAttendance(studentId, year, month),
    enabled: !!studentId && !!year && !!month,
    ...options,
  });
};

/**
 * Hook to fetch course monthly summary
 */
export const useCourseMonthlySummary = (courseId, year, month, options = {}) => {
  return useQuery({
    queryKey: analyticsKeys.courseMonthly(courseId, year, month),
    queryFn: () => analyticsService.getCourseMonthlySummary(courseId, year, month),
    enabled: !!courseId && !!year && !!month,
    ...options,
  });
};

/**
 * Hook to fetch course participation insights
 */
export const useCourseParticipationInsights = (courseId, options = {}) => {
  return useQuery({
    queryKey: analyticsKeys.courseParticipation(courseId),
    queryFn: () => analyticsService.getCourseParticipationInsights(courseId),
    enabled: !!courseId,
    ...options,
  });
};

/**
 * Hook to fetch department analytics
 */
export const useDepartmentAnalytics = (departmentName, options = {}) => {
  return useQuery({
    queryKey: analyticsKeys.departmentAnalytics(departmentName),
    queryFn: () => analyticsService.getDepartmentAnalytics(departmentName),
    enabled: !!departmentName,
    ...options,
  });
};

/**
 * Hook to fetch course session effectiveness
 */
export const useCourseSessionEffectiveness = (courseId, options = {}) => {
  return useQuery({
    queryKey: analyticsKeys.courseSessionEffectiveness(courseId),
    queryFn: () => analyticsService.getCourseSessionEffectiveness(courseId),
    enabled: !!courseId,
    ...options,
  });
};

/**
 * Hook to fetch top metrics (best vs worst)
 */
export const useTopMetrics = () => {
  return useQuery({
    queryKey: analyticsKeys.topMetrics(),
    queryFn: analyticsService.getTopMetrics,
  });
};
