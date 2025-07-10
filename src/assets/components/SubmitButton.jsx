export default function SubmitButton({ disabled, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`mt-6 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-4 px-10 rounded-xl shadow-md transition`}
    >
      {loading ? "Processing..." : "Submit & Analyze"}
    </button>
  );
}
