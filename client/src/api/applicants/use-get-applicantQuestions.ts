import { useQuery } from "react-query";
import { apiClient } from "../api-client";


export const useGetApplicantQuestions = () => {
    return useQuery({
        queryKey: ["applicantQuestions"],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get("/applicants/assesment-questions")
                return data;
            } catch (error) {
                console.error("Error fetching applicant questions:", error);
            }
        }
    })
}