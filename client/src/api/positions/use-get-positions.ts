import axios from "axios";
import { useQuery } from "react-query";

export const useGetPositions = () => {
    return useQuery({
        queryKey: ["positions"],
        queryFn: async () => {
            try {
                const { data } = await axios.get("http://localhost:8080/api/v1/positions");
                return data;
            } catch (error) {
                console.error("Error fetching positions:", error);
                throw new Error("Failed to fetch positions");
            }
        },
        // staleTime: 5 * 60 * 1000, // Cache the data for 5 minutes
        // retry: 2, // Retry failed requests up to 2 times
        // refetchOnWindowFocus: false, // Disable refetching on window focus
    });
};
