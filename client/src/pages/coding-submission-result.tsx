import { useGetApplicantCodingResult } from "@/api/applicants/coding-exam/use-get-coding-submission"
import CodeHighlighter from "@/components/code-highlighter"
import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const CodingSubmissionDetails = () => {
    const { applicantId, submissionId } = useParams()
    const { data, isLoading } = useGetApplicantCodingResult(submissionId!)

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    // const totalCorrect = data?.answers?.filter(answer => answer.isCorrect).length || 0
    // const totalQuestions = data?.answers?.length || 0

    return (
        <div className="container mx-auto p-4 space-y-5">
            <Link to={`/applicant/${applicantId}`}>
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go back
                </Button>
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle>Exam Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <h3 className="text-lg font-semibold mb-2">
                        Applicant: {data?.applicant?.firstName} {data?.applicant?.lastName}
                    </h3>
                    <p className="text-muted-foreground">Exam Name: {data?.exam?.name}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="px-6 py-4 flex">
                    <div className="flex w-full justify-between">
                        <h4 className="text-xl font-semibold">Submission Details</h4>
                        <p className="text-lg font-semibold mb-4">
                            Total Answers {data?.answer?.length} out of 10
                        </p>
                    </div>
                </CardHeader>
                <CardContent>

                    {data?.answers && data.answers.length > 0 ? (
                        data.answers.map((answer: any, idx: number) => (
                            <Card key={answer.questionId} className="mb-6">
                                <CardHeader className="px-4 py-3">
                                    <CardTitle>Question {idx + 1}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-4 py-3 space-y-6">
                                    <div>

                                        <div
                                            className="prose max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: answer?.question?.questionText,
                                            }}
                                        />
                                        {answer?.question?.haveQuestionCode && (
                                            <div>
                                                <CodeHighlighter
                                                    code={answer?.question?.questionCode}
                                                    language={answer?.question?.language}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-2">Submitted Answer:</h4>
                                        <CodeHighlighter
                                            code={answer?.submittedAnswer}
                                            language={answer?.question?.language}
                                        />
                                    </div>
                                    {/* <div className={`text-sm font-semibold ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                        {answer.isCorrect ? 'Correct' : 'Incorrect'}
                                    </div> */}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No answers found yet.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}