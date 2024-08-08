import { useMutation, useQueryClient } from "react-query"
import axios from "axios"

export const useCreateQuestion = (positionId: string) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (questionData) => {
            await axios.post(`http://localhost:8080/api/v1/questions/${positionId}`, questionData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('questions')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}