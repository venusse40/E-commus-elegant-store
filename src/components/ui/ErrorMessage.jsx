export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-4">
      <p className="text-rose-600 font-medium">
        {message || "Something went wrong."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm hover:bg-rose-600 transition"
        >
          Try again
        </button>
      )}
    </div>
  );
}