import { registerFormSchema } from "@/pages/register";
import { useMutation } from "react-query";
import { z } from "zod";
import { apiClient } from "../api-client";

export const useRegisterApplicant = () => {
    return useMutation({
        mutationFn: async (data: z.infer<typeof registerFormSchema>) => {
            await apiClient.post("/applicant/register", data)
        },
        onSuccess: () => {
            console.log("Assessment submitted successfully");
        },
        onError: (error) => {
            console.error("Error submitting assessment:", error);
        }
    })
}