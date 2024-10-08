import { useGetApplicantsByPosition } from "@/api/applicants/use-get-applicationByPosition";
import { ApplicantsData } from "@/components/applicant/applicant-data";
import { ApplicantColumnData } from "@/components/applicant/applicant-data-columns";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useParams } from "react-router-dom";


export const JobPositionApplicants = () => {
    const { positionId } = useParams()
    const { data, isLoading } = useGetApplicantsByPosition(positionId!);

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-6">
            <div className="flex w-full justify-between">
                <h2 className="text-3xl font-bold text-blue-900">Job Applicants</h2>
            </div>
            <div>
                <ApplicantsData data={data || []} columns={ApplicantColumnData} />
            </div>
        </div>
    );
};
