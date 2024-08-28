import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"
import { useToast } from "@/components/ui/use-toast"

export const useDeleteApplicant = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: async (positionId: string) => {
            await apiClient.delete(`/applicant/${positionId}`,)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('applicants')
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Failed to deleted Applicant"
            })
        }
    })
}