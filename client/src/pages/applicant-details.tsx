import { useGetApplicant } from "@/api/applicants/use-get-applicant";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { useState } from "react";
import { formatDate } from "@/utils";

export const ApplicantDetail = () => {
    const { applicantId } = useParams();
    const { data, isLoading, error } = useGetApplicant(applicantId!);
    const [status, setStatus] = useState("INPROGRESS");

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen text-gray-600"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-600"><p>Error loading applicant details.</p></div>;
    }

    if (!data) {
        return <div className="flex justify-center items-center h-screen text-gray-600"><p>No applicant data found.</p></div>;
    }

    const { details, result } = data;

    return (
        <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
            <h2 className="text-4xl font-bold text-blue-900 mb-6">Applicant Details</h2>
            <Card className="bg-white shadow-xl rounded-lg p-8 mb-8 mt-4 border border-gray-200">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col space-y-2">
                        <h2 className="text-3xl font-semibold text-gray-800">{details.firstName} {details.lastName}</h2>
                        <p className="text-gray-600">Email: <span className="font-medium text-gray-700">{details.email}</span></p>
                        <p className="text-gray-600">Phone: <span className="font-medium text-gray-700">{details.phone}</span></p>
                        <p className="text-gray-600">Access Code: <span className="font-medium text-gray-700">{details.accessCode}</span></p>
                        <p className="text-gray-600">Applied At: <span className="font-medium text-gray-700">{formatDate(details.createdAt)}</span></p>
                    </div>
                    <div className="w-1/4">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SELECTED">Selected</SelectItem>
                                <SelectItem value="REJECTED">Rejected</SelectItem>
                                <SelectItem value="INPROGRESS">In Progress</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">Assessments</h4>
                    {details.assements?.length > 0 ? (
                        <div className=" gap-6 grid grid-cols-2">
                            {details.assements.map((assessment: any, index: any) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-md shadow-sm border border-gray-200">
                                    <p className="text-gray-800 font-medium">{assessment?.position?.positionName}</p>
                                    <p className="text-gray-600">{formatDate(assessment?.createdAt)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No assessments found.</p>
                    )}
                </div>
            </Card>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">Exam Results</h2>
            {result?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {result.map((examResult: any) => (
                        <Card key={examResult.id} className="shadow-lg border border-gray-200 rounded-lg bg-white hover:shadow-xl transition-shadow">
                            <CardHeader className="p-4 bg-blue-50 rounded-t-lg">
                                <CardTitle className="text-lg font-semibold text-blue-800">{examResult.exam.name}</CardTitle>
                                <CardDescription className="text-gray-600">Status: <span className={`font-medium ${examResult.status === 'PASSED' ? 'text-green-600' : 'text-red-600'}`}>{examResult.status}</span></CardDescription>
                            </CardHeader>
                            <CardContent className="p-4">
                                <p className="font-medium text-gray-700">Score: {examResult.score} / {examResult.totalScore}</p>
                                <p className="font-medium text-gray-700">Duration: {examResult.exam.duration} minutes</p>
                            </CardContent>
                            <CardFooter className="bg-gray-50 p-4 rounded-b-lg">
                                <p className="text-gray-500">Exam ID: {examResult.id}</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No exam results found.</p>
            )}
        </div>
    );
};
