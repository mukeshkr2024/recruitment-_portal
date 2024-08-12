import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetJobPositions = () => {
    return useQuery({
        queryKey: ["job-positions"],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get("/applicant/job-positions");
                return data;
            } catch (error) {
                console.error("Error fetching positions:", error);
                throw new Error("Failed to fetch positions");
            }
        },

    });
};
