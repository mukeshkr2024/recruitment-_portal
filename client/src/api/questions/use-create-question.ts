import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"

export const useCreateQuestion = (positionId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (questionData) => {
            await apiClient.post(`/questions/${positionId}`, questionData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}