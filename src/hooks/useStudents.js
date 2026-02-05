import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import studentService from '../api/services/studentService';

// Query keys for student-related queries
export const studentKeys = {
  all: ['students'],
  lists: () => [...studentKeys.all, 'list'],
  search: (term) => [...studentKeys.all, 'search', term],
};

/**
 * Hook to get all students
 * @returns {Object} Query object with data, isLoading, error, etc.
 */
export const useStudents = () => {
  return useQuery({
    queryKey: studentKeys.lists(),
    queryFn: studentService.getAllStudents,
  });
};

/**
 * Hook to search students by term
 * @param {string} searchTerm - Search term
 * @returns {Object} Query object with data, isLoading, error, etc.
 */
export const useSearchStudents = (searchTerm) => {
  return useQuery({
    queryKey: studentKeys.search(searchTerm),
    queryFn: () => studentService.searchStudents(searchTerm),
    enabled: !!searchTerm && searchTerm.trim().length > 0, // Only search if term is provided
  });
};

/**
 * Hook to update a student
 * @returns {Object} Mutation object
 */
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => studentService.updateStudent(id, data),
    onSuccess: () => {
      // Invalidate students list and any search results
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
};

/**
 * Hook to delete a student
 * @returns {Object} Mutation object
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: studentService.deleteStudent,
    onSuccess: () => {
      // Invalidate students list and any search results
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
};
