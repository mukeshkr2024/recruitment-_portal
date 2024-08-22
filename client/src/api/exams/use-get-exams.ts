import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetExams = () => {
    return useQuery({
        queryKey: ["exams"],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get("/exams");
                return data;
            } catch (error) {
                console.error("Error fetching positions:", error);
                throw new Error("Failed to fetch positions");
            }
        },
    });
};
