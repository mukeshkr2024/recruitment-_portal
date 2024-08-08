import { useMutation, useQueryClient } from "react-query"
import axios from "axios"

export const useDeleteQuestion = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (questionId: string) => {
            await axios.delete(`http://localhost:8080/api/v1/questions/${questionId}`,)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}