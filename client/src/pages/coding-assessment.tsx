import { useGetCodingQuestions } from "@/api/applicants/coding-exam/use-get-coding-questions";
import { CodingQuestion } from "@/components/coding-exam/coding-question";
import { useParams } from "react-router-dom";

export const CodingAssessmentPage = () => {
    const { assesmentId, examId } = useParams();

    const { data, isLoading } = useGetCodingQuestions(assesmentId!, examId!)

    console.log(data);


    console.log(assesmentId, examId);

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <CodingQuestion
                data={data?.codingQuestions[0] || {}}
            />
        </div>
    )
}
