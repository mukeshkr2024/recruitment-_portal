import { useGetQuestion } from "@/api/questions/use-get-question";
import { useUpdateQuestion } from "@/api/questions/use-update-question";
import { Button } from "@/components/ui/button";
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
    questionText: z.string(),
    answer1: z.string(),
    answer2: z.string(),
    answer3: z.string(),
    answer4: z.string(),
});

export const EditQuestion = ({ onClose, questionId }: Props) => {

    const { data: question } = useGetQuestion(questionId);

    const mutation = useUpdateQuestion(questionId)

    const form = useForm<z.infer<typeof editQuestionSchema>>({
        resolver: zodResolver(editQuestionSchema),
        defaultValues: {
            questionText: "",
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
        },
    });

    useEffect(() => {
        if (question) {
            form.reset({
                questionText: question?.questionText,
                answer1: question?.options[0].optionText,
                answer2: question?.options[1].optionText,
                answer3: question?.options[2].optionText,
                answer4: question?.options[3].optionText
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
                    <DialogTitle>Create New Question</DialogTitle>
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
                                                placeholder="eg: UI/UX Designer"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="mt-4 flex flex-col gap-y-4">
                                <h3>Answers</h3>
                                <FormField
                                    control={form.control}
                                    name="answer1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="eg: UI/UX Designer"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /><FormField
                                    control={form.control}
                                    name="answer2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="eg: UI/UX Designer"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /><FormField
                                    control={form.control}
                                    name="answer3"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder="eg: UI/UX Designer"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /><FormField
                                    control={form.control}
                                    name="answer4"
                                    render={({ field }) => (
                                        <FormItem>
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
                            <div className="mb-4 mt-4 flex gap-x-4">
                                <Button
                                    variant="outline"
                                    className="w-28"
                                    onClick={onClose}
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
