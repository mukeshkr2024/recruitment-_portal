import { useMutation } from "react-query";
import { apiClient } from "../api-client";
import { useNavigate } from "react-router-dom";

export const useSubmitAssessment = () => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async (data) => {
            try {
                await apiClient.post("/applicants/submit-assessment", data)
                console.log("Assessment submitted successfully");
                navigate("/submitted")
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