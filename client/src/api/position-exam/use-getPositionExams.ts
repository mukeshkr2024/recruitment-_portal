import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetPositionExams = (positionId: string) => {
    return useQuery({
        queryKey: ["position-exams", positionId],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get(`/position-exams/${positionId}`);
                return data;
            } catch (error) {
                console.error("Error fetching questions:", error);
                throw new Error("Failed to fetch questions");
            }
        },
    });
}; 
