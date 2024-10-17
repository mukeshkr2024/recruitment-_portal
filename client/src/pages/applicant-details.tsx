import { useGetApplicant } from "@/api/applicants/use-get-applicant";
import { useUpdateApplicantStatus } from "@/api/applicants/use-update-applicantStatus";
import { CodingResult } from "@/components/exams/coding-result";
import { ExamResult, ExamResultCard } from "@/components/exams/exam-result-card";
import { Button } from "@/components/ui/button";
import {
    Card
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/utils";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ApplicantDetail = () => {
    const { applicantId } = useParams();
    const { data, isLoading, error } = useGetApplicant(applicantId!);
    const [status, setStatus] = useState("");
    const mutation = useUpdateApplicantStatus(applicantId!)
    const navigate = useNavigate();


    if (isLoading) {
        return <div className="flex justify-center items-center h-screen text-gray-600"><p>Loading...</p></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-600"><p>Error loading applicant details.</p></div>;
    }

    if (!data) {
        return <div className="flex justify-center items-center h-screen text-gray-600"><p>No applicant data found.</p></div>;
    }

    const { details, result, coding_result } = data;

    console.log(coding_result);


    useEffect(() => {
        setStatus(data?.details?.status)
    }, [])

    const handleChange = (value: string) => {
        setStatus(value)
        mutation.mutate(value)
    }

    const getCardBackgroundColor = () => {
        switch (status) {
            case 'SELECTED':
                return 'bg-green-100 border-green-300 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 border-red-300 text-red-800';
            case 'INPROGRESS':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            case 'PENDING':
                return 'bg-blue-100 border-blue-300 text-blue-800';
            default:
                return 'bg-white border-gray-200 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-8 min-h-screen space-y-5">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back
            </Button>
            <div className="">
                <h2 className="text-4xl font-bold text-blue-900 mb-6">Applicant Details</h2>
                <Card className={`shadow-xl rounded-lg p-8 mb-8 mt-4 border ${getCardBackgroundColor()}`}>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col space-y-2">
                            <h2 className="text-3xl font-semibold text-gray-800">
                                {details.firstName} {details.lastName}
                            </h2>
                            <p className="text-gray-600">
                                Email: <span className="font-medium text-gray-700">{details.email}</span>
                            </p>
                            <p className="text-gray-600">
                                Phone: <span className="font-medium text-gray-700">{details.phone}</span>
                            </p>
                            <p className="text-gray-600">
                                Access Code: <span className="font-medium text-gray-700">{details.accessCode}</span>
                            </p>
                            <p className="text-gray-600">
                                Applied At: <span className="font-medium text-gray-700">{formatDate(details.createdAt)}</span>
                            </p>
                        </div>
                        <div className="w-1/4">
                            <Select value={status} onValueChange={handleChange}>
                                <SelectTrigger className="w-full border border-gray-300 rounded-md shadow-sm">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="INPROGRESS">InProgress</SelectItem>
                                    <SelectItem value="SELECTED">Selected</SelectItem>
                                    <SelectItem value="REJECTED">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className={`mt-6 ${getCardBackgroundColor}p-6 rounded-lg`}>
                        <h4 className="text-xl font-semibold text-gray-700 mb-4">Assessments</h4>
                        {details.assements?.length > 0 ? (
                            <div className="gap-6 grid grid-cols-2">
                                {details.assements.map((assessment: any, index: number) => (
                                    <div key={index} className=" p-4 rounded-md shadow-sm ">
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
                <h2 className="text-3xl font-bold text-gray-800 mb-6">MCQ Exam Results</h2>
                {result?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {result?.map((examResult: ExamResult) => <ExamResultCard examResult={examResult} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No exam results found.</p>
                )}

                <div className="mt-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Coding Exam Results</h2>
                    {coding_result?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coding_result?.map((examResult: any) => <CodingResult result={examResult}
                                applicantId={applicantId!}
                            />)}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No exam results found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
