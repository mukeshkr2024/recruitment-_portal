import { useDeletePosition } from "@/api/positions/use-delete-positions";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils";
import { SITE_URL } from "@/utils/config";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { ConfirmDialog } from "../confirm-dialog";
import { ShareLink } from "../share-link";
import { useToast } from "../ui/use-toast";

export type Position = {
    id: string;
    positionName: string;
    createdAt: string;
    assesment: {
        id: string;
    }[];
}

export const PositionColumnData: ColumnDef<Position>[] = [
    {
        accessorKey: "positionName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const positionId = row.original.id;

            return (<Link to={`/positions/${positionId}/applicants`}>{row.original.positionName}</Link>)
        }
    },
    {
        accessorKey: "assesment",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Total Applicants
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{row.original?.assesment?.length || 0}</div>,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Created At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div>{formatDate(row.original?.createdAt)}</div>,
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
            const deleteMutation = useDeletePosition();
            const positionId = row.original.id;

            const onDelete = (id: string) => {
                deleteMutation.mutate(id, {
                    onSuccess: () => {
                        toast({ title: "Job Position deleted successfully" });
                    },
                });
            };

            return (
                <div className="flex gap-x-5 w-full items-center justify-center">
                    <Link to={`/positions/${positionId}`} className="text-blue-500 hover:text-blue-700">
                        <Pencil size={18} />
                    </Link>
                    <ConfirmDialog onConfirm={() => onDelete(positionId)}>
                        <Trash size={18} className="text-red-500 cursor-pointer hover:text-red-700" />
                    </ConfirmDialog>
                </div>
            );
        },
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Share
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const title = row.original.positionName;
            return <ShareLink link={`${SITE_URL}/applicant-register/${row.original.id}`} title={title} />;
        },
    },
];
