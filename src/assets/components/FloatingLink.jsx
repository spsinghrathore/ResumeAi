// FloatingLink.jsx
export default function FloatingLink() {
  return (
    <div className="fixed bottom-0 right-0 z-50">
      <a
        href="https://sp18.online"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-2 border border-dashed border-white/40 
                   backdrop-blur-md bg-blue-950 text-white text-sm font-medium 
                   rounded-tl-xl rounded-br-none rounded-tr-none rounded-bl-none 
                   "
      >
        <img
          src="profile.jpeg"
          alt="Your Name"
          className="w-6 h-6 rounded-full object-cover transition-transform duration-300 hover:scale-110 hover:rotate-6"
        />
        <span className="underline underline-offset-2">By SP</span>
      </a>
    </div>
  );
}
