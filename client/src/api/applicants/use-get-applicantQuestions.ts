import { useQuery } from "react-query";
import { apiClient } from "../api-client";


export const useGetApplicantQuestions = (assessmentId: string, examId: string) => {
    return useQuery({
        queryKey: ["applicantQuestions"],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get(`/applicants/assesment-questions/${assessmentId}/exam/${examId}`)
                return data;
            } catch (error) {
                console.error("Error fetching applicant questions:", error);
            }
        }
    })
}