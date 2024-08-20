import { useMutation, useQueryClient } from 'react-query';
import { apiClient } from '../api-client';

interface UpdateStatusArgs {
    examId: string;
    isActive: boolean;
}

export const useUpdateActiveStatus = (positionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ examId, isActive }: UpdateStatusArgs) => {
            await apiClient.patch(`/position-exams/${examId}/${positionId}`, { isActive });
        },
        onSuccess: () => {
            queryClient.invalidateQueries('position-exams');
        },
    });
};
