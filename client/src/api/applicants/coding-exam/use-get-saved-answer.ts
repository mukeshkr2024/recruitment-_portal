import { apiClient } from "@/api/api-client";
import { useQuery } from "react-query";

export const useGetSavedAnswer = (assessmentId: string, examId: string, questionId: string) => {
    return useQuery({
        queryKey: ["saved-code", { assessmentId, examId, questionId }],
        queryFn: async () => {
            if (!questionId) {
                throw new Error("No questionId provided");
            }
            const { data } = await apiClient.get(`/applicant/coding-questions/${assessmentId}/exam/${examId}/save/${questionId}`);
            return data;
        },
        enabled: !!questionId && !!assessmentId && !!examId,
        refetchOnWindowFocus: false,
    });
};
