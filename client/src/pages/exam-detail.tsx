import { useGetExamQuestions } from "@/api/exams/use-get-exam-questions"
import { AssessmentDuration } from "@/components/job-position/assesment/assesment-duration"
import { AssesmentQuestions } from "@/components/job-position/assesment/assesment-questions"
import { useParams } from "react-router-dom"

export const ExamDetail = () => {

    const { examId } = useParams()
    const { data, isLoading } = useGetExamQuestions(examId!);

    if (isLoading) {
        return <div>Loadig....</div>
    }

    console.log(data);


    return (
        <div className="p-6">
            <div className="flex flex-col space-y-4">
                <div>
                    <h2 className="text-3xl font-bold text-blue-900">
                        Assesment Setup</h2>
                </div>
                <AssessmentDuration
                    examId={examId!}
                    duration={data?.duration}
                />
                <AssesmentQuestions examId={examId!} questions={data?.questions}
                    type={data?.examType}
                />
            </div>
        </div>
    )
}
