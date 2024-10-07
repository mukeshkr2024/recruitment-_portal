import { useMutation } from "react-query";
import { apiClient } from "../api-client";

export const useCompileCode = () => {
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.post("/editor/compile", data);
            return response.data;
        },
    });
};
