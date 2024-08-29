import { useGetPositions } from "@/api/positions/use-get-positions";
import { PositionColumnData } from "@/components/job-position/position-data-columns";
import { CreatePositions } from "@/components/job-position/create-postions";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { PositionData } from "@/components/job-position/position-data";

export const PositionPage = () => {
    const { data, isLoading } = useGetPositions();

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="px-6 bg-gray-100">
            <div className="flex w-full justify-between">
                <h2 className="text-3xl font-bold text-blue-900">
                    Job Positions
                </h2>

                <div>
                    <CreatePositions />
                </div>
            </div>
            <PositionData data={data} columns={PositionColumnData} />
        </div >
    );
};

