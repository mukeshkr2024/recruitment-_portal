import { useMutation } from "react-query"
import { apiClient } from "../api-client"
import { useToast } from "@/components/ui/use-toast"
import { SendMailFormSchemaType } from "@/components/mails/send-mail"

export const useSendMail = () => {
    const { toast } = useToast()

    return useMutation({
        mutationFn: async (data: SendMailFormSchemaType) => {
            await apiClient.post(`/mails/send-mail`, data)
        },
        onSuccess: () => {
            toast({
                title: "Mail sent successfully"
            })
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: error?.response?.data?.message || "Failed to send mail"
            })
        }
    })
}