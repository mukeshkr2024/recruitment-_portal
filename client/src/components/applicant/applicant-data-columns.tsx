import { ArrowUpDown, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "../confirm-dialog";
import { useDeleteApplicant } from "@/api/applicants/use-delete-applicant";
import { useToast } from "../ui/use-toast";
import { ColumnDef } from "@tanstack/react-table";

export type Applicant = {
    id: string;
    positionName: string;
    createdAt: string;
    applicant: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        accessCode: string;
    };
    position: {
        positionName: string;
    };
};

export const ApplicantColumnData: ColumnDef<Applicant>[] = [
    {
        accessorKey: "applicant.firstName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <Link to={`/applicant/${row.original.id}/applicants`}>
                {row.original.applicant.firstName} {row.original.applicant.lastName}
            </Link>
        ),
    },
    {
        accessorKey: "applicant.email",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.original.applicant.email,
    },
    {
        accessorKey: "applicant.phone",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Phone
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.original.applicant.phone,
    },
    {
        accessorKey: "position.positionName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Applied For
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.original.position.positionName,
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
        accessorKey: "applicant.accessCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Access Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.original.applicant.accessCode,
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
            const deleteMutation = useDeleteApplicant()

            const onDelete = (applicantId: string) => {
                deleteMutation.mutate(applicantId, {
                    onSuccess: () => {
                        toast(
                            {
                                title: "Applicant deleted successfully"
                            }
                        )
                    }
                })
            }
            return (
                <div className="flex gap-x-5 w-full items-center justify-center">
                    <ConfirmDialog onConfirm={() => onDelete(row.original.applicant.id)}>
                        <Trash size={18} className="text-red-500 cursor-pointer hover:text-red-700" />
                    </ConfirmDialog>
                </div>
            );
        },
    },
];
