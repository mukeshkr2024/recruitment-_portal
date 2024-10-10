"use client";

import { useCreateQuestion } from "@/api/questions/use-create-question";
import { useGetQuestion } from "@/api/questions/use-get-question";
import { useUpdateQuestion } from "@/api/questions/use-update-question";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import { z } from "zod";
import { languageOptions } from "@/utils/config";

type Props = {
    onClose: () => void;
    questionId: string;
    type: "coding" | "mcq";
};

const questionFormSchema = z.object({
    questionText: z.string().min(10, "Question Title is required"),
    questionCode: z.string().optional(),
    haveQuestionCode: z.boolean().optional(),
    language: z.string().min(1, "Programming Language is required"),
});

export const EditCodingQuestion = ({ onClose, type, questionId }: Props) => {
    const { data: question } = useGetQuestion(questionId, type);
    const mutation = useUpdateQuestion(questionId, type);

    const form = useForm<z.infer<typeof questionFormSchema>>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: {
            questionText: "",
            questionCode: "",
            haveQuestionCode: false,
            language: "",
        },
    });

    const watchHaveCode = form.watch("haveQuestionCode");

    useEffect(() => {
        if (question) {
            form.reset({
                questionText: question?.questionText,
                questionCode: question?.questionCode,
                haveQuestionCode: !!question?.questionCode,
                language: question?.language,
            });
        }
    }, [question]);

    const onSubmit = (values: any) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const { isSubmitting, isValid } = form.formState;


    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl w-[90%]" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                <DialogHeader>
                    <DialogTitle>Edit Coding Question</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="questionText"
                            render={({ field }) => (
                                <FormItem style={{ height: "180px" }}>
                                    <FormLabel>Question Title</FormLabel>
                                    <FormControl>
                                        <ReactQuill
                                            value={field.value}
                                            onChange={field.onChange}
                                            theme="snow"
                                            placeholder="e.g., What is UI/UX Design?"
                                            className="font-hanken-grotesk"
                                            style={{ height: "110px" }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Select Programming Language</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {languageOptions.map((lang) => (
                                                    <SelectItem key={lang.language} value={lang.language}>
                                                        <span className="capitalize">{lang.language}</span>
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
                            control={form.control}
                            name="haveQuestionCode"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                id="questionCodeCheckbox"
                                                checked={field.value}
                                                onCheckedChange={(checked) => field.onChange(!!checked)}
                                            />
                                        </FormControl>
                                        <label htmlFor="questionCodeCheckbox" className="text-sm font-medium">
                                            Add Question Code
                                        </label>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {watchHaveCode && (
                            <FormField
                                control={form.control}
                                name="questionCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Question Code</FormLabel>
                                        <FormControl>
                                            <CodeMirror
                                                value={field.value || ""}
                                                options={{
                                                    mode: "javascript",
                                                    theme: "default",
                                                    lineNumbers: true,
                                                    lineWrapping: true,
                                                }}
                                                onBeforeChange={(_, __, value) => field.onChange(value)}
                                                className="border"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="mb-4 mt-4 flex gap-x-4">
                            <Button
                                variant="outline"
                                className="w-28"
                                type="button"
                                onClick={onClose}
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
            </DialogContent>
        </Dialog>
    );
};
