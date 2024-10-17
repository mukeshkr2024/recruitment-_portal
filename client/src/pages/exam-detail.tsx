import { useGetExamQuestions } from "@/api/exams/use-get-exam-questions"
import { AssessmentDuration } from "@/components/job-position/assesment/assesment-duration"
import { AssesmentQuestions } from "@/components/job-position/assesment/assesment-questions"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

export const ExamDetail = () => {

    const { examId } = useParams()
    const { data, isLoading } = useGetExamQuestions(examId!);
    const navigate = useNavigate();

    console.log(data);


    if (isLoading) {
        return <div>Loading....</div>
    }

    return (
        <div className="px-6 space-y-5">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back
            </Button>
            <div className="flex flex-col space-y-4">
                <div>
                    <h2 className="text-3xl font-bold text-blue-900">
                        Assesment Setup</h2>
                </div>
                <AssessmentDuration
                    examId={examId!}
                    duration={data?.duration}
                />
                <AssesmentQuestions examId={examId!}
                    questions={data?.questions || []}
                    codingQuestion={data?.codingQuestions || []}
                    type={data?.examType}
                />
            </div>
        </div>
    )
}
