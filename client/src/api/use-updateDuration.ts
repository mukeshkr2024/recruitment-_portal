import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "./api-client"

export const useUpdateDuration = (postionId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (duration: number) => {
            await apiClient.patch(`/position/duration-update/${postionId}`, { duration })
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')
        }
    })
}