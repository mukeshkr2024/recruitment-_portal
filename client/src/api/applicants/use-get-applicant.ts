import { useQuery } from "react-query"
import { apiClient } from "../api-client"

export const useGetApplicant = (applicantId: string) => {
    return useQuery({
        queryKey: ["applicant"],
        queryFn: async () => {
            const { data } = await apiClient.get(`/applicant/details/${applicantId}`)
            return data
        }

    })
}