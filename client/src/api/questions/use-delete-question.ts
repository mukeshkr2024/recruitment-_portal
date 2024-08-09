import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (questionId: string) => {
            await apiClient.delete(`/questions/${questionId}`,)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}