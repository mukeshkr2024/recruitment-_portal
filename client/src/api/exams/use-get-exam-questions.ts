import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetExamQuestions = (examId: string) => {
    return useQuery({
        queryKey: ["questions", examId],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get(`/exams/${examId}`);
                return data;
            } catch (error) {
                console.error("Error fetching questions:", error);
                throw new Error("Failed to fetch questions");
            }
        },
    });
};
