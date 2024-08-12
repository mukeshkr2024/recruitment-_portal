import { useQuery } from "react-query"
import { apiClient } from "../api-client"

export const useGetApplicantAssessments = () => {
    return useQuery({
        queryKey: ["assesments"],
        queryFn: async () => {
            const { data } = await apiClient.get('/applicant/assessments')
            return data
        }

    })
}