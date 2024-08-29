import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"

export const useUpdateApplicantStatus = (applicantId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (status: string) => {
            await apiClient.patch(`/applicant/${applicantId}`, { status })
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')
        }
    })
}