import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetQuestion = (questionId: string) => {
    return useQuery({
        queryKey: ["question", questionId],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get(`/question/${questionId}`);
                return data;
            } catch (error) {
                console.error("Error fetching question:", error);
                throw new Error("Failed to fetch question");
            }
        },
    });
};
