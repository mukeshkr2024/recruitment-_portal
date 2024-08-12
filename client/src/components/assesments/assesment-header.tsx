import { useState, useEffect } from "react";
import { Card } from "../ui/card";

type Props = {
    duration: number; // Duration in minutes
    onTimeUp: () => void; // Callback function when timer ends
}

export const AssessmentHeader = ({ duration, onTimeUp }: Props) => {
    // Convert minutes to seconds
    const initialTime = duration * 60;
    const [timeLeft, setTimeLeft] = useState<number>(initialTime);

    useEffect(() => {
        const now = Date.now();
        const savedTime = localStorage.getItem('assessmentTimeLeft');
        const savedTimestamp = localStorage.getItem('assessmentTimestamp');

        if (savedTime && savedTimestamp) {
            const elapsedTime = Math.floor((now - Number(savedTimestamp)) / 1000);
            const remainingTime = Number(savedTime) - elapsedTime;

            if (remainingTime <= 0) {
                setTimeLeft(0);
                onTimeUp(); // Trigger the time up callback
                localStorage.removeItem('assessmentTimeLeft');
                localStorage.removeItem('assessmentTimestamp');
                return;
            }

            setTimeLeft(remainingTime);
        } else {
            setTimeLeft(initialTime);
            localStorage.setItem('assessmentTimeLeft', initialTime.toString());
            localStorage.setItem('assessmentTimestamp', now.toString());
        }

        // Save time to localStorage every second
        const intervalId = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(intervalId);
                    onTimeUp(); // Trigger the time up callback
                    localStorage.removeItem('assessmentTimeLeft');
                    localStorage.removeItem('assessmentTimestamp');
                    return 0;
                }
                const newTime = prevTime - 1;
                localStorage.setItem('assessmentTimeLeft', newTime.toString());
                localStorage.setItem('assessmentTimestamp', Date.now().toString());
                return newTime;
            });
        }, 1000);

        // Clean up the interval and localStorage on component unmount
        return () => {
            clearInterval(intervalId);
            localStorage.removeItem('assessmentTimeLeft');
            localStorage.removeItem('assessmentTimestamp');
        };
    }, [onTimeUp, initialTime]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <Card className="flex max-w-7xl mx-auto items-center py-5 px-6 shadow-md justify-between">
            <h2 className="text-[#000000] font-semibold text-3xl">Internal Assessment: UI/UX Designer</h2>
            <div>
                <span className="text-3xl font-semibold text-[#ED4338]">{formatTime(timeLeft)}</span>
            </div>
        </Card>
    );
};
