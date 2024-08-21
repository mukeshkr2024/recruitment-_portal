import { useGetApplicantQuestions } from "@/api/applicants/use-get-applicantQuestions";
import { useSubmitAssessment } from "@/api/applicants/use-submit-assesment";
import { AssessmentFooter } from "@/components/assesments/assement-footer";
import { AssessmentHeader } from "@/components/assesments/assesment-header";
import { ConfirmSubmit } from "@/components/assesments/confirm-submit";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useEffect, useState } from "preact/hooks";
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

    const { assesmentId, examId } = useParams();

    const { data, error, isLoading } = useGetApplicantQuestions(assesmentId!, examId!);
    const submitMuttation = useSubmitAssessment(assesmentId!, examId!);

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (error || !data) {
        return <div>Error fetching questions</div>;
    }

    const questions: Question[] = data?.questions;

    const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
        const savedIndex = localStorage.getItem(`currentQuestionIndex-${assesmentId}`);
        return savedIndex ? parseInt(savedIndex, 10) : 0;
    });
    const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(() => {
        const savedOptions = localStorage.getItem(`selectedOptions-${assesmentId}`);
        if (savedOptions) {
            return JSON.parse(savedOptions);
        }
        return questions.map(question => ({
            questionId: question.id,
            selectedOptionId: null,
            isSelected: false
        }));
    });

    useEffect(() => {
        localStorage.setItem(`selectedOptions-${assesmentId}`, JSON.stringify(selectedOptions));
    }, [selectedOptions, assesmentId]);

    useEffect(() => {
        localStorage.setItem(`currentQuestionIndex-${assesmentId}`, currentQuestionIndex.toString());
    }, [currentQuestionIndex, assesmentId]);

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
                ? {
                    ...option,
                    // Toggle selection
                    selectedOptionId: option.selectedOptionId === optionId ? null : optionId,
                    isSelected: option.selectedOptionId === optionId ? false : true
                }
                : option
        ));
    }

    const handleSubmit = () => {
        const formattedData = selectedOptions.map(option => ({
            questionId: option.questionId,
            selectedOptionId: option.selectedOptionId,
            isSelected: option.isSelected
        }));

        submitMuttation.mutate(formattedData);

        localStorage.removeItem(`selectedOptions-${assesmentId}`);
        localStorage.removeItem(`currentQuestionIndex-${assesmentId}`);
        localStorage.removeItem('secondsLeft');
        localStorage.removeItem('pageSwitchAttempts');
    }

    const totalQuestions = questions.length;
    const isPrevDisabled = currentQuestionIndex === 0;
    const isNextDisabled = currentQuestionIndex === totalQuestions - 1;

    const duration = data?.total_time; // Duration in minutes

    const initialTime = duration * 60;

    const [timeLeft, setTimeLeft] = useState<number>(initialTime);

    useEffect(() => {
        const savedTime = localStorage.getItem('secondsLeft');
        if (savedTime) {
            setTimeLeft(parseInt(savedTime, 10));
        } else {
            localStorage.setItem('secondsLeft', initialTime.toString());
        }

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

    // Security check
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's')) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Prevent Tab Switching and Track Page Switch Attempts
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // Chrome requires returnValue to be set
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                let attempts = parseInt(localStorage.getItem('pageSwitchAttempts') || '0', 10);
                attempts += 1;
                localStorage.setItem('pageSwitchAttempts', attempts.toString());

                if (attempts >= 3) {
                    handleSubmit();
                    localStorage.removeItem('pageSwitchAttempts');
                } else {
                    alert('You cannot leave this page until the assessment is completed. If you attempt to exit, your assessment will be submitted automatically.');
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [handleSubmit]);

    // Time-Based Penalties
    // useEffect(() => {
    //     let inactivityTimer: NodeJS.Timeout;

    //     const resetTimer = () => {
    //         clearTimeout(inactivityTimer);
    //         inactivityTimer = setTimeout(() => {
    //             setTimeLeft(prev => Math.max(prev - 60, 0)); // Penalize by reducing 1 minute
    //         }, 30000); // 30 seconds of inactivity
    //     };

    //     window.addEventListener('mousemove', resetTimer);
    //     window.addEventListener('keydown', resetTimer);

    //     resetTimer();

    //     return () => {
    //         clearTimeout(inactivityTimer);
    //         window.removeEventListener('mousemove', resetTimer);
    //         window.removeEventListener('keydown', resetTimer);
    //     };
    // }, []);

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
                                title={data?.exam_name}
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
                                                type="checkbox"  // Changed from "radio" to "checkbox"
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
