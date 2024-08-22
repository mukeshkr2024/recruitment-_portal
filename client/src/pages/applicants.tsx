import { useGetApplicants } from "@/api/applicants/use-get-applicants";
import { ApplicantsData } from "@/components/applicant/applicant-data";
import { ApplicantColumnData } from "@/components/applicant/applicant-data-columns";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const ApplicantsPage = () => {
    const { data, isLoading } = useGetApplicants();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="p-6">
            <div className="flex w-full justify-between">
                <h2 className="text-3xl font-bold text-blue-900">Job Applicants</h2>
                <p className="text-xl font-semibold">Total: {data?.length} Applicants</p>
            </div>
            <div>
                <ApplicantsData data={data || []} columns={ApplicantColumnData} />
            </div>
        </div>
    );
};
