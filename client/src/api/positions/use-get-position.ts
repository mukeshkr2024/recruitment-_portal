import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetPosition = (positionId: string) => {
    return useQuery({
        queryKey: ["position"],
        queryFn: async () => {
            try {
                const { data } = await apiClient.get(`/positions/${positionId}`);
                return data;
            } catch (error) {
                console.error("Error fetching positions:", error);
                throw new Error("Failed to fetch positions");
            }
        },

    });
};
