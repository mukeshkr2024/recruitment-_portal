import { useToast } from "@/components/ui/use-toast"
import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"

export const useCreatePosition = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: async (positionData: any) => {
            await apiClient.post("/positions", positionData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('positions')
            toast({
                title: "Position created successfully"
            })
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: error?.response?.data?.message || "Something went wrong "
            })
        }
    })
}