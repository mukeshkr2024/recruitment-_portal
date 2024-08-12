
import { useAdminLogin } from "@/api/admin/use-admin-login";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "preact/hooks";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";
import { z } from "zod";

export const adminloginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4, {
        message: "Invalid password"
    }).max(12, {
        message: 'Invalid password'
    })
})

export const AdminLoginPage = () => {
    const { admin, loading, checkAuth } = useAdminAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (loading) return <div>Loading...</div>;

    if (admin) return <Navigate to="/dashboard" />

    const loginMutation = useAdminLogin();

    const form = useForm<z.infer<typeof adminloginSchema>>({
        resolver: zodResolver(adminloginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    function onSubmit(values: z.infer<typeof adminloginSchema>) {
        loginMutation.mutate(values)
        if (loginMutation.isSuccess) {
            console.log("new login");
        }
    }

    return (
        <div class="min-h-screen w-full flex items-center justify-center
bg-[url('/bg_1.png')] bg-cover">
            <div class="bg-[#FFFFFF0A] border-1 backdrop-blur-3xl px-8 py-6 border-[#FFFFFF2B] w-[458px] rounded-2xl">
                <div class="flex flex-col gap-y-4">
                    <div className="mx-auto flex items-center justify-center h-full gap-x-3">
                        <div>
                            <img src="/logo_1.svg" alt="Logo" className="w-[80px]" />
                            <p className="text-[8px] text-[#0D0925] font-medium">CloudPrism Solutions</p>
                        </div>

                        <div className="h-12 w-[2px] rounded-xl bg-[#0D0925]">

                        </div>
                        <div className="flex items-center gap-x-2">
                            <img src="/logo_2.svg" alt="Logo" className="w-[60px]" />
                            <p className="text-[8px] font-medium text-[#0D0925]">Ridge Consulting <br /> Partner</p>
                        </div>
                    </div>
                    <h2 className="font-semibold text-xl text-[#1A1A1A] mt-4">Welcome</h2>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <div className="space-y-4">

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-normal">Login</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs font-normal" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="font-normal">Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Password" type="password" {...field} />
                                                </FormControl>
                                                <FormMessage className="text-xs font-normal" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="">
                                    <Button type="submit" className="w-full bg-[#5138ED]  hover:bg-[#5138ED]">Get Started</Button>
                                </div>
                            </form>
                        </Form>
                    </div>

                    <div className="w-full bg-[#E5E5E5] h-[1px]"></div>

                    <div className="flex text-center items-center justify-center gap-x-3 text-sm font-normal">
                        <Link to="/applicant-login" className="text-[#007AFF] font-medium">Applicant Login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
