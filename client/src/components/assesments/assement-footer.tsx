import { Button } from "../ui/button";

type Props = {
    totalQuestions: number;
    handleNext: () => void;
    handleBack: () => void;
    handleIsSubmitClicked: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
    answered: number;
};

export const AssessmentFooter = ({ totalQuestions, handleBack, isPrevDisabled, answered, isNextDisabled, handleNext, handleIsSubmitClicked }: Props) => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full flex flex-wrap items-center justify-between gap-y-4">
                <p className="text-lg text-[#000000] font-semibold flex-1">Answered: {answered}/{totalQuestions}</p>
                <div className="flex gap-x-4 gap-y-2 items-center flex-wrap justify-center sm:flex-nowrap">
                    <Button className="bg-[#E4E4E4] text-[#595959] hover:bg-[#E4E4E4] px-6 py-2 font-bold" onClick={handleBack} disabled={isPrevDisabled}>
                        Previous
                    </Button>
                    <Button className="bg-[#5138ED] text-[#FFFFFF] hover:bg-[#5138ED] px-8 py-2 font-bold" onClick={handleNext} disabled={isNextDisabled}>
                        Next
                    </Button>
                    <Button className="bg-[#FC4C4C] text-[#FFFFFF] hover:bg-[#FC4C4C] px-8 py-2 font-bold" onClick={handleIsSubmitClicked}>
                        Submit
                    </Button>
                </div>
            </div>
        </section>
    );
};
