import { useGetExams } from "@/api/exams/use-get-exams";
import { useAddPositonExam } from "@/api/position-exam/use-addPositonExam";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";


import { PlusCircle } from "lucide-react";
import { useState } from "preact/hooks";
import { z } from "zod";

export const questionFormSchema = z.object({
    questionText: z.string().min(10, "Question Title is required"),
    answer1: z.object({
        text: z.string().min(4, "Option 1 is required"),
        isCorrect: z.boolean(),
    }),
    answer2: z.object({
        text: z.string().min(4, "Option 2 is required"),
        isCorrect: z.boolean(),
    }),
    answer3: z.object({
        text: z.string().min(4, "Option 3 is required"),
        isCorrect: z.boolean(),
    }),
    answer4: z.object({
        text: z.string().min(4, "Option 4 is required"),
        isCorrect: z.boolean(),
    }),
}).refine(
    (data) =>
        data.answer1.isCorrect ||
        data.answer2.isCorrect ||
        data.answer3.isCorrect ||
        data.answer4.isCorrect,
    {
        message: "At least one option must be marked as correct",
        path: ["answer1", "answer2", "answer3", "answer4"],
    }
);

export const CreateJobPositionExam = ({ positionId }: { positionId: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data } = useGetExams();
    const [selectedExam, setSelectedExam] = useState<string | undefined>(undefined)
    const { mutate, isLoading: isAdding } = useAddPositonExam(positionId)

    const exams = data?.exams

    const handleValueChange = (value: string) => {
        setSelectedExam(value); // Update the state with the selected value
    };


    const onSumit = () => {

        if (!selectedExam) return;

        mutate({ examId: selectedExam },
            {
                onSuccess: () => {
                    setIsOpen(false)
                }
            }
        )
    }


    return (
        <Dialog
            open={isOpen}
            onOpenChange={() => setIsOpen((prevValue) => !prevValue)}
        >
            <DialogTrigger asChild>
                <div className="flex items-center gap-2 p-2">
                    <Button className="flex gap-x-2">
                        <PlusCircle />
                        Add Exam
                    </Button>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <DialogHeader>
                    <DialogTitle>Add Exam</DialogTitle>
                </DialogHeader>
                <div>

                    <div>
                        <Select onValueChange={handleValueChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select an Exam" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        exams ? exams?.map((exam: any) => (
                                            <SelectItem key={exam.id} value={exam.id}>{exam.name}</SelectItem>
                                        )) : <SelectItem key="" value=""> No Exams</SelectItem>
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>


                    </div>

                    <div className="mb-4 mt-4 flex gap-x-4">
                        <Button
                            variant="outline"
                            className="w-28"
                            onClick={() => setIsOpen((prevValue) => !prevValue)}

                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={!selectedExam || isAdding}
                            className="w-28"
                            type="submit"
                            onClick={onSumit}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </DialogContent >
        </Dialog >
    );
};
