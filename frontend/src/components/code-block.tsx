"use client";

import { Check, Copy } from "lucide-react";
import { useState, useEffect } from "react";
import { codeToHtml } from "shiki";
import { Button } from "./ui/button";
import "./code-block.css";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    async function highlightCode() {
      try {
        setIsLoading(true);
        
        // Détecter le thème actuel
        const isDark = document.documentElement.classList.contains('dark');
        
        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: isDark ? 'slack-dark' : 'github-light',
          transformers: [
            {
              line(node, line) {
                if (showLineNumbers) {
                  node.properties["data-line"] = line;
                }
              },
            },
          ],
        });
        setHtml(highlighted);
      } catch (error) {
        console.error("Error highlighting code:", error);
        // Fallback to plain text
        setHtml(`<pre><code>${code}</code></pre>`);
      } finally {
        setIsLoading(false);
      }
    }

    highlightCode();
    
    // Re-highlight si le thème change
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          highlightCode();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    return () => observer.disconnect();
  }, [code, language, showLineNumbers, isMounted]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  // Rendu initial côté serveur (sans highlighting)
  if (!isMounted) {
    return (
      <div className="relative group my-6 rounded-lg overflow-hidden border border-border dark:bg-[#282c34] bg-[#f6f8fa]">
        {(title || true) && (
          <div className="flex items-center justify-between px-4 py-2.5 dark:bg-[#21252b] bg-muted/50 border-b border-border">
            {title && (
              <span className="text-sm font-medium text-foreground">
                {title}
              </span>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-muted-foreground uppercase font-mono font-semibold tracking-wide">
                {language}
              </span>
            </div>
          </div>
        )}
        <div className="relative">
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm font-mono leading-relaxed">{code}</code>
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border dark:border-[#3e4451] border-border dark:bg-[#282c34] bg-[#f6f8fa] shadow-sm hover:shadow-md transition-shadow">
      {/* Header avec titre et bouton copier */}
      {(title || true) && (
        <div className="flex items-center justify-between px-4 py-2.5 dark:bg-[#21252b] bg-muted/90 border-b dark:border-b-[#3e4451] border-b-border backdrop-blur-sm">
          {title && (
            <span className="text-sm font-medium text-foreground">
              {title}
            </span>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs dark:text-[#abb2bf] text-muted-foreground uppercase font-mono font-semibold tracking-wide">
              {language}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleCopy}
              title="Copier le code"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Code avec coloration syntaxique */}
      <div className="relative">
        {isLoading ? (
          <div className="p-5 text-sm text-muted-foreground animate-pulse">
            Chargement de la coloration syntaxique...
          </div>
        ) : (
          <div
            className={`code-block-content overflow-x-auto ${
              showLineNumbers ? "code-block-with-numbers" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </div>
  );
}
