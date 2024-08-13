import { loginSchema } from "@/pages/login"
import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { apiClient } from "../api-client"

export const useApplicantLogin = () => {
    const navigate = useNavigate()
    return useMutation(
        {
            mutationFn: async (loginData: z.infer<typeof loginSchema>) => {
                try {
                    const { data } = await apiClient.post("auth/applicant-login", loginData)
                    localStorage.setItem('access_token', data.token);
                    navigate("/applicant-dashboard")
                } catch (error) {
                    console.log(error);
                }

            }
        }
    )
}