import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"

export const useCreatePosition = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (positionData: any) => {
            await apiClient.post("/positions", positionData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('todos')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}