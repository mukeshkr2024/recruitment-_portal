import { useGetExams } from "@/api/exams/use-get-exams";
import { CreateExam } from "@/components/exams/create-exam";
import { ExamColumnData } from "@/components/exams/exam-data-columns";
import { ExamsData } from "@/components/exams/exams-data";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export const Exams = () => {
    const { data, isLoading } = useGetExams();

    if (isLoading) {
        return <LoadingSpinner />
    }

    const { exams } = data;

    console.log(exams);


    return (
        <div className="px-6 bg-gray-100">
            <div className="flex w-full justify-between">
                <h2 className="text-3xl font-bold text-blue-900">
                    Exams
                </h2>
                <div>
                    <CreateExam />
                </div>
            </div>
            <div>
                <ExamsData data={exams} columns={ExamColumnData} />
            </div>
        </div>
    );
};
