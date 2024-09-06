import { Card } from "../ui/card";

type Props = {
    timeLeft: string;
    title: string;
};

export const AssessmentHeader = ({ timeLeft, title }: Props) => {
    return (
        <Card className="flex flex-wrap max-w-7xl md:mx-auto items-center py-5 px-6 shadow-md justify-between gap-y-4 text-center sm:text-left mx-4">
            <h2 className="text-[#000000] font-semibold text-2xl sm:text-3xl flex-1">
                Internal Assessment: {title}
            </h2>
            <div className="w-full sm:w-auto">
                <span className="text-2xl sm:text-3xl font-semibold text-[#ED4338]">
                    {timeLeft}
                </span>
            </div>
        </Card>
    );
};
