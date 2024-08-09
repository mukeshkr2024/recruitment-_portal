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
                <h2 className="text-2xl font-semibold">Job Applicants</h2>
                <div>
                    <CreateApplicant />
                </div>
            </div>
            <div className="mt-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                No
                            </TableHead>
                            <TableHead>
                                Name
                            </TableHead>
                            <TableHead>
                                Email
                            </TableHead>
                            <TableHead>
                                Phone
                            </TableHead>
                            <TableHead>
                                Applied For
                            </TableHead>
                            <TableHead>
                                Status
                            </TableHead>
                            <TableHead>
                                Applied On
                            </TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Aceess code</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {applicants?.length ? (
                            applicants.map((applicant: Applicant, idx: number) => (
                                <TableRow key={applicant.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>{applicant.firstName}{" "}{applicant.lastName}</TableCell>
                                    <TableCell>{applicant.email}</TableCell>
                                    <TableCell>{applicant.phone}</TableCell>
                                    <TableCell>{applicant.position.positionName}</TableCell>
                                    <TableCell>Not Completed</TableCell>
                                    <TableCell>{formatDate(applicant.createdAt)}</TableCell>
                                    <TableCell>Null</TableCell>
                                    <TableCell>{applicant.accessCode}</TableCell>
                                    <TableCell>
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
