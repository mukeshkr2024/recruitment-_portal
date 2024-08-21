import { useDeletePositionExam } from '@/api/position-exam/use-deletePositionExam';
import { useGetPositionExams } from '@/api/position-exam/use-getPositionExams';
import { useUpdateActiveStatus } from '@/api/position-exam/use-update-activeStatus';
import { Trash } from 'lucide-react';
import { ConfirmDialog } from '../confirm-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CreateJobPositionExam } from './create-jobPostion-exam';

interface PositionExam {
    examId: string;
    isActive: boolean;
    exam: {
        name: string;
    };
}

export const PositionExams = ({ positionId }: { positionId: string }) => {
    const { data: positionExams = [] } = useGetPositionExams(positionId);
    const { mutate } = useUpdateActiveStatus(positionId);
    const { mutate: deleteMutation } = useDeletePositionExam(positionId)


    const handleDelete = (examId: string) => {
        // Implement the delete logic here
        console.log(`Delete exam with id: ${examId}`);
        deleteMutation({ examId })
    };

    const handleStatusChange = (examId: string, event: any) => {
        const isActive = event.target.value === 'active';
        mutate({ examId, isActive });
    };

    return (
        <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Assigned Exams</CardTitle>

                    <CreateJobPositionExam positionId={positionId} />
                </div>

            </CardHeader>
            <CardContent className="p-4">
                <div>
                    {positionExams.length > 0 ? (
                        <div className="space-y-4">
                            {positionExams.map((exam: PositionExam, idx: number) => (
                                <div
                                    key={exam.examId}
                                    className="flex items-center gap-x-4 bg-white border border-gray-200 shadow-sm rounded-md p-4 transition-transform transform"
                                >
                                    <div className="flex items-center gap-x-3">
                                        <span className="font-semibold text-gray-700">{idx + 1}.</span>
                                        <h4 className="text-md font-medium text-gray-800">{exam.exam.name}</h4>
                                    </div>
                                    <div className="flex items-center gap-x-4 ml-auto">
                                        <select
                                            value={exam.isActive ? 'active' : 'inactive'}
                                            onChange={(e) => handleStatusChange(exam.examId, e)}
                                            className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                        <ConfirmDialog onConfirm={() => handleDelete(exam.examId)}>
                                            <Trash size={18} className="text-red-500 cursor-pointer hover:text-red-700 transition-colors" />
                                        </ConfirmDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mt-6">
                            No Exams assigned to this position.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card >
    );
};
