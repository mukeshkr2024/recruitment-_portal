import { useUploadFile } from '@/api/exams/use-upload-file';
import { useDeleteQuestion } from '@/api/questions/use-delete-question';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader, Pencil, Trash, Upload } from 'lucide-react';
import { JSXInternal } from 'node_modules/preact/src/jsx';
import { useState } from 'preact/hooks';
import { CreateQuestion } from './create-question-dialog';
import { EditQuestion } from './edit-questions';
import { CreateCodingQuestion } from './create-coding-questions';
import CodeHighlighter from '@/components/code-highlighter';
import { EditCodingQuestion } from './edit-coding-questions';

export const AssesmentQuestions = ({ examId, codingQuestion, questions, type }: { examId: string, codingQuestion: any, questions: any, type: "mcq" | "coding", }) => {
    const { toast } = useToast();
    const deleteMutation = useDeleteQuestion(type);
    const fileUploadMutation = useUploadFile(examId);
    const [questionToEdit, setQuestionToEdit] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const handleDelete = (questionId: string) => {
        deleteMutation.mutate(questionId, {
            // onSuccess: () => toast({ title: "Question deleted successfully" }),
        });
    };

    const handleFileChange = async (event: JSXInternal.TargetedEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement | null;
        if (target?.files?.[0]) {
            const file = target.files[0];
            setIsUploading(true);
            try {
                await fileUploadMutation.mutateAsync(file);
                toast({ title: "Questions uploaded successfully" });
            } catch {
                toast({
                    variant: "destructive",
                    title: "Failed to upload the file",
                    description: "Please try again",
                });
            } finally {
                setIsUploading(false);
            }
        }
    };

    const renderNonCodingQuestions = () => (
        questions?.length > 0 ? (
            questions.map((question: any, idx: number) => (
                <div key={question.id} className="flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 mb-4 text-base rounded-md px-2 justify-between">
                    <div className="px-2 py-3 flex gap-x-2">
                        <span>{idx + 1}.</span>
                        <h4>{question?.questionText}</h4>
                    </div>
                    <div className="flex gap-x-2.5">
                        <Pencil size={18} className="cursor-pointer" onClick={() => setQuestionToEdit(question?.id)} />
                        <ConfirmDialog onConfirm={() => handleDelete(question?.id)}>
                            <Trash size={18} className="text-red-500 cursor-pointer" />
                        </ConfirmDialog>
                    </div>
                </div>
            ))
        ) : <div>No Questions</div>
    );

    const renderCodingQuestions = () => (
        codingQuestion?.length > 0 ? (
            codingQuestion.map((question: any, idx: number) => (
                <div key={idx} className="flex items-start gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 mb-4 text-base rounded-md px-2 justify-between">
                    <div className="flex gap-x-2 px-2 py-3 w-full">
                        <div>{idx + 1}.</div>
                        <div className="flex flex-col gap-y-3 w-full">
                            <div dangerouslySetInnerHTML={{ __html: question?.questionText }} />
                            {question?.haveQuestionCode && (
                                <CodeHighlighter code={question?.questionCode} language={question?.language} />
                            )}
                        </div>
                    </div>
                    <div className="flex gap-x-2.5 p-3">
                        <Pencil size={18} className="cursor-pointer" onClick={() => setQuestionToEdit(question.id)} />
                        <ConfirmDialog onConfirm={() => handleDelete(question.id)}>
                            <Trash size={18} className="text-red-500 cursor-pointer" />
                        </ConfirmDialog>
                    </div>
                </div>
            ))
        ) : <div className="text-center text-muted-foreground">No Questions</div>
    );

    return (
        <div className="w-full">
            <Card className="w-full p-6">
                <div className="flex w-full justify-between">
                    <h2 className="text-2xl font-semibold">Questions</h2>
                    <div className="flex gap-x-2 items-center">
                        {type !== "coding" ? (
                            <>
                                <label htmlFor="upload-file" className="cursor-pointer flex items-center bg-blue-500 text-white px-3 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition text-sm h-10">
                                    {isUploading ? (
                                        <Loader className="animate-spin mr-2" size={16} />
                                    ) : (
                                        <Upload size={16} className="mr-1.5" />
                                    )}
                                    {isUploading ? "Uploading..." : "Upload Word File"}
                                </label>
                                <input id="upload-file" type="file" accept=".doc,.docx" className="hidden" onChange={handleFileChange} />
                                <CreateQuestion examId={examId} type={type} />
                            </>
                        ) : (
                            <CreateCodingQuestion examId={examId} type={type} />
                        )}
                    </div>
                </div>
                <div className="mt-5">
                    {type === "coding" ? renderCodingQuestions() : renderNonCodingQuestions()}
                </div>
            </Card>
            {questionToEdit && (
                type === "coding" ? (
                    <EditCodingQuestion
                        questionId={questionToEdit}
                        onClose={() => setQuestionToEdit(null)}
                        type={type}
                    />
                ) : (
                    <EditQuestion
                        questionId={questionToEdit}
                        onClose={() => setQuestionToEdit(null)}
                        type={type}
                    />
                )
            )}

        </div>
    );
};
