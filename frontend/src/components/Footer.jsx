export default function Footer() {
  return (
    <footer className="bg-wheelock-dark text-white py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <p className="mb-2">&copy; 2024 Wheelock. All rights reserved.</p>
        <div className="flex justify-center gap-4 text-sm">
          <a href="#" className="hover:text-wheelock-light transition">Contact</a>
          <a href="#" className="hover:text-wheelock-light transition">LinkedIn</a>
          <a href="#" className="hover:text-wheelock-light transition">Instagram</a>
        </div>
      </div>
    </footer>
  );
}
