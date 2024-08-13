import { useGetApplicantQuestions } from "@/api/applicants/use-get-applicantQuestions";
import { useSubmitAssessment } from "@/api/applicants/use-submit-assesment";
import { AssessmentFooter } from "@/components/assesments/assement-footer";
import { AssessmentHeader } from "@/components/assesments/assesment-header";
import { ConfirmSubmit } from "@/components/assesments/confirm-submit";
import { useEffect, useState } from "preact/hooks"; // or from "react" for React
import { useParams } from "react-router-dom";

type Question = {
    id: string,
    questionText: string,
    options: {
        id: string,
        optionText: string
    }[]
}

type SelectedOption = {
    questionId: string,
    selectedOptionId: string | null,
    isSelected: boolean
}

export const AssessmentPage = () => {

    const { assesmentId } = useParams()

    const { data, error, isLoading } = useGetApplicantQuestions(assesmentId!);
    const submitMuttation = useSubmitAssessment(assesmentId!);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !data) {
        return <div>Error fetching questions</div>;
    }

    const questions: Question[] = data;

    const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(
        questions.map(question => ({
            questionId: question.id,
            selectedOptionId: null,
            isSelected: false
        }))
    );

    const currentQuestion = questions[currentQuestionIndex];


    const handleNext = () => {
        setCurrentQuestionIndex(prev => prev + 1);
    }

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    }

    const handleOptionChange = (questionId: string, optionId: string) => {
        setSelectedOptions(prev => prev.map(option =>
            option.questionId === questionId
                ? { ...option, selectedOptionId: optionId, isSelected: true }
                : option
        ));
    }

    const handleSubmit = () => {
        console.log("formattedData");
        const formattedData = selectedOptions.map(option => ({
            questionId: option.questionId,
            selectedOptionId: option.selectedOptionId,
            isSelected: option.isSelected
        }));

        submitMuttation.mutate(formattedData);

        console.log("Formatted Data for Submission:", formattedData);
    }

    const totalQuestions = questions.length;
    const isPrevDisabled = currentQuestionIndex === 0;
    const isNextDisabled = currentQuestionIndex === totalQuestions - 1;

    const duration = 30; // Duration in minutes

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
                    handleSubmit();
                    return 0;
                }
                const newTime = prev - 1;
                localStorage.setItem('secondsLeft', newTime.toString());
                return newTime;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [initialTime, handleSubmit]);


    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex flex-col min-h-screen pt-4 pb-12">
            {
                isSubmitClicked ? (
                    <ConfirmSubmit
                        handleSubmit={handleSubmit}
                        timeRemaining={timeLeft}
                        handleIsSubmitClicked={() => setIsSubmitClicked(!isSubmitClicked)}
                    />
                ) : (
                    <>
                        <div className="flex-none">
                            <AssessmentHeader
                                timeLeft={formatTime(timeLeft)}
                            />
                        </div>
                        <div className="flex-grow mx-auto w-full max-w-7xl flex items-center">
                            <div className="">
                                <section className="text-2xl flex items-start gap-x-1.5 font-semibold">
                                    <span>{currentQuestionIndex + 1}.</span>
                                    <p>{currentQuestion.questionText}</p>
                                </section>
                                <section className="mt-4 ml-4 flex flex-col gap-y-2">
                                    {currentQuestion.options.map((option, idx) => (
                                        <div className="flex gap-x-2.5" key={option.id}>
                                            <input
                                                type="radio"
                                                id={`option-${option.id}`}
                                                name={`question-${currentQuestion.id}`}
                                                value={option.id}
                                                checked={selectedOptions[currentQuestionIndex].selectedOptionId === option.id}
                                                onChange={() => handleOptionChange(currentQuestion.id, option.id)}
                                                className="transform scale-125"
                                            />
                                            <label htmlFor={`option-${option.id}`}>
                                                {String.fromCharCode(97 + idx)}). {option.optionText}
                                            </label>
                                        </div>
                                    ))}
                                </section>
                            </div>
                        </div >

                        {/* Bottom Card */}
                        <div className="flex-none" >
                            <AssessmentFooter
                                totalQuestions={totalQuestions}
                                handleBack={handlePrev}
                                handleNext={handleNext}
                                handleIsSubmitClicked={() => setIsSubmitClicked(!isSubmitClicked)}
                                isPrevDisabled={isPrevDisabled}
                                isNextDisabled={isNextDisabled}
                                answered={selectedOptions.filter(option => option.isSelected).length}
                            />
                        </div >
                    </>
                )
            }
        </div >
    );
};
