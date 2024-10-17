import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetCodingQuestions } from '@/api/applicants/coding-exam/use-get-coding-questions'
import { useSubmitCodingAssessment } from '@/api/applicants/coding-exam/use-submit-coding-assesment'
import { useSaveCodingQuestion } from '@/api/applicants/coding-exam/use-save-coding-question'
import { useCompileCode } from '@/api/editor/use-compile-code'
import { apiClient } from '@/api/api-client'
import { CodingQuestion } from '@/components/coding-exam/coding-question'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { codeSnippets, languageOptions } from '@/utils/config'
import { toast } from '@/components/ui/use-toast'

export const CodingAssessmentPage = () => {
    const { assessmentId, examId } = useParams<{ assessmentId: string; examId: string }>()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [sourceCode, setSourceCode] = useState(codeSnippets['javascript'])
    const [timeLeft, setTimeLeft] = useState(0)
    const [isChanged, setIsChanged] = useState<boolean>(false)

    const navigate = useNavigate()

    const { data, isLoading, isError, error } = useGetCodingQuestions(assessmentId!, examId!)
    const submitMutation = useSubmitCodingAssessment(assessmentId!)
    const saveMutation = useSaveCodingQuestion(assessmentId!, examId!)
    const compileMutation = useCompileCode()

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (isError) {
        return (
            <div className="error">
                <h2>Error fetching questions</h2>
                <p>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
            </div>
        )
    }

    const { exam, status } = data;

    useEffect(() => {

        if (status && status === "COMPLETED") {
            toast({
                title: "Coding Assessment Already Completed",
                variant: "destructive"
            })

            return navigate("/applicant-dashboard")
        }

    }, [
        status
    ])

    useEffect(() => {
        if (exam?.duration) {
            const savedTime = localStorage.getItem('secondsLeft')
            const initialTime = savedTime ? parseInt(savedTime, 10) : exam.duration * 60
            setTimeLeft(initialTime)

            const countdown = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown)
                        localStorage.removeItem('secondsLeft')
                        handleSubmit()
                        return 0
                    }
                    const newTime = prev - 1
                    localStorage.setItem('secondsLeft', newTime.toString())
                    return newTime
                })
            }, 1000)

            return () => clearInterval(countdown)
        }
    }, [exam?.duration])

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => e.preventDefault()
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && ['c', 'u', 's'].includes(e.key)) {
                e.preventDefault()
                console.log('Blocked key press:', e.key)
            }
        }

        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])


    useEffect(() => {
        const fetchSavedAnswer = async () => {
            if (!exam?.codingQuestions[currentQuestionIndex]?.id) return

            const currentLanguage = exam?.codingQuestions[currentQuestionIndex]?.language || 'javascript';

            try {
                const { data: savedData } = await apiClient.get(`/applicant/coding-questions/${assessmentId}/exam/${examId}/save/${exam.codingQuestions[currentQuestionIndex].id}`)

                if (savedData?.code) {
                    setSourceCode(savedData?.code);
                } else {
                    setSourceCode(codeSnippets[currentLanguage]);
                }

            } catch (error) {
                console.error('Error fetching saved answer:', error)
            }
        }

        fetchSavedAnswer()
    }, [currentQuestionIndex, assessmentId, examId, exam?.codingQuestions])

    const handleSubmit = () => {
        if (submitMutation.isLoading) return
        submitMutation.mutate(examId!, {
            onSuccess: () => {
                navigate('/submitted')
            },
        })
    }

    const handleNextQuestion = () => {
        if (currentQuestionIndex < (exam?.codingQuestions?.length || 0) - 1) {
            setCurrentQuestionIndex((prev) => prev + 1)
        }
    }

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1)
        }
    }

    const handleSave = () => {
        const currentQuestion = exam?.codingQuestions[currentQuestionIndex]
        if (!currentQuestion?.id) return

        saveMutation.mutate(
            {
                answer: sourceCode,
                codingQuestionId: currentQuestion.id,
            },
            {
                onSuccess: () => {
                    setIsChanged(!isChanged)
                    toast({
                        title: 'Saved Successfully',
                    })
                },
            }
        )
    }

    const executeCode = async (language: string, code: string) => {
        const selectedLanguage = languageOptions.find((option) => option.language === language)
        if (!selectedLanguage) return

        const requestData = {
            language: selectedLanguage.language,
            version: selectedLanguage.version,
            files: [{ content: code }],
        }

        try {
            const result = await compileMutation.mutateAsync(requestData)
            if (result?.run?.output) {
                return result.run.output.split('\n')
            }
            throw new Error('No output received')
        } catch (error) {
            console.error('Error during code execution:', error)
            return ['An error occurred while executing the code. Please try again.']
        }
    }

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
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
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
    }

    const currentQuestion = exam?.codingQuestions[currentQuestionIndex] || {}

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <CodingQuestion
                data={currentQuestion}
                handleNextQuestion={handleNextQuestion}
                handlePrevQuestion={handlePrevQuestion}
                isNextDisabled={currentQuestionIndex >= (exam?.codingQuestions?.length || 0) - 1}
                isPrevDisabled={currentQuestionIndex === 0}
                currentIndex={currentQuestionIndex}
                totalQuestions={exam?.codingQuestions?.length || 0}
                timeLeft={formatTime(timeLeft)}
                assessmentId={assessmentId!}
                examId={examId!}
                handleSubmit={handleSubmit}
                sourceCode={sourceCode}
                setSourceCode={setSourceCode}
                handleSave={handleSave}
                executeCode={executeCode}
                isChanged={isChanged}
                setIsChanged={setIsChanged}
            />
        </div>
    )
}