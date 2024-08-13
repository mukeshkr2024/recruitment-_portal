import { useUpdateDuration } from '@/api/use-updateDuration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export const AssessmentDuration = ({ duration: initialDuration, positionId }: { duration: number, positionId: string }) => {
    const [duration, setDuration] = useState(initialDuration);
    const mutation = useUpdateDuration(positionId)

    const handleInputChange = (event: any) => {
        setDuration(Number(event.target.value));
    };

    const handleUpdateClick = () => {
        mutation.mutate(duration);
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
                    <Button onClick={handleUpdateClick}>Update</Button>
                </CardContent>
            </Card>
        </div>
    );
};
