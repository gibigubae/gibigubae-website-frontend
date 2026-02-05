import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import attendanceService from '../api/services/attendanceService';

// Query keys for attendance-related queries
export const attendanceKeys = {
  all: ['attendance'],
  byCourse: (courseId) => [...attendanceKeys.all, 'course', courseId],
  studentByCourse: (courseId) => [...attendanceKeys.all, 'student', 'course', courseId],
};

/**
 * Hook to get course attendance records (admin view)
 * @param {string|number} courseId - Course ID
 * @returns {Object} Query object with data, isLoading, error, etc.
 */
export const useCourseAttendance = (courseId) => {
  return useQuery({
    queryKey: attendanceKeys.byCourse(courseId),
    queryFn: () => attendanceService.getCourseAttendance(courseId),
    enabled: !!courseId,
  });
};

/**
 * Hook to get student's attendance records for a course
 * @param {string|number} courseId - Course ID
 * @returns {Object} Query object with data, isLoading, error, etc.
 */
export const useStudentAttendance = (courseId) => {
  return useQuery({
    queryKey: attendanceKeys.studentByCourse(courseId),
    queryFn: () => attendanceService.getStudentAttendance(courseId),
    enabled: !!courseId,
  });
};

/**
 * Hook to create a new attendance session
 * @returns {Object} Mutation object
 */
export const useCreateAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.createAttendance,
    onSuccess: (_, variables) => {
      // Invalidate attendance for the course
      queryClient.invalidateQueries({ 
        queryKey: attendanceKeys.byCourse(variables.courseId) 
      });
    },
  });
};

/**
 * Hook for admin to mark attendance
 * @returns {Object} Mutation object
 */
export const useMarkAttendanceAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.markAttendanceAdmin,
    onSuccess: () => {
      // Invalidate all attendance queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
};

/**
 * Hook for student to mark their own attendance
 * @returns {Object} Mutation object
 */
export const useMarkAttendanceStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceService.markAttendanceStudent,
    onSuccess: () => {
      // Invalidate student attendance queries
      queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
    },
  });
};
