import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetPositions = () => {
    return useQuery({
        queryKey: ["positions"],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get("/positions");
                return data;
            } catch (error) {
                console.error("Error fetching positions:", error);
                throw new Error("Failed to fetch positions");
            }
        },
    });
};
