import { useMutation, useQueryClient } from "react-query"
import axios from "axios"

export const useDeletePosition = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (positionId: string) => {
            await axios.delete(`http://localhost:8080/api/v1/positions/${positionId}`,)
        },
        onSuccess: () => {
            queryClient.invalidateQueries('positions')

        },
        onError: (error) => {
            console.log(error);
        }
    })
}