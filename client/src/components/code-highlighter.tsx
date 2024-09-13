import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // You can replace this with any style

// Define the props for the CodeHighlighter component
interface CodeHighlighterProps {
    language: string;   // Language for syntax highlighting, e.g., "cpp", "javascript"
    code: string;       // The code to display
    style?: any;        // Optional: Style for syntax highlighting (default: vs2015)
}

// Create the CodeHighlighter component
const CodeHighlighter: React.FC<CodeHighlighterProps> = ({ language, code, style = vs2015 }) => {
    return (
        <div className="code-highlighter-container">
            <SyntaxHighlighter language={language} style={style}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeHighlighter;
