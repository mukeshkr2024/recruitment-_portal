import { apiClient } from "@/api/api-client"
import { useQuery } from "react-query"

export const useGetApplicantCodingResult = (submissionId: string) => {
    return useQuery({
        queryKey: ["applicant"],
        queryFn: async () => {
            const { data } = await apiClient.get(`/applicant/coding-result/${submissionId}`)
            return data
        },
        staleTime: 0,
        cacheTime: 0,
        refetchOnWindowFocus: false
    })
}