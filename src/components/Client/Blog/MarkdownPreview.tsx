import React, { useMemo } from "react";

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const html = useMemo(() => {
    if (!content) return "";

    let parsed = content;

    // Escape HTML tags to prevent XSS
    parsed = parsed
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Code blocks with syntax copy buttons
    parsed = parsed.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<div class="my-6 rounded-2xl overflow-hidden border border-border/80 bg-slate-950 shadow-md">
        <div class="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-400">
          <span>${lang || "code"}</span>
          <span class="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Copy</span>
        </div>
        <pre class="p-5 text-xs font-mono text-slate-100 overflow-x-auto whitespace-pre leading-relaxed"><code>${code.trim()}</code></pre>
      </div>`;
    });

    // Inline code
    parsed = parsed.replace(/`([^`]+)`/g, '<code class="px-2 py-0.5 rounded bg-muted font-mono text-xs text-primary font-bold">$1</code>');

    // GitHub-style Alerts: [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
    parsed = parsed.replace(/&gt;\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\n([\s\S]*?)(?=\n&gt;|\n\n|\n$|$)/gi, (_, type, text) => {
      const typeLower = type.toUpperCase();
      let borderColors = "border-sky-500 bg-sky-500/5 text-sky-800 dark:text-sky-300";
      let title = "Thông tin";
      if (typeLower === "TIP") {
        borderColors = "border-emerald-500 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300";
        title = "Gợi ý";
      } else if (typeLower === "WARNING") {
        borderColors = "border-amber-500 bg-amber-500/5 text-amber-800 dark:text-amber-300";
        title = "Cảnh báo";
      } else if (typeLower === "CAUTION" || typeLower === "IMPORTANT") {
        borderColors = "border-rose-500 bg-rose-500/5 text-rose-800 dark:text-rose-300";
        title = "Quan trọng";
      }

      return `<div class="my-5 p-4 border-l-4 rounded-r-2xl ${borderColors} shadow-xs">
        <p class="font-black text-xs uppercase tracking-wider flex items-center gap-1.5 mb-1.5">💡 ${title}</p>
        <p class="text-sm font-medium leading-relaxed">${text.replace(/&gt;\s?/g, "").trim()}</p>
      </div>`;
    });

    // Blockquotes
    parsed = parsed.replace(/&gt;\s*(.*)/g, '<blockquote class="border-l-4 border-primary/40 pl-5 py-1.5 italic my-6 text-muted-foreground">$1</blockquote>');

    // Headings
    parsed = parsed.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold font-heading text-foreground mt-8 mb-4 border-b border-border pb-2.5">$1</h1>');
    parsed = parsed.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold font-heading text-foreground mt-7 mb-3 pb-1">$1</h2>');
    parsed = parsed.replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold font-heading text-foreground mt-6 mb-2">$1</h3>');

    // Horizontal Rule
    parsed = parsed.replace(/^\s*---\s*$/gim, '<hr class="my-8 border-border" />');

    // Bold, Italic, Strikethrough
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em class="italic text-foreground">$1</em>');
    parsed = parsed.replace(/~~([^~]+)~~/g, '<del class="line-through text-muted-foreground">$1</del>');

    // Unordered Lists
    parsed = parsed.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc pl-2 text-sm my-1.5 leading-relaxed text-foreground">$1</li>');
    parsed = parsed.replace(/^\s*\*\s+(.*$)/gim, '<li class="ml-4 list-disc pl-2 text-sm my-1.5 leading-relaxed text-foreground">$1</li>');

    // Ordered Lists
    parsed = parsed.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal pl-2 text-sm my-1.5 leading-relaxed text-foreground">$1</li>');

    // Wrap list items
    parsed = parsed.replace(/(<li.*<\/li>)/g, '<ul class="my-5 space-y-1.5">$1</ul>');
    // Remove consecutive nested ul tags
    parsed = parsed.replace(/<\/ul>\s*<ul class="my-5 space-y-1.5">/g, "");

    // Paragraphs
    const lines = parsed.split("\n");
    const wrappedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("<h") || trimmed.startsWith("<div") || trimmed.startsWith("<pre") || trimmed.startsWith("<blockquote") || trimmed.startsWith("<ul") || trimmed.startsWith("<li") || trimmed.startsWith("<hr")) {
        return line;
      }
      return `<p class="text-base leading-relaxed text-foreground/90 my-3">${line}</p>`;
    });

    return wrappedLines.join("\n");
  }, [content]);

  return (
    <div 
      className="prose dark:prose-invert max-w-none break-words leading-relaxed select-text"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
