import { useEffect, useState } from "preact/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { useUpdateExamStatus } from "@/api/exams/use-update-examStatus";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export interface ExamResult {
    id: string;
    assessment: {
        position: {
            positionName: string;
        };
    };
    exam: {
        name: string;
        duration: number;
    };
    examStatus: 'PASSED' | 'FAILED' | 'PENDING';
    status: string;

}

interface CodingResultProps {
    result: ExamResult;
    applicantId: string;
}

export const CodingResult = ({ result, applicantId }: CodingResultProps) => {
    console.log(applicantId);

    const [isPassed, setIsPassed] = useState<'PASSED' | 'FAILED' | 'PENDING'>('FAILED');

    console.log(result);

    const mutation = useUpdateExamStatus(result.id)

    const handlePassedStatus = (value: 'PASSED' | 'FAILED' | 'PENDING') => {
        setIsPassed(value);
        mutation.mutate(value)

    };

    useEffect(() => {
        setIsPassed(result.examStatus);
    }, [result.examStatus]);

    const getCardBackgroundColor = () => {
        switch (isPassed) {
            case 'PASSED':
                return 'bg-green-100 border-green-300 text-green-800';
            case 'FAILED':
                return 'bg-red-100 border-red-300 text-red-800';
            case 'PENDING':
                return 'bg-yellow-100 border-yellow-300 text-yellow-800';
            default:
                return 'bg-white border-gray-200 text-gray-800';
        }
    };

    return (
        <Card
            key={result.id}
            className={`shadow-lg border rounded-lg transition-shadow ${getCardBackgroundColor()}`}
        >
            <CardHeader className="p-4 rounded-t-lg">
                <div className="mb-2">
                    <CardTitle className="text-xl font-semibold mb-1">
                        Job Position: {result.assessment.position.positionName}
                    </CardTitle>
                    <CardTitle className="text-lg font-semibold">
                        Exam Name: {result.exam.name}
                    </CardTitle>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <CardDescription className="text-sm">
                        Status: <span className="font-medium">{result.status}</span>
                    </CardDescription>
                    <div className="w-1/2">
                        <Label>Marked As</Label>
                        <Select value={isPassed} onValueChange={handlePassedStatus}>
                            <SelectTrigger className="w-full border rounded-md shadow-sm">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="PASSED">Passed</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-2.5 bg-gray-50 rounded-b-lg">
                <div className="w-full flex justify-between">
                    <p className="text-gray-700">
                        <span className="font-semibold">Duration:</span> {result.exam.duration} minutes
                    </p>
                    <Link to={`/applicant/${applicantId}/coding-result/${result?.id}`} >
                        <Button className="bg-blue-500 h-9 px-7">View</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};
