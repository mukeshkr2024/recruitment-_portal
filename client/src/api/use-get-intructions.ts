import { useQuery } from "react-query"
import { apiClient } from "./api-client"

export const getInstructions = (assesmentId: string) => {
    return useQuery({
        queryFn: async () => {
            const { data } = await apiClient.get(`/instructions/${assesmentId}`)
            return data;
        },
        onError: () => {

        }
    })
}