import { useState } from "preact/hooks"; // or from "react" for React
import { useGetApplicantQuestions } from "@/api/applicants/use-get-applicantQuestions";
import { useSubmitAssessment } from "@/api/applicants/use-submit-assesment";
import { AssessmentFooter } from "@/components/assesments/assement-footer";
import { AssessmentHeader } from "@/components/assesments/assesment-header";
import { ConfirmSubmit } from "@/components/assesments/confirm-submit";

type Question = {
    id: string,
    questionText: string,
    options: {
        id: string,
        optionText: string
    }[]
}

type SelectedOption = {
    questionId: string,
    selectedOptionId: string | null,
    isSelected: boolean
}

export const AssessmentPage = () => {
    const { data, error, isLoading } = useGetApplicantQuestions();
    const submitMuttation = useSubmitAssessment();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !data) {
        return <div>Error fetching questions</div>;
    }

    const questions: Question[] = data;

    const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>(
        questions.map(question => ({
            questionId: question.id,
            selectedOptionId: null,
            isSelected: false
        }))
    );

    const currentQuestion = questions[currentQuestionIndex];

    const handleNext = () => {
        setCurrentQuestionIndex(prev => prev + 1);
    }

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    }

    const handleOptionChange = (questionId: string, optionId: string) => {
        setSelectedOptions(prev => prev.map(option =>
            option.questionId === questionId
                ? { ...option, selectedOptionId: optionId, isSelected: true }
                : option
        ));
    }

    const handleSubmit = () => {
        console.log("formattedData");
        const formattedData = selectedOptions.map(option => ({
            questionId: option.questionId,
            selectedOptionId: option.selectedOptionId,
            isSelected: option.isSelected
        }));

        submitMuttation.mutate(formattedData);

        console.log("Formatted Data for Submission:", formattedData);
    }

    const totalQuestions = questions.length;
    const isPrevDisabled = currentQuestionIndex === 0;
    const isNextDisabled = currentQuestionIndex === totalQuestions - 1;

    const duration = 1; // Duration in minutes

    return (
        <>
            {
                isSubmitClicked ? (
                    <ConfirmSubmit
                        handleSubmit={handleSubmit}
                        handleIsSubmitClicked={() => setIsSubmitClicked(!isSubmitClicked)}
                    />
                ) : (
                    <div className="py-4">
                        <AssessmentHeader
                            duration={duration}
                            onTimeUp={
                                handleSubmit
                            }
                        />
                        <section className="max-w-6xl mx-auto pt-40">
                            <div className="text-2xl flex items-center gap-x-1.5 font-semibold">
                                <span>{currentQuestionIndex + 1}</span>
                                <p>{currentQuestion.questionText}</p>
                            </div>
                            <div className="mt-4 ml-4 flex flex-col gap-y-2">
                                {
                                    currentQuestion.options.map((option, idx) => (
                                        <div className="flex gap-x-2.5" key={option.id}>
                                            <input
                                                type="radio"
                                                id={`option-${option.id}`}
                                                name={`question-${currentQuestion.id}`}
                                                value={option.id}
                                                checked={selectedOptions[currentQuestionIndex].selectedOptionId === option.id}
                                                onChange={() => handleOptionChange(currentQuestion.id, option.id)}
                                                className="transform scale-125"
                                            />
                                            <label htmlFor={`option-${option.id}`}>{String.fromCharCode(97 + idx)}). {option.optionText}</label>
                                        </div>
                                    ))
                                }
                            </div>
                        </section>
                        <AssessmentFooter
                            totalQuestions={totalQuestions}
                            handleBack={handlePrev}
                            handleNext={handleNext}
                            handleIsSubmitClicked={() => setIsSubmitClicked(!isSubmitClicked)}
                            isPrevDisabled={isPrevDisabled}
                            isNextDisabled={isNextDisabled}
                            answered={selectedOptions.filter(option => option.isSelected).length}
                        />
                    </div>
                )
            }
        </>
    );
};
