import { apiClient } from "@/api/api-client";
import { useQuery } from "react-query";


export const useGetCodingQuestions = (assessmentId: string, examId: string) => {
    return useQuery({
        queryKey: ["applicantQuestions"],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get(`/applicant/coding-questions/${assessmentId}/exam/${examId}`)
                return data;
            } catch (error) {
                console.error("Error fetching applicant questions:", error);
            }
        }
    })
}