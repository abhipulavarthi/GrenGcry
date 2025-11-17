export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded shadow max-w-lg w-full mx-4">
        <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-4">{children}</div>
        {actions && <div className="px-4 py-3 border-t dark:border-gray-700 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  )
}
