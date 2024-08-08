import axios from "axios";
import { useMutation } from "react-query";

export const useSubmitAssessment = () => {
    return useMutation({
        mutationFn: async (data) => {
            try {
                await axios.post("http://localhost:8080/api/v1/applicants/submit-assessment", data)
                console.log("Assessment submitted successfully");
            } catch (error) {
                console.error("Error submitting assessment:", error);
            }
        },
        onSuccess: () => {
            console.log("Assessment submitted successfully");
        },
        onError: (error) => {
            console.error("Error submitting assessment:", error);
        }
    })
}