import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"

export const useDeletePosition = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (positionId: string) => {
            await apiClient.delete(`/positions/${positionId}`,)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('positions')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}