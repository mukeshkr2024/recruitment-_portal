import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetApplicantsDownloadData = (job?: string, status?: string) => {
    return useQuery({
        queryKey: ["applicants-data", job, status],
        queryFn: async () => {
            let url = '/applicants/download-data';
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
        enabled: false,
        retry: false, // Disable retries
        retryOnMount: false, // Disable retry on mount
    });
};