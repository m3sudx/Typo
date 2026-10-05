import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

import "./aiMessage.css";

export default function AIMessage({ message }) {
  return (
    <div className="ai-message">
      <div className="ai-message-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");

              const code = String(children).replace(/\n$/, "");

              // Inline code
              if (!match) {
                return (
                  <code className="inline-code" {...props}>
                    {children}
                  </code>
                );
              }

              // Code block
              return (
                <CodeBlock
                  language={match[1]}
                  code={code}
                />
              );
            },
          }}
        >
          {message}
        </ReactMarkdown>
      </div>
    </div>
  );
}

function CodeBlock({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-language">
          {language}
        </span>

        <button
          className="copy-button"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: "18px",
          background: "#111111",
          fontSize: "14px",
          lineHeight: "1.65",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}