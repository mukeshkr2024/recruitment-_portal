import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"
import { useToast } from "@/components/ui/use-toast"

export const useCreateExam = () => {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    return useMutation({
        mutationFn: async (positionData: any) => {
            await apiClient.post("/exams", positionData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('exams')
            toast({
                title: "Exam created successfully"
            })
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Failed to create exam",
            })
        }
    })
}