import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { apiClient } from "../api-client"
import { adminloginSchema } from "@/pages/admin-login"


export const useAdminLogin = () => {
    const navigate = useNavigate()
    return useMutation(
        {
            mutationFn: async (loginData: z.infer<typeof adminloginSchema>) => {
                try {
                    const { data } = await apiClient.post("auth/admin-login", loginData)
                    localStorage.setItem('access_token', data.token);
                    navigate("/dashboard")
                } catch (error) {
                    console.log(error);
                }

            }
        }
    )
}