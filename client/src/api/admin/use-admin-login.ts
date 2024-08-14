import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
import { z } from "zod"
import { apiClient } from "../api-client"
import { adminloginSchema } from "@/pages/admin-login"
import { useToast } from "@/components/ui/use-toast"


export const useAdminLogin = () => {
    const { toast } = useToast()
    const navigate = useNavigate()




    return useMutation(
        {
            mutationFn: async (loginData: z.infer<typeof adminloginSchema>) => {
                const { data } = await apiClient.post("auth/admin-login", loginData)
                localStorage.setItem('access_token', data.token);
                navigate("/dashboard")
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