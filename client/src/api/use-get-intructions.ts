import { useQuery } from "react-query"
import { apiClient } from "./api-client"

export const getInstructions = (assesmentId: string, examId: string, type?: string) => {
    return useQuery({
        queryFn: async () => {
            const { data } = await apiClient.get(`/instructions/${assesmentId}/exam/${examId}`, {
                params: {
                    type: type || ""
                }
            })
            return data;
        },
        onError: () => {

        }
    })
}