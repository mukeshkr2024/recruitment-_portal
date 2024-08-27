import { useEffect, useState } from "preact/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { useUpdateExamStatus } from "@/api/exams/use-update-examStatus";

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
    score: number;
    totalScore: number;
    examStatus: 'PASSED' | 'FAILED' | 'PENDING';
    status: string;
}

interface ExamResultCardProps {
    examResult: ExamResult;
}

export const ExamResultCard = ({ examResult }: ExamResultCardProps) => {
    const [isPassed, setIsPassed] = useState<'PASSED' | 'FAILED' | 'PENDING'>('FAILED');

    const mutation = useUpdateExamStatus(examResult.id)

    const handlePassedStatus = (value: 'PASSED' | 'FAILED' | 'PENDING') => {
        setIsPassed(value);
        mutation.mutate(value)

    };

    useEffect(() => {
        setIsPassed(examResult.examStatus);
    }, [examResult.examStatus]);

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
            key={examResult.id}
            className={`shadow-lg border rounded-lg transition-shadow ${getCardBackgroundColor()}`}
        >
            <CardHeader className="p-4 rounded-t-lg">
                <div className="mb-2">
                    <CardTitle className="text-xl font-semibold mb-1">
                        Job Position: {examResult.assessment.position.positionName}
                    </CardTitle>
                    <CardTitle className="text-lg font-semibold">
                        Exam Name: {examResult.exam.name}
                    </CardTitle>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <CardDescription className="text-sm">
                        Status: <span className="font-medium">{examResult.status}</span>
                    </CardDescription>
                    <div className="w-1/2">
                        <Label>Marked As</Label>
                        <Select value={isPassed} onValueChange={handlePassedStatus}>
                            <SelectTrigger className="w-full border rounded-md shadow-sm">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PASSED">Passed</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 bg-gray-50 rounded-b-lg">
                <div className="space-y-2">
                    <p className="text-gray-700">
                        <span className="font-semibold">Score:</span> {examResult.score} / {examResult.totalScore}
                    </p>
                    <p className="text-gray-700">
                        <span className="font-semibold">Duration:</span> {examResult.exam.duration} minutes
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
