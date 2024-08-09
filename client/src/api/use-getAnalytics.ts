import { useQuery } from "react-query"
import { apiClient } from "./api-client";

export const useGetAnalytics = () => {
    return useQuery(
        {
            queryKey: ["analytics"],
            queryFn: async () => {
                try {
                    const { data } = await apiClient.get("/analytics")
                    return data;
                } catch (error) {
                    console.log(error);

                }
            }
        }
    )
}