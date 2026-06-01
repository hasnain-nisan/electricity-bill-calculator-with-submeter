import type { ReactNode } from "react";

type Props = {
  content: string;
};

type Block =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; code: string; lang: string }
  | { type: "blockquote"; text: string }
  | { type: "table"; rows: string[][]; aligns: ("left" | "right" | "center")[] }
  | { type: "hr" };

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const isDividerRow = (row: string[]) =>
  row.length > 0 && row.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));

const parseTableRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());

function parseMarkdown(md: string): Block[] {
  const lines = md.replaceAll("\r\n", "\n").split("\n");
  const blocks: Block[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      blocks.push({ type: "code", code: codeLines.join("\n"), lang });
      i += 1;
      continue;
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      const level = Math.min(trimmed.match(/^#+/)?.[0].length ?? 1, 3) as
        | 1
        | 2
        | 3;
      blocks.push({ type: "heading", level, text: trimmed.replace(/^#{1,3}\s+/, "") });
      i += 1;
      continue;
    }

    if (trimmed === "---") {
      blocks.push({ type: "hr" });
      i += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      blocks.push({ type: "blockquote", text: trimmed.replace(/^>\s?/, "") });
      i += 1;
      continue;
    }

    if (/^-\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^-\s+/, ""));
        i += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    if (trimmed.startsWith("|") && i + 1 < lines.length && lines[i + 1].includes("|")) {
      const header = parseTableRow(trimmed);
      const divider = parseTableRow(lines[i + 1]);
      if (isDividerRow(divider)) {
        const aligns = divider.map((cell) => {
          const clean = cell.trim();
          if (clean.startsWith(":") && clean.endsWith(":")) return "center";
          if (clean.endsWith(":")) return "right";
          return "left";
        });
        const rows: string[][] = [header];
        i += 2;
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          rows.push(parseTableRow(lines[i]));
          i += 1;
        }
        blocks.push({ type: "table", rows, aligns });
        continue;
      }
    }

    const paraLines = [trimmed];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("#") &&
      !lines[i].trim().startsWith(">") &&
      !lines[i].trim().startsWith("- ") &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].trim().startsWith("|") &&
      lines[i].trim() !== "---"
    ) {
      paraLines.push(lines[i].trim());
      i += 1;
    }
    blocks.push({ type: "paragraph", text: paraLines.join(" ") });
  }

  return blocks;
}

function renderInline(text: string) {
  const pieces: ReactNode[] = [];
  const regex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      pieces.push(text.slice(lastIndex, match.index));
    }
    pieces.push(
      <code
        key={`${match.index}-${match[1]}`}
        className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.95em] text-slate-800"
      >
        {match[1]}
      </code>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    pieces.push(text.slice(lastIndex));
  }

  return pieces;
}

export default function MarkdownPreview({ content }: Readonly<Props>) {
  const blocks = parseMarkdown(content);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const classes =
            block.level === 1
              ? "text-3xl md:text-4xl font-black tracking-tight text-slate-900"
              : block.level === 2
                ? "text-2xl font-bold text-slate-900"
                : "text-xl font-semibold text-slate-900";
          return (
            <h2 key={index} className={classes}>
              {renderInline(block.text)}
            </h2>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={index} className="leading-7 text-slate-700">
              {renderInline(block.text)}
            </p>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={index} className="space-y-2 pl-5 text-slate-700">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="list-disc leading-7">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === "code") {
          return (
            <pre
              key={index}
              className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-5 text-sm leading-6 text-slate-100 shadow-sm"
            >
              <code>{escapeHtml(block.code)}</code>
            </pre>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote
              key={index}
              className="border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-slate-700"
            >
              {renderInline(block.text)}
            </blockquote>
          );
        }

        if (block.type === "table") {
          const [header, ...rows] = block.rows;
          return (
            <div key={index} className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-slate-100 text-slate-900">
                  <tr>
                    {header.map((cell, cellIndex) => (
                      <th
                        key={cellIndex}
                        className="border-b border-slate-200 px-4 py-3 font-semibold"
                        style={{ textAlign: block.aligns[cellIndex] ?? "left" }}
                      >
                        {renderInline(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="odd:bg-white even:bg-slate-50">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="border-b border-slate-200 px-4 py-3 text-slate-700"
                          style={{ textAlign: block.aligns[cellIndex] ?? "left" }}
                        >
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return <hr key={index} className="border-slate-200" />;
      })}
    </div>
  );
}
