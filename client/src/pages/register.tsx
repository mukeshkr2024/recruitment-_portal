import { useRegisterApplicant } from "@/api/applicants/use-registerApplicant"
import { SuccessMessage } from "@/components/success-message"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "preact/hooks"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "zod"

export const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.(com|in)$/;


export const registerFormSchema = z.object({
    firstName: z.string().nonempty("First Name is required"),
    lastName: z.string().nonempty("Last Name is required"),
    email: z.string().email("Invalid email address").regex(emailPattern, "Invalid email address").nonempty("Email is required"),
    phone: z
        .string()
        .nonempty("Phone number is required")
        .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
})



export const RegisterPage = () => {
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const { positionId } = useParams();

    const { mutate, isLoading } = useRegisterApplicant(positionId!)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof registerFormSchema>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
        }
    })

    function onSubmit(values: z.infer<typeof registerFormSchema>) {
        mutate(values, {
            onSuccess: () => {
                setShowSuccessMessage(true);
                form.reset();
            },
            onError: (error: any) => {
                toast({
                    variant: "destructive",
                    title: error?.response?.data?.message || "Failed to register",
                })
            }
        })

    }

    const closeSuccessMessage = () => {
        setShowSuccessMessage(false);
    };

    return (
        <div className="flex items-center w-screen min-h-screen justify-center">
            <div className="max-w-md flex-1 bg-[#2310100a] p-8 rounded-md">
                <div className="mx-auto flex items-center justify-center h-full gap-x-3">
                    <div>
                        <img src="/logo_1.svg" alt="Logo" className="w-[80px]" />
                        <p className="text-[8px] text-slate-700 font-medium">CloudPrism Solutions</p>
                    </div>

                    <div className="h-12 w-[2px] rounded-xl bg-[#0D0925]"></div>

                    <div className="flex items-center gap-x-2">
                        <img src="/logo_2.svg" alt="Logo" className="w-[60px]" />
                        <p className="text-[8px] font-medium text-[#0D0925]">Ridge Consulting <br /> Partner</p>
                    </div>
                </div>
                <h2 className="font-semibold text-xl text-[#1A1A1A] mt-4 text-center">Registration Form</h2>
                <Form {...form}>
                    <form className="flex space-y-2 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter first name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter last name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter email id" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={isLoading}>Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
            {showSuccessMessage && <SuccessMessage onClose={closeSuccessMessage} />}

        </div>
    )
}
