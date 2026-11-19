import type { ReactNode } from 'react';

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part);
}

export function ConsultationSummary({ text }: { text: string }) {
  return <div className="space-y-2 break-words text-[15px] leading-relaxed">{text.split('\n').map((line, i) => {
    if (line.startsWith('## ')) return <h3 key={i} className="pt-4 text-xl font-semibold first:pt-0">{line.slice(3)}</h3>;
    if (/^\s*[-*] /.test(line)) return <p key={i} className="pl-5 -indent-3">• {inline(line.replace(/^\s*[-*] /, ''))}</p>;
    return line.trim() ? <p key={i}>{inline(line)}</p> : null;
  })}</div>;
}