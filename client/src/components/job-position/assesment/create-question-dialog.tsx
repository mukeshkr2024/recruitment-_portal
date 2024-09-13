import { useCreateQuestion } from "@/api/questions/use-create-question";
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
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";

SyntaxHighlighter.registerLanguage("javascript", js);

export const questionFormSchema = z.object({
    questionText: z.string().min(10, "Question Title is required"),
    answer1: z.object({
        text: z.string().min(1, "Option 1 is required"),
        isCorrect: z.boolean(),
    }),
    answer2: z.object({
        text: z.string().min(1, "Option 2 is required"),
        isCorrect: z.boolean(),
    }),
    answer3: z.object({
        text: z.string().min(1, "Option 3 is required"),
        isCorrect: z.boolean(),
    }),
    answer4: z.object({
        text: z.string().min(1, "Option 4 is required"),
        isCorrect: z.boolean(),
    }),
    language: z.string().nonempty("Language is required"),
    code: z.string().optional(),
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

export const CreateQuestion = ({ examId }: { examId: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { mutate, isLoading } = useCreateQuestion(examId);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof questionFormSchema>>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: {
            questionText: "",
            answer1: { text: "", isCorrect: false },
            answer2: { text: "", isCorrect: false },
            answer3: { text: "", isCorrect: false },
            answer4: { text: "", isCorrect: false },
            language: "",
            code: "",
        },
    });

    function onSubmit(values: z.infer<typeof questionFormSchema>) {
        mutate(values, {
            onSuccess: () => {
                form.reset();
                setIsOpen(false);
                toast({
                    title: "Question added successfully",
                });
            },
        });
    }

    const { isSubmitting, isValid } = form.formState;

    const options = [
        { label: "JavaScript", value: "javascript" },
        { label: "Python", value: "python" },
        { label: "Java", value: "java" },
        { label: "C++", value: "cpp" },
        { label: "Text", value: "text" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={() => setIsOpen((prevValue) => !prevValue)}>
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
                            {/* Question Title */}
                            <FormField
                                control={form.control}
                                name="questionText"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question Title</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="e.g., What is UI/UX Design?" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Language Selection */}
                            <FormField
                                control={form.control}
                                name="language"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Programming Language</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Language</SelectLabel>
                                                        {options.map((option) => (
                                                            <SelectItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Code Input */}
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Insert code here" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Answers */}
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

                            {/* Submit and Cancel Buttons */}
                            <div className="mt-4 flex gap-x-4">
                                <Button
                                    variant="outline"
                                    className="w-28"
                                    onClick={() => {
                                        setIsOpen((prevValue) => !prevValue);
                                        form.reset();
                                    }}
                                    type="button"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="w-28"
                                    disabled={isSubmitting || !isValid || isLoading}
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


