"use client";

import { useCreateQuestion } from "@/api/questions/use-create-question";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { languageOptions } from "@/utils/config";
import { zodResolver } from "@hookform/resolvers/zod";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/javascript/javascript";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { z } from "zod";

export const questionFormSchema = z.object({
    questionText: z.string().min(10, "Question Title is required"),
    questionCode: z.string().optional(),
    haveQuestionCode: z.boolean().optional(),
    language: z.string().min(1, "Programming Language is required"),
});

export const CreateCodingQuestion = ({ examId, type }: { examId: string; type: "mcq" | "coding" }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showCodeField, setShowCodeField] = useState<boolean>(false);
    const { mutate, isLoading } = useCreateQuestion(examId, type);


    const form = useForm<z.infer<typeof questionFormSchema>>({
        resolver: zodResolver(questionFormSchema),
        defaultValues: {
            questionText: "",
            questionCode: "",
            haveQuestionCode: false,
        },
    });

    const onSubmit = (data: z.infer<typeof questionFormSchema>) => {
        console.log("Submitted data:", data)
        mutate(data, {
            onSuccess: () => {
                form.reset();
                setIsOpen(false);
                toast({
                    title: "Question added successfully",
                });
            },
        })
    };

    const { isSubmitting, isValid } = form.formState;

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
            <DialogContent className="max-w-6xl w-[90%]" style={{ maxHeight: "80vh", overflowY: "auto" }}>
                <DialogHeader>
                    <DialogTitle>Create New Question</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-y-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="questionText"
                                render={({ field }) => (
                                    <FormItem style={{
                                        height: "180px"
                                    }}>
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
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        languageOptions.map(lang => <SelectItem value={lang.language}>
                                                            <span className="capitalize">{lang.language}</span>
                                                        </SelectItem>)
                                                    }
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
                                                    onCheckedChange={(checked) => {
                                                        const isChecked = checked === true;
                                                        field.onChange(isChecked);
                                                        setShowCodeField(isChecked);
                                                    }}
                                                />
                                            </FormControl>
                                            <label htmlFor="questionCodeCheckbox" className="text-sm font-medium leading-none">
                                                Add Question Code
                                            </label>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {showCodeField && (
                                <FormField
                                    control={form.control}
                                    name="questionCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Question Code</FormLabel>
                                            <FormControl>
                                                <CodeMirror
                                                    value={field.value ?? " "}
                                                    options={{
                                                        mode: "javascript",
                                                        theme: "default",
                                                        lineNumbers: true,
                                                        lineWrapping: true,
                                                    }}
                                                    onBeforeChange={(editor, data, value) => {
                                                        field.onChange(value);
                                                    }}
                                                    className="border"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {/* Submit Button */}
                            <Button type="submit" className="mt-1.5 px-12"
                                disabled={isSubmitting || isLoading}
                            >
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};
