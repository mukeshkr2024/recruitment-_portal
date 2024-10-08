import { apiClient } from "@/api/api-client";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "react-query";

export const useSaveCodingQuestion = (assessmentId: string, examId: string) => {
    const { toast } = useToast()
    return useMutation({
        mutationFn: async (data: any) => {
            await apiClient.post(`/applicant/coding-questions/${assessmentId}/exam/${examId}/save`, data)
        },
        onError: () => {
            toast({
                variant: "destructive",
                title: "Submission Failed,"
            })
        }
    })
}