import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"

export const useUpdateExamStatus = (resultId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (status: string) => {
            await apiClient.patch(`/exam/result/${resultId}`, { status })
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')
        }
    })
}