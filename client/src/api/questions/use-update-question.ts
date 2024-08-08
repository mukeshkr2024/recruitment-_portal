
import { useMutation, useQueryClient } from "react-query"
import axios from "axios"
import { z } from "zod"
import { editQuestionSchema } from "@/components/job-position/assesment/edit-questions"

export const useUpdateQuestion = (questionId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: z.infer<typeof editQuestionSchema>) => {
            await axios.put(`http://localhost:8080/api/v1/question/${questionId}`, data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}