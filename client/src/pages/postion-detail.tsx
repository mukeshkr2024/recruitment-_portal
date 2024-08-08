import { AssesmentQuestions } from "@/components/job-position/assesment/assesment-questions"
import { useParams } from "react-router-dom"

export const PositionDetailPage = () => {

    const { positionId } = useParams()

    return (
        <div className="p-6">
            <div>
                <div>
                    <h2>Assesment Questions</h2>
                </div>
                <AssesmentQuestions positionId={positionId!} />
            </div>
        </div>
    )
}
