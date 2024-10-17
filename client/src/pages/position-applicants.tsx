import { useGetApplicantsByPosition } from "@/api/applicants/use-get-applicationByPosition";
import { ApplicantsData } from "@/components/applicant/applicant-data";
import { ApplicantColumnData } from "@/components/applicant/applicant-data-columns";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";


export const JobPositionApplicants = () => {
    const { positionId } = useParams()
    const { data, isLoading } = useGetApplicantsByPosition(positionId!);
    const navigate = useNavigate();

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-6 space-y-5">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go back
            </Button>
            <div className="flex w-full justify-between">
                <h2 className="text-3xl font-bold text-blue-900">Job Applicants</h2>
            </div>
            <div>
                <ApplicantsData data={data || []} columns={ApplicantColumnData} />
            </div>
        </div>
    );
};
