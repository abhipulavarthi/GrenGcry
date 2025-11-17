export default function Footer() {
  return (
    <footer className="border-t dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-xs text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} Grengrocery</div>
      </div>
    </footer>
  )
}
