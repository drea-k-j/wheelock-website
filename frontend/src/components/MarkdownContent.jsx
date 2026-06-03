import ReactMarkdown from 'react-markdown'

/**
 * MarkdownContent component renders markdown for subsection bodies.
 * Supports markdown links, formatting, and embedded HTML (iframes for forms/calendars).
 */
export default function MarkdownContent({ content, className = '' }) {
  return (
    <ReactMarkdown 
      allowedElements={['h1', 'h2', 'h3', 'p', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'img', 'iframe', 'br', 'code', 'pre', 'div']}
      className={`prose prose-sm max-w-none ${className}`}
    >
      {content}
    </ReactMarkdown>
  )
}
