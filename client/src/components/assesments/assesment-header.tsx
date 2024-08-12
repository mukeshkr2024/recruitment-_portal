import { useState, useEffect } from "react";
import { Card } from "../ui/card";

type Props = {
    duration: number; // Duration in minutes
    onTimeUp: () => void; // Callback function when timer ends
}

export const AssessmentHeader = ({ duration, onTimeUp }: Props) => {
    // Convert duration from minutes to seconds
    const initialTime = duration * 60;

    const [timeLeft, setTimeLeft] = useState<number>(initialTime);

    useEffect(() => {
        // Initialize the timer from localStorage if available
        const savedTime = localStorage.getItem('secondsLeft');
        if (savedTime) {
            setTimeLeft(parseInt(savedTime, 10));
        } else {
            localStorage.setItem('secondsLeft', initialTime.toString());
        }

        // Timer countdown logic
        const countdown = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    localStorage.removeItem('secondsLeft');
                    onTimeUp();
                    return 0;
                }
                const newTime = prev - 1;
                localStorage.setItem('secondsLeft', newTime.toString());
                return newTime;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [initialTime, onTimeUp]);

    // Format the time in MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
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
