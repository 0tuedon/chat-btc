import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import atomDark from "react-syntax-highlighter/dist/cjs/styles/prism/atom-dark";
import styles from ".././message.module.css";
import Image from "next/image";
import CopyIcon from "@/assets/CopyIcon";
import { useState } from "react";
import rehypeInlineCodeProperty from "../../../utils/rehypeInlineCodeProperty";

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <div
      role="button"
      data-copied={copied}
      className={styles.copyCodeblock}
      onClick={() => {
        // navigator.clipboard.writeText(code);
        setCopied(true);
      }}
      onMouseLeave={() =>
        setTimeout(() => {
          setCopied(false);
        }, 1000)
      }
    >
      <CopyIcon />
    </div>
  );
};

const MarkdownWrapper = ({
  text,
  className,
}: {
  text: string;
  className?: string | null | undefined;
}) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeInlineCodeProperty]}
      className={`${styles.markdownClass} ${className}`}
      components={{
        code(props) {
          const { children, className, node, ref, style, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");
          // console.log({ node });
          const isCodeblock = node?.properties?.isBlock
          return match || isCodeblock ? (
            <div style={{ position: "relative" }}>
              <CopyButton code={codeString} />
              <SyntaxHighlighter
                {...rest}
                ref={ref as React.LegacyRef<SyntaxHighlighter> | undefined}
                PreTag="div"
                language={match ? match[1] : ""}
                style={atomDark}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code {...rest} className={className}>
              {children}
            </code>
          );
        },
      }}
    >
      {text}
    </ReactMarkdown>
  );
};

export default MarkdownWrapper;
