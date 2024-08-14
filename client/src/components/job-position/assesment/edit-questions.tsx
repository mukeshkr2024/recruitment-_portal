import { useGetQuestion } from "@/api/questions/use-get-question";
import { useUpdateQuestion } from "@/api/questions/use-update-question";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useEffect } from "preact/hooks";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
    onClose: () => void
    questionId: string;
}

export const editQuestionSchema = z.object({
    questionText: z.string().min(10, "Question Title is required"),
    answer1: z.object({
        text: z.string().min(4, "Option 1 is required"),
        isCorrect: z.boolean(),
    }),
    answer2: z.object({
        text: z.string().min(4, "Option 2 is required"),
        isCorrect: z.boolean(),
    }),
    answer3: z.object({
        text: z.string().min(4, "Option 3 is required"),
        isCorrect: z.boolean(),
    }),
    answer4: z.object({
        text: z.string().min(4, "Option 4 is required"),
        isCorrect: z.boolean(),
    }),
}).refine(
    (data) =>
        data.answer1.isCorrect ||
        data.answer2.isCorrect ||
        data.answer3.isCorrect ||
        data.answer4.isCorrect,
    {
        message: "At least one option must be marked as correct",
        path: ["answer1", "answer2", "answer3", "answer4"],
    }
);

export const EditQuestion = ({ onClose, questionId }: Props) => {

    const { data: question } = useGetQuestion(questionId);

    const mutation = useUpdateQuestion(questionId)

    const form = useForm<z.infer<typeof editQuestionSchema>>({
        resolver: zodResolver(editQuestionSchema),
        defaultValues: {
            questionText: "",
        },
    });

    useEffect(() => {
        if (question) {
            form.reset({
                questionText: question?.questionText,
                answer1: {
                    text: question?.options[0].optionText,
                    isCorrect: question?.options[0].isCorrect
                },
                answer2: {
                    text: question?.options[1].optionText,
                    isCorrect: question?.options[1].isCorrect
                },
                answer3: {
                    text: question?.options[2].optionText,
                    isCorrect: question?.options[2].isCorrect
                },
                answer4: {
                    text: question?.options[3].optionText,
                    isCorrect: question?.options[3].isCorrect
                }
            })
        }
    }, [question])

    function onSubmit(values: z.infer<typeof editQuestionSchema>) {
        console.log(values);
        mutation.mutate(values)
        onClose()
    }

    const { isSubmitting, isValid } = form.formState;

    return (
        <Dialog
            open={true}
            onOpenChange={onClose}
        >
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 p-2">
                    <Button className="flex gap-x-2">
                        <PlusCircle />
                        Add New Question
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-6xl" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <DialogHeader>
                    <DialogTitle>Edit Question</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="questionText"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question Title</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="e.g., What is UI/UX Design?"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="mt-4 flex flex-col gap-y-4">
                                <div>
                                    <h3 className="font-medium">Options</h3>
                                    <p className="text-sm text-gray-700">one option must be marked as correct</p>
                                </div>
                                <div className="flex gap-x-4 items-center">
                                    <FormField
                                        control={form.control}
                                        name="answer1.isCorrect"
                                        render={({ field }) => (
                                            <FormItem >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={(checked) =>
                                                            field.onChange(checked)
                                                        }
                                                        className="size-5"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="answer1.text"

                                        render={({ field }) => (
                                            <FormItem className="flex-1">
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
                                </div>

                                <div className="flex gap-x-4 items-center">
                                    <FormField
                                        control={form.control}
                                        name="answer2.isCorrect"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={(checked) =>
                                                            field.onChange(checked)
                                                        }
                                                        className="size-5"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="answer2.text"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
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
                                </div>

                                <div className="flex gap-x-4 items-center">
                                    <FormField
                                        control={form.control}
                                        name="answer3.isCorrect"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={(checked) =>
                                                            field.onChange(checked)
                                                        }
                                                        className="size-5"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="answer3.text"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
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
                                </div>

                                <div className="flex gap-x-4 items-center">
                                    <FormField
                                        control={form.control}
                                        name="answer4.isCorrect"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={(checked) =>
                                                            field.onChange(checked)
                                                        }
                                                        className="size-5"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="answer4.text"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
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
                                </div>

                            </div>


                            <div className="mb-4 mt-4 flex gap-x-4">
                                <Button
                                    variant="outline"
                                    className="w-28"
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
                </div >
            </DialogContent>
        </Dialog>
    );
};
