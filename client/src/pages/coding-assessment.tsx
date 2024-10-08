import { useGetCodingQuestions } from "@/api/applicants/coding-exam/use-get-coding-questions";
import { CodingQuestion } from "@/components/coding-exam/coding-question";
import { useEffect, useState } from "preact/hooks";
import { useParams } from "react-router-dom";

export const CodingAssessmentPage = () => {
    const { assesmentId, examId } = useParams();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const { data, isLoading } = useGetCodingQuestions(assesmentId!, examId!);

    if (isLoading) {
        return <div>Loading...</div>
    }

    console.log(data);

    console.log(assesmentId, examId);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < (data?.codingQuestions.length || 0) - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const isNextDisabled = currentQuestionIndex >= (data?.codingQuestions.length || 0) - 1;
    const isPrevDisabled = currentQuestionIndex === 0;

    const duration = data?.duration; // Duration in minutes
    const initialTime = duration * 60; // Convert duration to seconds
    const [timeLeft, setTimeLeft] = useState<number>(initialTime);

    useEffect(() => {
        if (timeLeft <= 0) return; // Stop the countdown when time reaches zero

        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1); // Decrease time left by 1 second
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft === 0) {
            // Handle what happens when the time runs out, e.g., submit the exam or show a timeout message
            console.log("Time's up!");
        }
    }, [timeLeft]);

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <CodingQuestion
                data={data?.codingQuestions[currentQuestionIndex] || {}}
                handleNextQuestion={handleNextQuestion}
                handlePrevQuestion={handlePrevQuestion}
                isNextDisabled={isNextDisabled}
                isPrevDisabled={isPrevDisabled}
                currentIndex={currentQuestionIndex}
                totalQuestions={data?.codingQuestions.length || 0}
                timeLeft={timeLeft}
                assesmentId={assesmentId!}
                examId={examId!}
            />
        </div>
    )
}
