import { useQuery } from "react-query"
import { apiClient } from "../api-client"

export const useGetApplicants = () => {
    return useQuery({
        queryKey: ["applicants"],
        queryFn: async () => {
            const { data } = await apiClient.get('/applicants')
            return data
        }

    })
}