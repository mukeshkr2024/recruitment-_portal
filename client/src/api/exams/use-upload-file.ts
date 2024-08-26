import { useMutation, useQueryClient } from 'react-query';
import { apiClient } from '../api-client';

export const useUploadFile = (examId: string) => {

    const queryClient = useQueryClient();

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post(`/exam/upload/${examId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    };
    return useMutation({
        mutationFn: uploadFile,
        onSuccess: () => {
            queryClient.invalidateQueries('questions');
        }
    });
};
