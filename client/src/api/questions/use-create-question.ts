import { useMutation, useQueryClient } from "react-query";
import { apiClient } from "../api-client";

export const useCreateQuestion = (examId: string, type?: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (questionData: any) => {
            const url = type
                ? `/questions/${examId}?type=${type}`
                : `/questions/${examId}`;
            await apiClient.post(url, questionData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions');
        },
        onError: (error) => {
            console.log(error);
        }
    });
}
