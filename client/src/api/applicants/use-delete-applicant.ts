import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"

export const useDeleteApplicant = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (positionId: string) => {
            await apiClient.delete(`/applicant/${positionId}`,)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('applicants')
        },
        onError: (error) => {
            console.log(error);
        }
    })
}