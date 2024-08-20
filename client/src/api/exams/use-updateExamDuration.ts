import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"

export const useUpdateExamDuration = (examId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (duration: number) => {
            await apiClient.patch(`/exam/duration-update/${examId}`, { duration })
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')
        }
    })
}