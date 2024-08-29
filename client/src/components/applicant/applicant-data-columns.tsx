import { ArrowUpDown, Trash, XCircle, CheckCircle, Hourglass, Loader } from "lucide-react";
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
        status: "REJECTED" | "INPROGRESS" | "SELECTED" | "PENDING";
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
            <Link to={`/applicant/${row.original.applicant.id}`}>
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
        accessorKey: "applicant.status",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const status = row.original.applicant.status;

            // Convert the status to a formatted version, like "Rejected"
            const formattedStatus =
                status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

            let statusColor, StatusIcon;

            switch (status) {
                case "REJECTED":
                    statusColor = "text-red-500";
                    StatusIcon = XCircle;
                    break;
                case "INPROGRESS":
                    statusColor = "text-yellow-500";
                    StatusIcon = Loader;
                    break;
                case "SELECTED":
                    statusColor = "text-green-500";
                    StatusIcon = CheckCircle;
                    break;
                case "PENDING":
                    statusColor = "text-blue-500";
                    StatusIcon = Hourglass;
                    break;
                default:
                    statusColor = "text-gray-500";
                    StatusIcon = Loader;
                    break;
            }

            return (
                <div className="flex items-center gap-2">
                    <StatusIcon className={`w-5 h-5 ${statusColor}`} />
                    <span className={statusColor}>{formattedStatus}</span>
                </div>
            );
        },
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
            const deleteMutation = useDeleteApplicant();

            const onDelete = (applicantId: string) => {
                deleteMutation.mutate(applicantId, {
                    onSuccess: () => {
                        toast({
                            title: "Applicant deleted successfully",
                        });
                    },
                });
            };

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
