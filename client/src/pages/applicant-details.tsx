import { useGetApplicant } from "@/api/applicants/use-get-applicant";
import { useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const ApplicantDetail = () => {
    const { applicantId } = useParams();
    const { data, isLoading, error } = useGetApplicant(applicantId!);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading applicant details.</p>;
    }

    if (!data) {
        return <p>No applicant data found.</p>;
    }

    const { details, result } = data;

    return (
        <div className="container mx-auto p-4">
            <Card className="mb-6 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        {details.firstName} {details.lastName}
                    </CardTitle>
                    <CardDescription>Email: {details.email}</CardDescription>
                    <CardDescription>Phone: {details.phone}</CardDescription>
                    <CardDescription>Access Code: {details.accessCode}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">
                        Created At: {new Date(details.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-500">
                        Updated At: {new Date(details.updatedAt).toLocaleDateString()}
                    </p>
                </CardContent>
                <CardFooter>
                    <h4 className="text-lg font-semibold">Assessments</h4>
                    {details.assements.map((assessment, index) => (
                        <p key={index}>
                            {assessment.position.positionName} -{" "}
                            {new Date(assessment.createdAt).toLocaleDateString()}
                        </p>
                    ))}
                </CardFooter>
            </Card>

            <h2 className="text-xl font-semibold mb-4">Exam Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.map((examResult) => (
                    <Card key={examResult.id} className="shadow-lg">
                        <CardHeader>
                            <CardTitle>{examResult.exam.name}</CardTitle>
                            <CardDescription>Status: {examResult.status}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Score: {examResult.score} / {examResult.totalScore}</p>
                            <p>Duration: {examResult.exam.duration} minutes</p>
                        </CardContent>
                        <CardFooter>
                            <p className="text-gray-500">
                                Exam ID: {examResult.id}
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};
