import { Button } from "../ui/button";

type Props = {
    totalQuestions: number;
    handleNext: () => void;
    handleBack: () => void;
    handleIsSubmitClicked: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
    answered: number
}

export const AssessmentFooter = ({ totalQuestions, handleBack, isPrevDisabled, answered, isNextDisabled, handleNext, handleIsSubmitClicked }: Props) => {
    return (
        <section className="max-w-7xl mx-auto">
            <div className="w-full flex justify-between">
                <p className="text-lg text-[#000000] font-semibold">Answered: {answered}/{totalQuestions}</p>
                <div className="flex gap-x-4 items-center">
                    <Button className="bg-[#E4E4E4] text-[#595959] hover:bg-[#E4E4E4] px-10 font-bold" onClick={handleBack} disabled={isPrevDisabled}> Previous</Button>
                    <Button className="bg-[#5138ED] text-[#FFFFFF] hover:bg-[#5138ED] px-14 font-bold" onClick={handleNext} disabled={isNextDisabled}>Next</Button>
                    <Button className="bg-[#FC4C4C] text-[#FFFFFF] hover:bg-[#FC4C4C] px-14 font-bold" onClick={handleIsSubmitClicked}>Submit</Button>
                </div>
            </div>
        </section>
    )
}
