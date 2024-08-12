import { useDeletePosition } from "@/api/positions/use-delete-positions";
import { useGetPositions } from "@/api/positions/use-get-positions";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CreatePositions } from "@/components/job-position/create-postions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
export const PositionPage = () => {
    const { data: positions, isLoading } = useGetPositions();

    const deleteMutation = useDeletePosition()

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const onDelete = (positionId: string) => {
        console.log("Deleting");
        deleteMutation.mutate(positionId)
    }

    return (
        <div className="p-6 bg-gray-100">
            <div className="flex w-full justify-between">
                <h2 className="text-3xl font-bold text-blue-900">
                    Job Positions
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
                                Position
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Total Applicants
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
                        {positions?.length ? (
                            positions.map((position: Position, idx: number) => (
                                <TableRow key={position.id} className="hover:bg-gray-100">
                                    <TableCell className="text-gray-600">{idx + 1}</TableCell>
                                    <TableCell className="text-gray-800">{position.positionName}</TableCell>
                                    <TableCell className="text-gray-800">{position?.assesment?.length || 0}</TableCell>
                                    <TableCell className="text-gray-600">{formatDate(position.createdAt)}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-x-5">
                                            <Link to={`/positions/${position.id}`} className="text-blue-500 hover:text-blue-700">
                                                <Pencil size={18} />
                                            </Link>
                                            <ConfirmDialog onConfirm={() => onDelete(position.id)}>
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
