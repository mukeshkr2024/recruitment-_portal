import { useUpdateExamDuration } from '@/api/exams/use-updateExamDuration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';

export const AssessmentDuration = ({ duration: initialDuration, examId }: { duration: number, examId: string }) => {
    const [duration, setDuration] = useState(initialDuration);
    const { mutate, isLoading, } = useUpdateExamDuration(examId)
    const { toast } = useToast()
    const handleInputChange = (event: any) => {
        setDuration(Number(event.target.value));
    };

    const handleUpdateClick = () => {
        mutate(duration, {
            onSuccess: () => {
                toast({
                    title: "Assessment duration updated successfully"
                });
            },

        });
    };

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
                    <Button disabled={isLoading} onClick={handleUpdateClick}>Update</Button>
                </CardContent>
            </Card>
        </div>
    );
};
