import { useRef, useState } from "react";

import { useCompileCode } from "@/api/editor/use-compile-code";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { codeSnippets, languageOptions } from "@/utils/config";
import MonocoEditor from "@monaco-editor/react";
import { Loader, Play, TriangleAlert } from "lucide-react";
import { Button } from "../ui/button";
import { selectedLanguageOptionProps, SelectLanguages } from "./select-languages";
export interface CodeSnippetsProps {
    [key: string]: string;
}
export const Editor = () => {
    const [sourceCode, setSourceCode] = useState(codeSnippets["javascript"]);
    const [languageOption, setLanguageOption] = useState(languageOptions[0]);
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState<string[]>([]);
    const [errorOccurred, setErrorOccurred] = useState(false);
    const editorRef = useRef(null);
    function handleEditorDidMount(editor: any) {
        editorRef.current = editor;
        editor.focus();
    }
    function handleOnchange(value: string | undefined) {
        if (value) {
            setSourceCode(value);
        }
    }
    function onSelect(value: selectedLanguageOptionProps) {
        setLanguageOption(value);
        setSourceCode(codeSnippets[value.language]);
    }

    const compileMutation = useCompileCode();

    const executeCode = async () => {
        setLoading(true);
        const requestData = {
            language: languageOption.language,
            version: languageOption.version,
            files: [{ content: sourceCode }],
        };

        try {
            const result = await compileMutation.mutateAsync(requestData);
            if (result?.run?.output) {
                setOutput(result.run.output.split("\n"));
                setErrorOccurred(false);
            } else {
                setErrorOccurred(true);
                setOutput([]);
            }
        } catch (error) {
            setErrorOccurred(true);
            console.error("Error during code execution:", error);
        } finally {
            setLoading(false);
        }
    };
    // console.log(languageOption);
    return (
        <div className="min-h-screen dark:bg-slate-900 rounded-2xl shadow-2xl py-6 px-8">
            {/* EDITOR HEADER */}
            <div className="flex items-center justify-between pb-3">
                <h2 className="scroll-m-20  text-2xl font-semibold tracking-tight first:mt-0">
                    Codex
                </h2>
                <div className="flex items-center space-x-2 ">
                    <div className="w-[230px]">
                        <SelectLanguages
                            onSelect={onSelect}
                            selectedLanguageOption={languageOption}
                        />
                    </div>
                </div>
            </div>
            {/* EDITOR  */}
            <div className="bg-slate-400 dark:bg-slate-950 p-3 rounded-2xl">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="w-full rounded-lg border dark:bg-slate-900"
                >
                    <ResizablePanel defaultSize={50} minSize={35}>
                        <MonocoEditor
                            theme={"vs-dark"}
                            height="100vh"
                            defaultLanguage={languageOption.language}
                            defaultValue={sourceCode}
                            onMount={handleEditorDidMount}
                            value={sourceCode}
                            onChange={handleOnchange}
                            language={languageOption.language}
                        />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50} minSize={35}>
                        {/* Header */}
                        <div className="space-y-3 bg-slate-300 dark:bg-slate-900 min-h-screen">
                            <div className="flex items-center justify-between  bg-slate-400 dark:bg-slate-950 px-6 py-2">
                                <h2>Output</h2>
                                {loading ? (
                                    <Button
                                        disabled
                                        size={"sm"}
                                        className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                                    >
                                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                                        <span>Running please wait...</span>
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={executeCode}
                                        size={"sm"}
                                        className="dark:bg-purple-600 dark:hover:bg-purple-700 text-slate-100 bg-slate-800 hover:bg-slate-900"
                                    >
                                        <Play className="w-4 h-4 mr-2 " />
                                        <span>Run</span>
                                    </Button>
                                )}
                            </div>
                            <div className="px-6 space-y-2">
                                {errorOccurred ? (
                                    <div className="flex items-center space-x-2 text-red-500 border border-red-600 px-6 py-6">
                                        <TriangleAlert className="w-5 h-5 flex-shrink-0" />
                                        <p className="text-xs">Failed to Compile the Code, Please try again!</p>
                                    </div>
                                ) : (
                                    output.map((item, index) => (
                                        <p className="text-sm" key={index}>{item}</p>
                                    ))
                                )}
                            </div>
                        </div>
                        {/* Body */}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}
