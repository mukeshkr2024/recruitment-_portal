import { loginSchema } from "@/pages/login"
import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { apiClient } from "../api-client"
import { useToast } from "@/components/ui/use-toast"

export const useApplicantLogin = () => {

    const navigate = useNavigate()
    const { toast } = useToast()
    return useMutation(
        {
            mutationFn: async (loginData: z.infer<typeof loginSchema>) => {
                const { data } = await apiClient.post("auth/applicant-login", loginData)
                localStorage.setItem('access_token', data.token);
                navigate("/applicant-dashboard")
            },
            onError: (error: any) => {
                toast({
                    variant: "destructive",
                    title: error?.response?.data?.message || "Invalid credentials"
                })
            }
        }
    )
}