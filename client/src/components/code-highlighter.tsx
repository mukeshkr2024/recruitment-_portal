import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // You can replace this with any style

interface CodeHighlighterProps {
    language: string;   // Language for syntax highlighting, e.g., "cpp", "javascript"
    code: string;       // The code to display
    style?: any;        // Optional: Style for syntax highlighting (default: vs2015)
}

const CodeHighlighter: React.FC<CodeHighlighterProps> = ({ language, code, style = vs2015 }) => {
    return (
        <div className="w-full">
            <SyntaxHighlighter language={language} style={style}
                customStyle={{
                    fontSize: "14px",
                    maxHeight: "350px"
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeHighlighter;
