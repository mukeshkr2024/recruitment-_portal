import { getInstructions } from "@/api/use-get-intructions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useParams } from "react-router-dom";

export const InstructionPage = () => {
    const { assesmentId } = useParams();
    const { data, isLoading } = getInstructions(assesmentId!);
    const navigate = useNavigate();

    if (isLoading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    const handleClick = () => {
        navigate(`/assesment/${assesmentId}`);
    };

    return (
        <div className="flex flex-col min-h-screen p-4 md:p-6 lg:p-8">
            {/* Card 1 */}
            <Card className="flex flex-col max-w-4xl lg:max-w-6xl mx-auto py-4 px-4 md:py-5 md:px-6 shadow-md justify-center w-full">
                <h2 className="sm:text-2xl text-xl text-center md:text-3xl font-semibold text-gray-900">
                    Internal Assessment: {data?.assessment_name}
                </h2>
            </Card>

            {/* Card 2 */}
            <section className="max-w-4xl lg:max-w-5xl mx-auto mt-4 md:mt-6 flex-grow">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900">
                    Assessment Instructions
                </h3>
                <ul className="mt-3 text-base md:text-lg space-y-2">
                    <li>This assessment is designed to evaluate your knowledge and practical skills in UI/UX design through a series of multiple-choice questions (MCQs).</li>
                    <li>The assessment consists of {data?.total_questions} questions, and you will have a total of {data?.time} minutes to complete it. Please make sure to manage your time effectively.</li>
                    <li>Each question has four possible answers. Select the option that you believe is most accurate.</li>
                    <li>Once you have answered all the questions, click on the "Submit" button to finalize your responses. Please note that you will not be able to return to the assessment after submission.</li>
                    <li>Ensure you have a stable internet connection throughout the duration of the assessment. A sudden loss of connection may affect your progress.</li>
                    <li>Your assessment results will be emailed to you within 24 to 48 hours. Further instructions on the next steps will also be included.</li>
                    <li>Please make sure you are in a quiet environment, free from distractions, to maximize your focus during the assessment.</li>
                    <li>This assessment is confidential and intended for your personal use only. Sharing questions or answers with others is strictly prohibited and may lead to disqualification.</li>
                </ul>
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 mt-5">
                    Additional Guidelines
                </h4>
                <ol className="mt-2 list-decimal list-inside space-y-2 text-base md:text-lg">
                    <li>Read each question carefully before selecting your answer. Rushing through may lead to mistakes.</li>
                    <li>Do not refresh or close the browser window during the assessment, as this could cause you to lose progress or be locked out of the exam.</li>
                    <li>Keep track of time. A timer will be displayed at the top of the screen to help you monitor the remaining time.</li>
                </ol>
            </section>

            {/* Card 3 */}
            <div className="max-w-4xl lg:max-w-5xl  mx-auto mt-6 flex-none">
                <div className="flex flex-col md:flex-row mt-5 gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Checkbox className="w-4 h-4" />
                        <p className="text-base md:text-lg pr-4">I have read and understood the instructions and guidelines for this assessment.</p>
                    </div>
                    <Button
                        disabled={data.status === "COMPLETED"}
                        className="bg-blue-600 text-white px-6 py-2 md:px-10 md:py-3 hover:bg-blue-700"
                        onClick={handleClick}
                    >
                        Start Assessment
                    </Button>
                </div>
            </div>
        </div>
    );
};
