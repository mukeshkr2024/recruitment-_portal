import { useMutation, useQueryClient } from "react-query"
import { apiClient } from "../api-client"

export const useCreateExam = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (positionData: any) => {
            await apiClient.post("/exams", positionData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('todos')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}