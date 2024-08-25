import { useMutation, useQueryClient } from 'react-query';
import { apiClient } from '../api-client';
import { useToast } from '@/components/ui/use-toast';

interface UpdateStatusArgs {
    examId: string;
    isActive: boolean;
}

export const useUpdateActiveStatus = (positionId: string) => {
    const queryClient = useQueryClient();
    const { toast } = useToast()

    return useMutation({
        mutationFn: async ({ examId, isActive }: UpdateStatusArgs) => {
            await apiClient.patch(`/position-exams/${examId}/${positionId}`, { isActive });
        },
        onSuccess: () => {
            queryClient.invalidateQueries('position-exams');
            toast({
                title: "Exam status updated sucessfully"
            })
        },
    });
};
