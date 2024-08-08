import { useGetPositions } from "@/api/positions/use-get-positions";
import { CreatePositions } from "@/components/job-position/create-postions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

interface Position {
    id: string;
    positionName: string;
    createdAt: string;
}

// Define the component
export const PositionPage = () => {
    const { data: positions, error, isLoading, isError } = useGetPositions();


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex w-full justify-between">
                <h2 className="text-2xl font-semibold">Job Positions</h2>
                <div>
                    <CreatePositions />
                </div>
            </div>
            <div className="mt-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                Id
                            </TableHead>
                            <TableHead>
                                Position
                            </TableHead>
                            <TableHead>
                                CreatedAt
                            </TableHead>
                            <TableHead>
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {positions?.length ? (
                            positions.map((position: Position, idx: number) => (
                                <TableRow key={position.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{position.positionName}</TableCell>
                                    <TableCell>{formatDate(position.createdAt)}</TableCell>
                                    <TableCell>
                                        <div>
                                            <Link to={`/positions/${position.id}`}>
                                                <Pencil />
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3}>No positions available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
