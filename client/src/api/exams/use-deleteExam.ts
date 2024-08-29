import { useMutation, useQueryClient } from 'react-query';
import { apiClient } from '../api-client';

export const useDeleteExam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (examId: string) => {
            await apiClient.delete(`/exams/${examId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries('exams');
        },
    });
};
