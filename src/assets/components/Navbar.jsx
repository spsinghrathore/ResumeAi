import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-black py-4 px-6 shadow-md flex justify-between items-center z-50 relative">
      {/* Logo with metallic animation */}
      <Link to="/" className="text-2xl font-extrabold metallic-text">
        Resume<span className="text-white">Ai</span>
        </Link>


      {/* Navigation Links */}
      <div className="flex space-x-6 text-sm font-semibold">
        <Link
          to="/"
          className="text-gray-300 hover:text-white transition duration-300"
        >
          Home
        </Link>
        <span className="text-gray-500 cursor-not-allowed">About</span>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes metallic {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
        .animate-metallic {
          animation: metallic 3s linear infinite;
        }
      `}</style>
    </nav>
  );
}