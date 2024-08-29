import { useCreatePosition } from "@/api/positions/use-create-postion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const formSchema = z.object({
    positionName: z
        .string()
        .min(4, { message: "Job Title must be at least 4 characters long." })
        .max(255, { message: "Job Title must be at most 255 characters long." })
        .refine((value) => value.trim().length > 0, { message: "Job Title cannot contain only space characters." })
});

export const CreatePositions = () => {
    const [isOpen, setIsOpen] = useState(false);
    const mutation = useCreatePosition()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            positionName: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values, {
            onSuccess: () => {
                form.reset()
                setIsOpen(false)
            }
        })
    }

    const { isSubmitting, isValid } = form.formState;

    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => {
                setIsOpen((prevValue) => !prevValue)
                form.reset()
            }}
        >
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 p-2">
                    <Button className="flex gap-x-2">
                        <PlusCircle />
                        Add
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="my-2">Create New Position</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="positionName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="eg: UI/UX Designer"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="mb-4 mt-4 flex gap-x-4">
                                <Button
                                    variant="outline"
                                    className="w-28"
                                    onClick={() => {
                                        setIsOpen((prevValue) => !prevValue)
                                        form.reset()
                                    }}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="w-28"
                                    disabled={isSubmitting || !isValid}
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
