import { useQuery } from "react-query";
import { apiClient } from "../api-client";

export const useGetApplicantsByPosition = (positionId: string | null) => {
    return useQuery({
        queryKey: ['applicants', positionId],
        queryFn: async () => {
            if (!positionId) {
                throw new Error("Position ID is required");
            }
            const { data } = await apiClient.get(`/applicants/position/${positionId}`);
            return data;
        },
        enabled: !!positionId
    });
};
