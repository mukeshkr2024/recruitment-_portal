import { useGetExams } from "@/api/exams/use-get-positions";
import { useDeletePosition } from "@/api/positions/use-delete-positions";
import { useGetPositions } from "@/api/positions/use-get-positions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CreatePositions } from "@/components/job-position/create-postions";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from "@/utils";
import { Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom";

interface Position {
    id: string;
    positionName: string;
    createdAt: string;
    assesment: {
        id: string
    }[]
}

// Define the component
export const Exams = () => {
    const { data, isLoading } = useGetExams();
    const { toast } = useToast()

    const deleteMutation = useDeletePosition()

    if (isLoading) {
        return <LoadingSpinner />
    }

    const { exams } = data;

    const onDelete = (positionId: string) => {
        deleteMutation.mutate(positionId, {
            onSuccess: () => {
                toast({
                    title: "Job Position deleted Successfully"
                })
            }
        })
    }

    return (
        <div className="p-6 bg-gray-100">
            <div className="flex w-full justify-between">
                <h2 className="text-3xl font-bold text-blue-900">
                    Exams
                </h2>

                <div>
                    <CreatePositions />
                </div>
            </div>
            <div className="mt-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Id
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Name
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Total Questions
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                CreatedAt
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {exams?.length ? (
                            exams.map((exam: Position, idx: number) => (
                                <TableRow key={exam.id} className="hover:bg-gray-100">
                                    <TableCell className="text-gray-600">{idx + 1}</TableCell>
                                    <TableCell className="text-gray-800">{exam?.name}</TableCell>
                                    <TableCell className="text-gray-800">10</TableCell>
                                    <TableCell className="text-gray-600">{formatDate(exam.createdAt)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-x-5">
                                            <Link to={`/exams/${exam.id}`} className="text-blue-500 hover:text-blue-700">
                                                <Pencil size={18} />
                                            </Link>
                                            <ConfirmDialog onConfirm={() => onDelete(exam.id)}>
                                                <Trash size={18} className="text-red-500 cursor-pointer hover:text-red-700" />
                                            </ConfirmDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-gray-500 text-center">No positions available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
