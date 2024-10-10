import { apiClient } from "@/api/api-client";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "react-query";

export const useSubmitCodingAssessment = (assessmentId: string) => {
    const { toast } = useToast()
    return useMutation({
        mutationFn: async (examId: string) => {
            await apiClient.post(`/applicant/coding-questions/${assessmentId}/exam/${examId}/submit`)
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Submission Failed,"
            })
        }
    })
}