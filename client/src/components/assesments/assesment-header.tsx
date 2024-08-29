import { Card } from "../ui/card";

type Props = {
    timeLeft: string;
    title: string;
}

export const AssessmentHeader = ({ timeLeft, title }: Props) => {

    return (
        <Card className="flex max-w-7xl mx-auto items-center py-5 px-6 shadow-md justify-between">
            <h2 className="text-[#000000] font-semibold text-3xl">Internal Assessment: {title}</h2>
            <div>
                <span className="text-3xl font-semibold text-[#ED4338]">{timeLeft}</span>
            </div>
        </Card>
    );
};
