import { Card } from '@/components/ui/card';
import { Pencil, Trash } from 'lucide-react';
import { CreateQuestion } from './create-question-dialog';
import { useDeleteQuestion } from '@/api/questions/use-delete-question';
import { useState } from 'preact/hooks';
import { EditQuestion } from './edit-questions';
import { ConfirmDialog } from '@/components/confirm-dialog';

type Question = {
    id: string,
    positionId: string,
    questionText: string
}

export const AssesmentQuestions = ({ positionId, questions }: { positionId: string, questions: any }) => {

    const mutation = useDeleteQuestion();
    const [questionToEdit, setQuestionToEdit] = useState<string | null>(null);

    const handleDelete = (questionId: string) => {
        mutation.mutate(questionId);
    }

    return (
        <div className="w-full">
            <Card className="w-full p-6">
                <div className="flex w-full justify-between">
                    <h2 className="text-2xl font-semibold">Questions</h2>
                    <CreateQuestion positionId={positionId} />
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
