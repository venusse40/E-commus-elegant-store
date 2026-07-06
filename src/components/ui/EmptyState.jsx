export default function EmptyState({ title = "Nothing here yet", subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-4">
      <p className="text-lg font-medium text-gray-700">{title}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}