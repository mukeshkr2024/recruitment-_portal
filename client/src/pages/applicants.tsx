import { useGetApplicants } from "@/api/applicants/use-get-applicants";
import { useGetApplicantsDownloadData } from "@/api/applicants/use-get-applicants-downloadData";
import { useGetPositions } from "@/api/positions/use-get-positions";
import { ApplicantsData } from "@/components/applicant/applicant-data";
import { ApplicantColumnData } from "@/components/applicant/applicant-data-columns";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "preact/hooks";
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';

const statusOptions = [
    { id: "all-statuses", name: "All Statuses" },
    { id: "rejected", name: "Rejected" },
    { id: "inprogress", name: "InProgress" },
    { id: "selected", name: "Selected" },
    { id: "pending", name: "Pending" },
];

export const ApplicantsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedJobOption, setSelectedJobOption] = useState<string>("all-positions");
    const [selectedStatusOption, setSelectedStatusOption] = useState<string>("all-statuses");
    const { data, isLoading } = useGetApplicants(selectedJobOption, selectedStatusOption);
    const { data: positions } = useGetPositions();
    const [isClearDisabled, setIsClearDisabled] = useState<boolean>(true);

    const { refetch, data: csvBlob } = useGetApplicantsDownloadData(selectedJobOption, selectedStatusOption);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const jobOption = query.get('job') || "all-positions";
        const statusOption = query.get('status') || "all-statuses";
        setSelectedJobOption(jobOption);
        setSelectedStatusOption(statusOption);

        setIsClearDisabled(jobOption === "all-positions" && statusOption === "all-statuses");
    }, [location.search]);

    const handleJobSelectChange = (value: string) => {
        setSelectedJobOption(value);
        updateQueryParams(value, selectedStatusOption);
    };

    const handleStatusSelectChange = (value: string) => {
        setSelectedStatusOption(value);
        updateQueryParams(selectedJobOption, value);
    };

    const updateQueryParams = (job: string, status: string) => {
        const params = new URLSearchParams();
        if (job !== "all-positions") {
            params.set('job', job);
        }
        if (status !== "all-statuses") {
            params.set('status', status);
        }
        navigate(`/applicants?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSelectedJobOption("all-positions");
        setSelectedStatusOption("all-statuses");
        setIsClearDisabled(true);
        navigate(`/applicants`);
    };

    const handleDownloadXLSX = async () => {
        await refetch();

        if (csvBlob) {
            const formattedData: any[] = [];

            csvBlob.forEach((item: any, idx: number) => {
                const generalInfo = {
                    Id: idx + 1,
                    FullName: item.firstName + " " + item.lastName,
                    Email: item.email,
                    Status: item.status,
                    Phone: item.phone,
                    AppliedAt: item.createdAt,
                    PositionName: 'N/A',
                    ExamName: 'N/A',
                    ExamStatus: 'N/A',
                    Score: 'N/A',
                    TotalScore: 'N/A'
                };

                formattedData.push(generalInfo);

                if (item.examResults.length === 0) {
                    formattedData.push({
                        Id: '',
                        FullName: '',
                        Email: '',
                        Status: '',
                        Phone: '',
                        AppliedAt: '',
                        PositionName: 'N/A',
                        ExamName: 'N/A',
                        ExamStatus: 'N/A',
                        Score: 'N/A',
                        TotalScore: 'N/A'
                    });
                }

                item.examResults.forEach((examResult: any) => {
                    const examInfo = {
                        Id: '',
                        FullName: '',
                        Email: '',
                        Status: '',
                        Phone: '',
                        AppliedAt: '',
                        PositionName: examResult.position?.positionName || 'N/A',
                        ExamName: examResult.exam?.name || 'N/A',
                        ExamStatus: examResult.examStatus || 'N/A',
                        Score: examResult.score || 'N/A',
                        TotalScore: examResult.totalScore || 'N/A'
                    };

                    // Add the exam result row to the formatted data
                    formattedData.push(examInfo);
                });
            });

            // Create the worksheet and workbook
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants');

            // Generate the Excel file and initiate download
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'applicants.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };




    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="px-6 space-y-4 -mt-2">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-blue-900">Job Applicants</h2>
                <p className="text-xl font-semibold">Total: {data?.length} Applicants</p>
            </div>
            <div className="flex gap-6 items-center">
                <div className="flex-1">
                    <Label htmlFor="job-select">Job Position</Label>
                    <Select
                        value={selectedJobOption}
                        onValueChange={handleJobSelectChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select job" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-positions">All Positions</SelectItem>
                            {positions && positions.map((pos: any) => (
                                <SelectItem key={pos.id} value={pos.id}>
                                    {pos.positionName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1">
                    <Label htmlFor="status-select">Status</Label>
                    <Select
                        value={selectedStatusOption}
                        onValueChange={handleStatusSelectChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map(status => (
                                <SelectItem key={status.id} value={status.id}>
                                    {status.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    onClick={handleClearFilters}
                    className="ml-auto mt-5"
                    disabled={isClearDisabled} // Disable button when no filters are applied
                >
                    Clear Filters
                </Button>

                <Button
                    onClick={handleDownloadXLSX}
                    className="ml-4 mt-5"
                >
                    Download CSV
                </Button>
            </div>
            <div>
                <ApplicantsData data={data || []} columns={ApplicantColumnData} />
            </div>
        </div>
    );
};
