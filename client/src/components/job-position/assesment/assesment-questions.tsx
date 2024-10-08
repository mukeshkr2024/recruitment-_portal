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

type Question = {
    id: string,
    examId: string,
    questionText: string
}

export const AssesmentQuestions = ({ examId, questions, type }: { examId: string, questions: any, type: "mcq" | "coding" }) => {
    const { toast } = useToast();
    const deleteMutation = useDeleteQuestion();
    const fileUploadMutation = useUploadFile(examId);
    const [questionToEdit, setQuestionToEdit] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);



    const handleDelete = (questionId: string) => {
        deleteMutation.mutate(questionId, {
            onSuccess: () => {
                toast({
                    title: "Question deleted successfully",
                });
            }
        });
    }

    const handleFileChange = async (event: JSXInternal.TargetedEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement | null;

        if (target && target.files && target.files[0]) {
            const file = target.files[0];

            try {
                setIsUploading(true);
                await fileUploadMutation.mutateAsync(file); // Trigger the file upload
                toast({
                    title: "Questions uploaded successfully",
                });
            } catch (error) {
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


    return (
        <div className="w-full">
            <Card className="w-full p-6">
                <div className="flex w-full justify-between">
                    <h2 className="text-2xl font-semibold">Questions</h2>
                    <div className="flex gap-x-2 items-center">
                        {/* Upload Button */}
                        {type !== "coding" && <>
                            <label htmlFor="upload-file" className="cursor-pointer flex items-center bg-blue-500 text-white px-3 py-1.5 rounded-md shadow-md hover:bg-blue-600 transition text-sm h-10">
                                {isUploading ? (
                                    <Loader className="animate-spin mr-2" size={16} />
                                ) : (
                                    <Upload size={16} className="mr-1.5" />
                                )}
                                {isUploading ? "Uploading..." : "Upload Word File"}
                            </label>
                            <input
                                id="upload-file"
                                type="file"
                                accept=".doc,.docx"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </>
                        }
                        {type === "coding" ? <>
                            <CreateCodingQuestion examId={examId} type={type} />
                        </> :
                            <CreateQuestion examId={examId} type={type} />}
                    </div>
                </div>
                <div className="mt-5">
                    {
                        questions?.length > 0 ? (
                            questions.map((question: Question, idx: number) => (
                                <div key={question.id} className="flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 mb-4 text-base rounded-md px-2 justify-between">
                                    <div className="px-2 py-3 flex gap-x-2">
                                        <span>{idx + 1}.</span>
                                        <h4>{question.questionText}</h4>
                                    </div>
                                    <div className="flex gap-x-2.5">
                                        <Pencil size={18} className="cursor-pointer" onClick={() => setQuestionToEdit(question.id)} />
                                        <ConfirmDialog onConfirm={() => handleDelete(question.id)}>
                                            <Trash size={18} className="text-red-500 cursor-pointer" />
                                        </ConfirmDialog>
                                    </div>
                                </div>
                            ))
                        ) : <div>No Questions</div>
                    }
                </div>
            </Card>
            {questionToEdit && (
                <EditQuestion
                    questionId={questionToEdit}
                    onClose={() => setQuestionToEdit(null)}
                />
            )}
        </div>
    );
};
