import { questionFormSchema } from "@/components/job-position/assesment/create-question-dialog"
import { useMutation, useQueryClient } from "react-query"
import { z } from "zod"
import { apiClient } from "../api-client"

export const useCreateQuestion = (examId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (questionData: z.infer<typeof questionFormSchema>) => {
            await apiClient.post(`/questions/${examId}`, questionData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')
        },
        onError: (error) => {
            console.log(error);
        }
    })
}