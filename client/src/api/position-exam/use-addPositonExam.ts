import { useMutation, useQueryClient } from 'react-query';
import { apiClient } from '../api-client';
import { toast } from '@/components/ui/use-toast';

interface UpdateStatusArgs {
    examId: string;
}

export const useAddPositonExam = (positionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ examId, }: UpdateStatusArgs) => {
            await apiClient.post(`/position-exams/${examId}/${positionId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries('position-exams');
            toast({
                title: 'Exam assigned successfully',
            })
        },
        onError: (error: any) => {
            toast({
                title: error?.response?.data?.message || 'Failed to add position exam',
                variant: 'destructive',
            })
        },
    });
};
