import { useSendMail } from "@/api/mail/use-send-mai";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const formSchema = z.object({
    type: z.enum(["individual", "bulk"]),
    subject: z.string().min(1, "Subject is required"),
    body: z.string().min(1, "Body is required"),
    recipient: z.string().email("Invalid email").optional(),
    jobPosition: z.string().min(1, "Job position is required"),
    status: z.string().min(1, "Status is required"),
});

type Position = {
    id: string;
    positionName: string;
};

type StatusOption = {
    id: string;
    name: string;
};

interface SendMailProps {
    positions: Position[];
    statusOptions: StatusOption[];
}

export type SendMailFormSchemaType = z.infer<typeof formSchema>;

export const SendMail = ({ positions, statusOptions }: SendMailProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const mutation = useSendMail();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "individual",
            subject: "",
            body: "",
            recipient: "",
            jobPosition: "",
            status: "",
        },
    });

    const { handleSubmit, control, watch, setValue, formState: { isSubmitting, isValid, errors } } = form;

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutation.mutate(values, {
            onSuccess: () => {
                form.reset()
                setIsOpen(false)
            }
        });
    };

    const selectedType = watch("type");

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="mt-5">SendMail</Button>
            </DialogTrigger>
            <DialogContent className="w-[70%] max-w-4xl h-[80%]" style={{ overflowY: "auto" }}>
                <DialogHeader>
                    <DialogTitle className="my-2">Send New Email</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-y-4">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                            <div className="flex w-full gap-4">
                                <FormField
                                    control={control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="w-32">
                                            <FormLabel>Email Type</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value as "individual" | "bulk"}
                                                    onValueChange={(value) => setValue("type", value as "individual" | "bulk")}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="individual">Individual</SelectItem>
                                                        <SelectItem value="bulk">Bulk</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {selectedType === "individual" && (
                                    <FormField
                                        control={control}
                                        name="recipient"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormLabel>Recipient</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter recipient's email"
                                                        value={field.value ?? ""}
                                                        onChange={field.onChange}
                                                        onBlur={field.onBlur}
                                                        name={field.name}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <FormField
                                control={control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Subject</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter email subject" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex w-full gap-4">
                                <FormField
                                    control={control}
                                    name="jobPosition"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Job Position</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => setValue("jobPosition", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select job" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all-positions">All Positions</SelectItem>
                                                        {positions.map((pos) => (
                                                            <SelectItem key={pos.id} value={pos.id}>
                                                                {pos.positionName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={(value) => setValue("status", value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statusOptions.map(status => (
                                                            <SelectItem key={status.id} value={status.id}>
                                                                {status.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Body</FormLabel>
                                        <FormControl>
                                            <ReactQuill
                                                value={field.value}
                                                onChange={(value) => setValue("body", value)}
                                                className="h-[150px]"
                                                placeholder="Enter email body"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2 mt-12">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="w-full">
                                    Send
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
