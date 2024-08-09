import { useMutation } from "react-query";
import { apiClient } from "../api-client";

export const useSubmitAssessment = () => {
    return useMutation({
        mutationFn: async (data) => {
            try {
                await apiClient.post("/applicants/submit-assessment", data)
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