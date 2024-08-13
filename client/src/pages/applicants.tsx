import { useGetApplicants } from "@/api/applicants/use-get-applicants";
import { useDeletePosition } from "@/api/positions/use-delete-positions";
// import { CreateApplicant } from "@/components/applicant/create-applicant";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils";
import { Trash } from "lucide-react";

interface Assesment {
    id: string;
    status: string;
    score: number;
    totalScore: number;
    applicant: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        accessCode: string;
    }
    createdAt: string;
    position: {
        positionName: string
    }
}

// Define the component
export const ApplicantsPage = () => {

    const { data: assesments } = useGetApplicants()

    console.log(assesments?.length);


    const deleteMutation = useDeletePosition()

    // if (isLoading) {
    //     return <div>Loading...</div>;
    // }

    const onDelete = (positionId: string) => {
        console.log("Deleting");
        console.log(positionId);
        deleteMutation.mutate(positionId)
    }

    return (
        <div className="p-6">
            <div className="flex w-full justify-between">
                <h2 className="text-3xl font-bold text-blue-900">Job Applicants</h2>
                {/* <div>
                    <CreateApplicant />
                </div> */}
            </div>
            <div className="mt-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                No
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Name
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Email
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Phone
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Applied For
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Status
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">
                                Applied On
                            </TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">Score</TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">Aceess code</TableHead>
                            <TableHead className="text-gray-700 font-semibold bg-gray-200">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assesments?.length ? (
                            assesments.map((assesment: Assesment, idx: number) => (
                                <TableRow key={assesment.id}>
                                    <TableCell className="text-gray-600">{idx + 1}</TableCell>
                                    <TableCell className="text-gray-600">{assesment?.applicant?.firstName}{" "}{assesment?.applicant?.lastName}</TableCell>
                                    <TableCell className="text-gray-600">{assesment?.applicant?.email}</TableCell>
                                    <TableCell className="text-gray-600">{assesment?.applicant?.phone}</TableCell>
                                    <TableCell className="text-gray-600">{assesment.position.positionName}</TableCell>
                                    <TableCell className="text-gray-600">{assesment?.status}</TableCell>
                                    <TableCell className="text-gray-600">{formatDate(assesment.createdAt)}</TableCell>
                                    <TableCell className="text-gray-600">{assesment?.score}/{assesment?.totalScore}</TableCell>
                                    <TableCell className="text-gray-600">{assesment?.applicant.accessCode}</TableCell>
                                    <TableCell className="text-gray-600">
                                        <div className="flex gap-x-5">
                                            {/* <Link to={`/applicants/${applicant.id}`}>
                                                <Pencil size={18} />
                                            </Link> */}
                                            <ConfirmDialog onConfirm={() => onDelete(assesment.id)}>
                                                <Trash size={18} className="text-red-500 cursor-pointer" />
                                            </ConfirmDialog>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3}>No applicants available</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
