import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetQuestions = (positionId: string) => {
    return useQuery({
        queryKey: ["questions", positionId],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get(`/questions/${positionId}`);
                return data;
            } catch (error) {
                console.error("Error fetching questions:", error);
                throw new Error("Failed to fetch questions");
            }
        },
    });
};
