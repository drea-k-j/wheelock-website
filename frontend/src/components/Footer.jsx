export default function Footer() {
  return (
    <footer className="bg-wheelock-dark text-white py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="https://www.instagram.com/wheelockhouse/" target="_blank" rel="noopener noreferrer" className="hover:text-wheelock-light transition">
            Instagram
          </a>
          <a href="https://www.linkedin.com/company/the-wheelock-society" target="_blank" rel="noopener noreferrer" className="hover:text-wheelock-light transition">
            LinkedIn
          </a>
          |
          <button
            type="button"
            onClick={() => window.open('https://www.paypal.com/donate?hosted_button_id=JA9VFAW6MNY8W', '_blank', 'noopener,noreferrer')}
            className="bg-wheelock-accent text-white px-3 py-0.5 rounded hover:opacity-90 transition text-sm align-middle"
          >
            Donate
          </button>
        </div>
      </div>
    </footer>
  )
}
