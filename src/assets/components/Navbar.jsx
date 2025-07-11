import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-black py-4 px-6 shadow-md flex justify-between items-center z-50 relative">
      {/* Left: Logo and Title */}
      <div className="flex items-center space-x-2">
        <img
          src="/logo.png"
          alt="Resume Ai logo"
          className="w-10 h-10 rounded-xl"
        />
        <Link to="/" className="text-2xl font-extrabold metallic-text text-white">
          Resume<span className="text-white">Ai</span>
        </Link>
      </div>

      {/* Right: Navigation Links */}
      <div className="flex space-x-6 text-sm font-semibold">
        <Link
          to="/"
          className="text-gray-300 hover:text-white transition duration-300"
        >
          Home
        </Link>
        <span className="text-gray-500 cursor-not-allowed">About</span>
      </div>

      {/* Optional metallic text animation */}
      <style>{`
        @keyframes metallic {
          0% {
            background-position: 200% center;
          }
          100% {
            background-position: -200% center;
          }
        }
        .metallic-text {
          background: linear-gradient(90deg, #ccc, #fff, #ccc);
          background-size: 400%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: metallic 3s linear infinite;
        }
      `}</style>
    </nav>
  );
}
