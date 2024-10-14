import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "../confirm-dialog";
import { useToast } from "../ui/use-toast";
import { useDeleteExam } from "@/api/exams/use-deleteExam";

export type Exam = {
    id: string;
    name: string;
    createdAt: string;
    duration: number;
    totalQuestions: number;
    examType: string;
};

export const ExamColumnData: ColumnDef<Exam>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Exam Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div>
                {row.original.name}
            </div>
        ),
    },
    {
        accessorKey: "examType",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Exam Type
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="uppercase">
                {row.original?.examType}
            </div>
        ),
    },
    {
        accessorKey: "totalQuestions",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Total Questions
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.original.totalQuestions,
    },
    {
        accessorKey: "duration",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Duration
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.original.duration,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Applied On
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => formatDate(row.original.createdAt),
    },

    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Action
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const { toast } = useToast();
            const deleteMutation = useDeleteExam()

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
                <div className="flex gap-x-5 w-full items-center justify-center">
                    <Link to={`/exams/${row.original.id}`} className="text-blue-500 hover:text-blue-700">
                        <Pencil size={18} />
                    </Link>
                    <ConfirmDialog onConfirm={() => onDelete(row.original.id)}>
                        <Trash size={18} className="text-red-500 cursor-pointer hover:text-red-700" />
                    </ConfirmDialog>
                </div>
            );
        },
    },
];
