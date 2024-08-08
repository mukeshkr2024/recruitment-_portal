import { useMutation, useQueryClient } from "react-query"
import axios from "axios"

export const useCreatePosition = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (positionData) => {
            await axios.post("http://localhost:8080/api/v1/positions", positionData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('todos')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}