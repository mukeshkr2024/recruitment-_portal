import { PositionExams } from "@/components/job-position/positions-exam";
import { useParams } from "react-router-dom";

export const PositionDetailPage = () => {

    const { positionId } = useParams()

    return (
        <div className="p-6">
            <div className="flex flex-col space-y-4">
                <div>
                    <h2 className="text-3xl font-bold text-blue-900">
                        Assesment Setup</h2>
                </div>

                <PositionExams positionId={positionId!} />
            </div>
        </div>
    )
}
