import { useSaveCodingQuestion } from "@/api/applicants/coding-exam/use-save-coding-question"
import { useCompileCode } from "@/api/editor/use-compile-code"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { codeSnippets, languageOptions } from "@/utils/config"
import MonacoEditor from "@monaco-editor/react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Code2, Loader, Play, Save, Send, Terminal, TriangleAlertIcon } from "lucide-react"
import * as React from "react"
import { useEffect } from "react"
import CodeHighlighter from "../code-highlighter"
import { toast } from "../ui/use-toast"
import ConfirmSubmitDialog from "./confirm-submit-dialog"

type LanguageOption = {
    language: string
    version: string
    aliases: string[]
    runtime?: string
}

type CodingQuestionProps = {
    data: any;
    handleNextQuestion: () => void;
    handlePrevQuestion: () => void;
    isNextDisabled: boolean;
    isPrevDisabled: boolean;
    currentIndex: number;
    totalQuestions: number;
    timeLeft: string;
    assesmentId: string
    examId: string;
    handleSubmit: () => void;
}

export const CodingQuestion = ({ data, handleNextQuestion, handlePrevQuestion, isNextDisabled, isPrevDisabled, currentIndex, totalQuestions, timeLeft, assesmentId, examId, handleSubmit }: CodingQuestionProps) => {
    const [sourceCode, setSourceCode] = React.useState(codeSnippets["javascript"])
    const [languageOption, setLanguageOption] = React.useState<LanguageOption>(languageOptions[0])
    const [loading, setLoading] = React.useState(false)
    const [output, setOutput] = React.useState<string[]>([])
    const [errorOccurred, setErrorOccurred] = React.useState(false)
    const editorRef = React.useRef(null)
    const compileMutation = useCompileCode()
    const saveMutation = useSaveCodingQuestion(
        assesmentId,
        examId
    )


    console.log(data);

    useEffect(() => {
        if (data?.language) {
            const selectedLanguage = languageOptions.find(option => option.language === data.language)
            if (selectedLanguage) {
                setLanguageOption(selectedLanguage)
                setSourceCode(codeSnippets[selectedLanguage.language])
            }
        }
    }, [data])


    function handleEditorDidMount(editor: any) {
        editorRef.current = editor
        editor.focus()
    }

    function handleOnchange(value: string | undefined) {
        if (value) {
            setSourceCode(value)
        }
    }

    function onSelectLanguage(value: string) {
        const selectedLanguage = languageOptions.find(option => option.language === value)
        if (selectedLanguage) {
            setLanguageOption(selectedLanguage)
            setSourceCode(codeSnippets[selectedLanguage.language])
        }
    }

    const executeCode = async () => {
        setLoading(true)
        setErrorOccurred(false)
        setOutput([])

        const requestData = {
            language: languageOption.language,
            version: languageOption.version,
            files: [{ content: sourceCode }],
        }

        try {
            const result = await compileMutation.mutateAsync(requestData, {
                onSuccess: () => {
                    toast({
                        title: "Compiled successfully",
                    });
                }
            })
            if (result?.run?.output) {
                setOutput(result.run.output.split("\n"))
            } else {
                throw new Error("No output received")
            }
        } catch (error) {
            setErrorOccurred(true)
            console.error("Error during code execution:", error)
            setOutput(["An error occurred while executing the code. Please try again."])
        } finally {
            setLoading(false)
        }
    }

    const handleSave = (
    ) => {

        if (!data?.id) return;

        saveMutation.mutate({
            answer: sourceCode,
            codingQuestionId: data?.id
        }, {
            onSuccess: () => {
                toast({
                    title: "Saved Successfully",
                });
            }
        })
    }


    return (
        <Card className="h-full w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 shadow-xl">
            <ResizablePanelGroup direction="horizontal" className="w-full h-full rounded-lg">
                <ResizablePanel defaultSize={40} minSize={30}>
                    <Card className="h-full bg-gray-700 border-none flex flex-col">
                        <CardHeader className="bg-gray-800 py-3">
                            <CardTitle className="text-2xl font-bold flex items-center justify-between text-blue-300">
                                <div className="flex items-center">
                                    <Code2 className="w-6 h-6 mr-2 text-blue-400" />
                                    Question {currentIndex + 1}
                                </div>
                                {timeLeft}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="p-6 flex-grow flex flex-col gap-y-3.5">
                            <div
                                className="prose prose-invert max-w-none text-gray-200"
                                dangerouslySetInnerHTML={{ __html: data?.questionText }}
                            />

                            {data?.haveQuestionCode && <CodeHighlighter
                                code={data?.questionCode}
                                language={data?.language}
                            />}

                        </CardContent>

                        <CardFooter className="bg-gray-800 p-4 flex justify-between items-center">
                            <Button
                                onClick={handlePrevQuestion}
                                disabled={isPrevDisabled}
                                className="bg-gray-700 hover:bg-gray-600 text-white transition-colors px-6 py-2 flex items-center"
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Previous
                            </Button>
                            <div className="text-gray-300">
                                Question {currentIndex + 1} of {totalQuestions}
                            </div>
                            <Button
                                onClick={handleNextQuestion}
                                disabled={isNextDisabled}
                                className="bg-gray-700 hover:bg-gray-600 text-white transition-colors px-6 py-2 flex items-center"
                            >
                                Next
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>

                </ResizablePanel>
                <ResizableHandle withHandle className="bg-gray-600 hover:bg-gray-500 transition-colors" />
                <ResizablePanel defaultSize={60}>
                    <ResizablePanelGroup direction="vertical" className="h-full">
                        <ResizablePanel defaultSize={70} minSize={30}>
                            <Card className="h-full border-none">
                                <CardHeader className="py-1.5 bg-gray-800 flex flex-row items-center justify-between">
                                    <Select onValueChange={onSelectLanguage} value={languageOption.language}>
                                        <SelectTrigger className="w-[180px] h-9 bg-gray-700 border-gray-600 text-gray-100">
                                            <SelectValue placeholder="Select a language" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 flex-grow border-gray-600 text-gray-100">
                                            <SelectGroup>
                                                <SelectLabel className="text-gray-400">Languages</SelectLabel>
                                                {languageOptions.map(option => (
                                                    <SelectItem key={option.language} value={option.language} className="hover:bg-gray-600">
                                                        {option.language}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <div className="flex space-x-2">

                                        <Button
                                            onClick={executeCode}
                                            disabled={loading}
                                            className="bg-blue-600 h-9 hover:bg-blue-700 text-white transition-colors"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                    Running...
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Run Code
                                                </>
                                            )}
                                        </Button>
                                        <Button onClick={handleSave} className="bg-green-600 h-9 hover:bg-green-700 text-white transition-colors">
                                            <Save className="w-4 h-4 mr-2" />
                                            {
                                                saveMutation.isLoading ? "Saving.." : "Save"}
                                        </Button>
                                        <ConfirmSubmitDialog
                                            timeLeft={timeLeft}
                                            onConfirm={() => handleSubmit()}
                                        >
                                            <Button className="bg-purple-600 h-9 hover:bg-purple-700 text-white transition-colors">
                                                <Send className="w-4 h-4 mr-2" />
                                                Submit
                                            </Button>
                                        </ConfirmSubmitDialog>
                                    </div>

                                </CardHeader>
                                <CardContent className="p-0 h-full">
                                    <MonacoEditor
                                        theme="vs-dark"
                                        defaultLanguage={languageOption.language}
                                        defaultValue={sourceCode}
                                        onMount={handleEditorDidMount}
                                        onChange={handleOnchange}
                                        language={languageOption.language}
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            roundedSelection: false,
                                            scrollBeyondLastLine: false,
                                            readOnly: false,
                                            automaticLayout: true,
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        </ResizablePanel>
                        <ResizableHandle withHandle className="bg-gray-600 hover:bg-gray-500 transition-colors" />
                        <ResizablePanel defaultSize={30} minSize={20}>
                            <Card className="h-full border-none">
                                <CardHeader className="py-2 bg-gray-800">
                                    <CardTitle className="text-xl font-bold flex items-center text-green-300">
                                        <Terminal className="w-5 h-5 mr-2 text-green-400" />
                                        Output
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-full overflow-auto bg-gray-700 p-4">
                                    <AnimatePresence mode="wait">
                                        {errorOccurred ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                // @ts-ignore
                                                className="flex items-center space-x-2 text-red-300 bg-red-900/20 p-4 rounded-md"
                                            >
                                                <>
                                                    <TriangleAlertIcon className="w-5 h-5 flex-shrink-0" />
                                                    <p>An error occurred. Please check your code and try again.</p>
                                                </>
                                            </motion.div>
                                        ) : output.length > 0 ? (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {output.map((item, index) => (
                                                    <p key={index} className="font-mono text-sm text-green-300 mb-1">
                                                        {item}
                                                    </p>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.p
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                // @ts-ignore
                                                className="text-gray-400 italic"
                                            >

                                                Run your code to see the output here.
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </CardContent>
                            </Card>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </Card>
    )
}