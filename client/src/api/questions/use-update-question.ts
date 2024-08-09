
import { editQuestionSchema } from "@/components/job-position/assesment/edit-questions"
import { useMutation, useQueryClient } from "react-query"
import { z } from "zod"
import { apiClient } from "../api-client"

export const useUpdateQuestion = (questionId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: z.infer<typeof editQuestionSchema>) => {
            await apiClient.put(`/question/${questionId}`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}