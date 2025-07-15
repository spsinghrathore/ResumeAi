export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-sm pt-12 pb-8 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Divider */}
        <hr className="border-gray-700" />

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms of Use</a>
          {/* <a href="#" className="hover:text-white transition">Support</a>
          <a href="#" className="hover:text-white transition">Careers</a> */}
          
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs mt-4">
          © {new Date().getFullYear()} ResumeAi. Built with precision and passion.
        </div>
      </div>
    </footer>
  );
}