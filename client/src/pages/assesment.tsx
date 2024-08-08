import { AssessmentFooter } from "@/components/assesments/assement-footer";
import { AssessmentHeader } from "@/components/assesments/assesment-header"
import { ConfirmSubmit } from "@/components/assesments/confirm-submit";
import { useState } from "preact/hooks";
import { useNavigate } from "react-router-dom";

const questions = [
    {
        id: 1,
        question: "What is the primary goal of user experience (UX) design?",
        options: [
            { id: 1, text: "To make the website visually appealing" },
            { id: 2, text: "To improve the usability and overall experience of the user" },
            { id: 3, text: "To increase website traffic" },
            { id: 4, text: "To optimize website performance" }
        ],
    },
    {
        id: 2,
        question: "What does 'responsive design' refer to?",
        options: [
            { id: 1, text: "Design that adjusts based on user feedback" },
            { id: 2, text: "Design that adapts to different screen sizes and devices" },
            { id: 3, text: "Design that only works on mobile devices" },
            { id: 4, text: "Design that focuses on color schemes" }
        ],
    },
    {
        id: 3,
        question: "Which of the following is a common usability principle in UX design?",
        options: [
            { id: 1, text: "Consistency" },
            { id: 2, text: "Overloading users with options" },
            { id: 3, text: "Using complex jargon" },
            { id: 4, text: "Ignoring user feedback" }
        ],
    },
    {
        id: 4,
        question: "What is 'user persona' in UX design?",
        options: [
            { id: 1, text: "A tool for tracking user activity" },
            { id: 2, text: "A fictional character representing a segment of users" },
            { id: 3, text: "A visual design element" },
            { id: 4, text: "A type of user interface" }
        ],
    },
    {
        id: 5,
        question: "Which technique is used to gather feedback from users about a design?",
        options: [
            { id: 1, text: "A/B testing" },
            { id: 2, text: "Heat maps" },
            { id: 3, text: "Usability testing" },
            { id: 4, text: "SEO analysis" }
        ],
    },
    {
        id: 6,
        question: "What is a wireframe in UX design?",
        options: [
            { id: 1, text: "A detailed visual representation of the final product" },
            { id: 2, text: "A low-fidelity layout used to plan the structure and functionality of a design" },
            { id: 3, text: "A type of user interface" },
            { id: 4, text: "A tool for writing code" }
        ],
    },
    {
        id: 7,
        question: "Which of the following best describes 'affordance' in design?",
        options: [
            { id: 1, text: "The visual clues that suggest how a user should interact with an element" },
            { id: 2, text: "The cost associated with designing a product" },
            { id: 3, text: "The process of making a design accessible" },
            { id: 4, text: "The amount of time users spend on a website" }
        ],
    },
    {
        id: 8,
        question: "What is the purpose of a 'user journey map'?",
        options: [
            { id: 1, text: "To create a visual representation of the user's interaction with a product" },
            { id: 2, text: "To track user activity on a website" },
            { id: 3, text: "To design user interface elements" },
            { id: 4, text: "To define the technical specifications of a project" }
        ],
    },
    {
        id: 9,
        question: "What is 'microinteraction' in UX design?",
        options: [
            { id: 1, text: "A small design element that communicates information or provides feedback" },
            { id: 2, text: "A feature that handles large data processing" },
            { id: 3, text: "A type of visual design" },
            { id: 4, text: "A tool for user research" }
        ],
    },
    {
        id: 10,
        question: "Which of the following is a key aspect of accessibility in UX design?",
        options: [
            { id: 1, text: "Ensuring the design works only on desktop computers" },
            { id: 2, text: "Providing alternative text for images" },
            { id: 3, text: "Using complex color schemes" },
            { id: 4, text: "Minimizing the use of text" }
        ],
    },
    {
        id: 11,
        question: "What does 'iterative design' involve?",
        options: [
            { id: 1, text: "Creating a design in a single step" },
            { id: 2, text: "Repeatedly refining and improving the design based on feedback" },
            { id: 3, text: "Ignoring user feedback" },
            { id: 4, text: "Designing without a plan" }
        ],
    }
];

export const AssessmentPage = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isSubmitClicked, setisSubmitClicked] = useState(false)

    const navigate = useNavigate()

    const handleOptionChange = (event: any) => {
        const newOptionId = parseInt(event.target.value, 10);

        const updatedAnswers = [...answers];
        updatedAnswers[currentQuestionIndex] = newOptionId;
        setAnswers(updatedAnswers);

        setSelectedOptionId(newOptionId);
    };

    const handleNext = () => {
        if (selectedOptionId !== null) {
            const updatedAnswers = [...answers];
            updatedAnswers[currentQuestionIndex] = selectedOptionId;
            setAnswers(updatedAnswers);
        }
        setSelectedOptionId(null);
        setCurrentQuestionIndex(prevIndex => Math.min(prevIndex + 1, questions.length - 1));
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setSelectedOptionId(answers[currentQuestionIndex - 1] || null);
            setCurrentQuestionIndex(prevIndex => prevIndex - 1);
        }
    };


    const handleIsSubmitClicked = () => {
        setisSubmitClicked(!isSubmitClicked)
    }

    const handleSubmit = () => {
        if (selectedOptionId !== null) {
            const updatedAnswers = [...answers];
            updatedAnswers[currentQuestionIndex] = selectedOptionId;
            setAnswers(updatedAnswers);
        }
        setSubmitted(true);

        const result = questions.map((question, index) => ({
            questionId: question.id,
            selectedOptionId: answers[index] || null
        }));

        navigate("/submitted")
    };

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    const isPrevDisabled = currentQuestionIndex === 0;
    const isNextDisabled = currentQuestionIndex === totalQuestions - 1;

    const answered = answers.filter(answer => answer !== null).length;

    return (
        <>

            {
                isSubmitClicked ? <ConfirmSubmit
                    handleSubmit={handleSubmit}
                    handleIsSubmitClicked={handleIsSubmitClicked}
                /> : (
                    <div className="py-4">
                        <AssessmentHeader />
                        <section className="max-w-6xl mx-auto pt-40">
                            <div className="text-2xl flex items-center gap-x-1.5 font-semibold">
                                <span>{currentQuestionIndex + 1}.</span>
                                <p>{currentQuestion.question}</p>
                            </div>
                            <div className="mt-4 ml-4 flex flex-col gap-y-2">
                                {currentQuestion.options.map(option => (
                                    <div key={option.id} className="flex gap-x-2.5">
                                        <input
                                            type="radio"
                                            value={option.id}
                                            id={`option-${option.id}`}
                                            name="options"
                                            checked={selectedOptionId === option.id}
                                            onChange={handleOptionChange}
                                            disabled={submitted}
                                            className="transform scale-125"
                                        />
                                        <label htmlFor={`option-${option.id}`} className="text-lg text-[#404040]">
                                            {String.fromCharCode(97 + option.id - 1)}). {option.text}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <AssessmentFooter
                            totalQuestions={totalQuestions}
                            handleBack={handlePrevious}
                            handleNext={handleNext}
                            handleIsSubmitClicked={handleIsSubmitClicked}
                            isPrevDisabled={isPrevDisabled}
                            isNextDisabled={isNextDisabled}
                            answered={answered}
                        />
                    </div>
                )
            }
        </>

    );
};