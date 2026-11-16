import React from 'react';
import { parseQuestionMarkdown, parseInline, previewFigureDocument, svgDataUrl } from './question-markdown.mjs';

export function Inline({ text }) {
  return parseInline(text).map((part, index) => part.type === 'code' ? <code key={index} className="inline-code">{part.text}</code>
    : part.type === 'strong' ? <strong key={index}>{part.text}</strong> : <React.Fragment key={index}>{part.text}</React.Fragment>);
}

export function QuestionBody({ text, className = '' }) {
  const blocks = parseQuestionMarkdown(text);
  if (!blocks.length) return null;
  return <div className={`question-body ${className}`}>
    {blocks.map((block, index) => {
      if (block.type === 'heading') return <h3 key={index}><Inline text={block.text} /></h3>;
      if (block.type === 'list') return <ul key={index}>{block.items.map((entry, i) => <li key={i}><Inline text={entry} /></li>)}</ul>;
      if (block.type === 'code') return <figure key={index} className="question-code">
        {block.label && <figcaption>{block.label}</figcaption>}
        <pre data-lang={block.lang || undefined}><code>{block.source}</code></pre>
      </figure>;
      if (block.type === 'preview') return <figure key={index} className="question-preview">
        <figcaption>{block.label || '表示例'}</figcaption>
        <iframe title={block.label || '表示例'} sandbox="" referrerPolicy="no-referrer" srcDoc={previewFigureDocument(block.source)} style={{ height: block.height }} tabIndex={-1} />
      </figure>;
      if (block.type === 'figure') return <figure key={index} className="question-figure">
        <img src={svgDataUrl(block.source)} alt={block.label || '図'} />
        {block.label && <figcaption>{block.label}</figcaption>}
      </figure>;
      return <p key={index} className="source-prose"><Inline text={block.text} /></p>;
    })}
  </div>;
}
