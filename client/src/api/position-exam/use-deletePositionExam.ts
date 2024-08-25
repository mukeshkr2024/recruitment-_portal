import { useMutation, useQueryClient } from 'react-query';
import { apiClient } from '../api-client';

interface UpdateStatusArgs {
    examId: string;
}

export const useDeletePositionExam = (positionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ examId }: UpdateStatusArgs) => {
            await apiClient.delete(`/position-exams/${examId}/${positionId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries('position-exams');

        },
    });
};
