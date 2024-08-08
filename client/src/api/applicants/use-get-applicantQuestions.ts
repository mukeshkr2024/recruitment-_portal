import axios from "axios";
import { useQuery } from "react-query"


export const useGetApplicantQuestions = () => {
    return useQuery({
        queryKey: ["applicantQuestions"],
        queryFn: async () => {
            try {
                const { data } = await axios.get("http://localhost:8080/api/v1/applicants/assesment-questions")
                console.log(data);
                return data;
            } catch (error) {
                console.error("Error fetching applicant questions:", error);
            }
        }
    })
}