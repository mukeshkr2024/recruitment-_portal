import { useUpdateExamDuration } from '@/api/exams/use-updateExamDuration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AssessmentDuration = ({ duration: initialDuration, examId }: { duration: number, examId: string }) => {
    const [duration, setDuration] = useState(initialDuration);
    const { mutate, isLoading } = useUpdateExamDuration(examId);
    const { toast } = useToast();
    const navigate = useNavigate()

    const handleInputChange = (event: any) => {
        const value = Number(event.target.value);
        if (value >= 0) {
            setDuration(value);
        }
    };

    const handleUpdateClick = () => {
        mutate(duration, {
            onSuccess: () => {
                toast({
                    title: "Assessment duration updated successfully"
                });
                navigate("/exams")
            },
        });
    };

    const isButtonDisabled = isLoading || duration === initialDuration;

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Assessment Duration</CardTitle>
                    <CardDescription>Duration (in minutes)</CardDescription>
                </CardHeader>
                <CardContent className="flex max-w-xs gap-x-4">
                    <Input
                        type="number"
                        value={duration}
                        onChange={handleInputChange}
                        required={true}
                    />
                    <Button disabled={isButtonDisabled} onClick={handleUpdateClick}>Update</Button>
                </CardContent>
            </Card>
        </div>
    );
};
