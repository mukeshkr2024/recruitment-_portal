import { useGetCodingQuestions } from "@/api/applicants/coding-exam/use-get-coding-questions";
import { useSubmitCodingAssessment } from "@/api/applicants/coding-exam/use-submit-coding-assesment";
import { CodingQuestion } from "@/components/coding-exam/coding-question";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useEffect, useState } from "preact/hooks";
import { useNavigate, useParams } from "react-router-dom";

export const CodingAssessmentPage = () => {
    const { assesmentId, examId } = useParams();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const { data, isLoading } = useGetCodingQuestions(assesmentId!, examId!);
    const submitMutation = useSubmitCodingAssessment(assesmentId!);
    const navigate = useNavigate()

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const handleSubmit = () => {
        submitMutation.mutate(examId!, {
            onSuccess: () => {
                navigate("/submitted");
            },
        });
    };


    // Logging important data
    console.log("Assessment ID:", assesmentId);
    console.log("Exam ID:", examId);
    console.log("Coding Questions:", data?.codingQuestions);

    const handleNextQuestion = () => {
        if (currentQuestionIndex < (data?.codingQuestions.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const isNextDisabled = currentQuestionIndex >= (data?.codingQuestions.length || 0) - 1;
    const isPrevDisabled = currentQuestionIndex === 0;

    const duration = data?.duration;

    const initialTime = duration ? duration * 60 : 0;
    const [timeLeft, setTimeLeft] = useState<number>(initialTime);

    console.log("Initial Time (seconds):", initialTime);

    useEffect(() => {
        const savedTime = localStorage.getItem('secondsLeft');
        if (savedTime) {
            setTimeLeft(parseInt(savedTime, 10));
            console.log("Restored Time Left:", savedTime);
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

    useEffect(() => {
        if (timeLeft === 0) {
            console.log("Time's up! Submitting the assessment.");
        }
    }, [timeLeft]);

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && ['c', 'u', 's'].includes(e.key)) {
                e.preventDefault();
                console.log("Blocked key press:", e.key);
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
                console.log("Page Switch Attempts:", attempts);

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

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

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
                timeLeft={formatTime(timeLeft)}
                assesmentId={assesmentId!}
                examId={examId!}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};
