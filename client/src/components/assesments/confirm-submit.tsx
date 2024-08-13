import { Button } from "../ui/button"

type Props = {
    handleSubmit: () => void;
    handleIsSubmitClicked: () => void;
    timeRemaining: number
}

export const ConfirmSubmit = ({ handleSubmit, handleIsSubmitClicked, timeRemaining }: Props) => {

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minutes`;
    };
    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="max-w-md flex items-center justify-center flex-col gap-y-4">
                <img src="/question.png" alt="" />
                <div className="text-center flex flex-col gap-y-3">
                    <h3 className="font-semibold text-xl">Do you want to end your test??</h3>
                    <p className="text-[#949494] font-normal">You still have {formatTime(timeRemaining)} remaining</p>
                    <p className="text-[#949494] font-normal">If you want to check your answer again <br /> press cancel button.</p>
                </div>
                <div className="flex gap-x-3">
                    <Button variant="ghost" className="px-12 text-[#FC4C4C] hover:text-[#FC4C4C]" onClick={handleIsSubmitClicked}>Cancel</Button>
                    <Button variant="destructive" className="px-12" onClick={handleSubmit}>Submit</Button>
                </div>
            </div>
        </div>
    )
}
