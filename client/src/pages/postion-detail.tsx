import { useGetQuestions } from "@/api/questions/use-get-questions"
import { AssessmentDuration } from "@/components/job-position/assesment/assesment-duration"
import { AssesmentQuestions } from "@/components/job-position/assesment/assesment-questions"
import { useParams } from "react-router-dom"

export const PositionDetailPage = () => {

    const { positionId } = useParams()
    const { data, isLoading } = useGetQuestions(positionId!);

    if (isLoading) {
        return <div>Loadig....</div>
    }

    return (
        <div className="p-6">
            <div className="flex flex-col space-y-4">
                <div>
                    <h2 className="text-3xl font-bold text-blue-900">
                        Assesment Setup</h2>
                </div>
                <AssessmentDuration
                    positionId={positionId!}
                    duration={data?.duration}
                />
                <AssesmentQuestions positionId={positionId!} questions={data?.questions} />
            </div>
        </div>
    )
}
