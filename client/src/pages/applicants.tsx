import { useGetApplicants } from "@/api/applicants/use-get-applicants";
import { useDeletePosition } from "@/api/positions/use-delete-positions";
import { CreateApplicant } from "@/components/applicant/create-applicant";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/utils";
import { Trash } from "lucide-react";

interface Applicant {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    accessCode: string;
    createdAt: string;
    position: {
        positionName: string
    }
}

// Define the component
export const ApplicantsPage = () => {

    const { data: applicants, isLoading } = useGetApplicants()

    console.log(applicants?.length);


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
                <div>
                    <CreateApplicant />
                </div>
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
                        {applicants?.length ? (
                            applicants.map((applicant: Applicant, idx: number) => (
                                <TableRow key={applicant.id}>
                                    <TableCell className="text-gray-600">{idx + 1}</TableCell>
                                    <TableCell className="text-gray-600">{applicant.firstName}{" "}{applicant.lastName}</TableCell>
                                    <TableCell className="text-gray-600">{applicant.email}</TableCell>
                                    <TableCell className="text-gray-600">{applicant.phone}</TableCell>
                                    <TableCell className="text-gray-600">{applicant.position.positionName}</TableCell>
                                    <TableCell className="text-gray-600">Not Completed</TableCell>
                                    <TableCell className="text-gray-600">{formatDate(applicant.createdAt)}</TableCell>
                                    <TableCell className="text-gray-600">Null</TableCell>
                                    <TableCell className="text-gray-600">{applicant.accessCode}</TableCell>
                                    <TableCell className="text-gray-600">
                                        <div className="flex gap-x-5">
                                            {/* <Link to={`/applicants/${applicant.id}`}>
                                                <Pencil size={18} />
                                            </Link> */}
                                            <ConfirmDialog onConfirm={() => onDelete(applicant.id)}>
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
