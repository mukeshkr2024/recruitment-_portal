import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetApplicants = (job?: string, status?: string) => {
    return useQuery({
        queryKey: ["applicants", job, status],
        queryFn: async () => {
            let url = '/applicants';
            const params = new URLSearchParams();
            if (job && job !== "all-positions") {
                params.set('job', job);
            }
            if (status && status !== "all-statuses") {
                params.set('status', status);
            }
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            const { data } = await apiClient.get(url);
            return data;
        },
        cacheTime: 0,
        staleTime: 0,
        refetchOnWindowFocus: true,
    });
};
