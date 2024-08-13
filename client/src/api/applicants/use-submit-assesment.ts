import { useMutation } from "react-query";
import { apiClient } from "../api-client";
import { useNavigate } from "react-router-dom";

export const useSubmitAssessment = (assementId: string) => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async (data: any) => {
            try {
                await apiClient.post(`/applicants/submit-assessment/${assementId}`, data)
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