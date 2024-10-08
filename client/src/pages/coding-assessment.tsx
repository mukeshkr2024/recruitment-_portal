import { useGetCodingQuestions } from "@/api/applicants/coding-exam/use-get-coding-questions";
import { CodingQuestion } from "@/components/coding-exam/coding-question";
import { useState } from "preact/hooks";
import { useParams } from "react-router-dom";

export const CodingAssessmentPage = () => {
    const { assesmentId, examId } = useParams();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)

    const { data, isLoading } = useGetCodingQuestions(assesmentId!, examId!)

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


    return (
        <div className="h-screen w-full flex items-center justify-center">
            <CodingQuestion
                data={data?.codingQuestions[0] || {}}
                handleNextQuestion={handleNextQuestion}
                handlePrevQuestion={handlePrevQuestion}
                isNextDisabled={isNextDisabled}
                isPrevDisabled={isPrevDisabled}
                currentIndex={currentQuestionIndex}
                totalQuestions={data?.codingQuestions.length || 0}
            />
        </div>
    )
}
