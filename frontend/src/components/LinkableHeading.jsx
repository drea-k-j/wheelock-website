export default function LinkableHeading({ level = 2, children, className }) {
  const HeadingTag = `h${level}`
  
  const slugify = (text) => {
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  }
  
  const anchorId = slugify(children)
  
  const handleCopyLink = () => {
    const url = `${window.location.pathname}#${anchorId}`
    navigator.clipboard.writeText(url)
    // Optional: Show a brief toast or feedback
    alert('Link copied to clipboard!')
  }

  return (
    <HeadingTag 
      id={anchorId}
      className={`group cursor-pointer relative w-full break-words scroll-mt-24 ${className || ''}`}
      onClick={handleCopyLink}
    >
      <span className="inline">
        {children}
        <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-wheelock-accent">
          🔗
        </span>
      </span>
    </HeadingTag>
  )
}
