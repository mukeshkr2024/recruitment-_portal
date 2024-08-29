import { useQuery } from "react-query";
import { apiClient } from "./api-client";
import { DateRange } from "react-day-picker";

export const useGetAnalytics = (date: DateRange | undefined) => {
    return useQuery(
        {
            queryKey: ["analytics", date],
            queryFn: async () => {
                try {
                    // Construct query parameters if date is defined
                    const queryParams = date && date.from && date.to
                        ? `start=${date.from.toISOString()}&end=${date.to.toISOString()}`
                        : '';

                    // Fetch data from API
                    const { data } = await apiClient.get(`/analytics/?${queryParams}`);
                    return data;
                } catch (error) {
                    // Handle error (you might want to log it or show a message)
                    console.error("Error fetching analytics data:", error);
                    throw error; // Re-throw error to trigger query failure state
                }
            },
            // Optional: you might want to include `date` in the dependency array
            // to refetch the query when the date changes
            enabled: date?.from !== undefined && date?.to !== undefined
        }
    );
};
