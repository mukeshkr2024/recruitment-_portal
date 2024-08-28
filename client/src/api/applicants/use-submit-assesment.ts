import { useMutation } from "react-query";
import { apiClient } from "../api-client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const useSubmitAssessment = (assementId: string, examId: string) => {
    const { toast } = useToast()
    const navigate = useNavigate()
    return useMutation({
        mutationFn: async (data: any) => {
            await apiClient.post(`/applicants/submit-assessment/${assementId}/exam/${examId}`, data)
            navigate("/submitted")
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Submission Failed,"
            })
        }
    })
}