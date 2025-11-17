import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }) => `block px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? 'bg-gray-100 dark:bg-gray-700 font-medium' : ''}`

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-64 border-r dark:border-gray-800 p-4 sticky top-[57px] h-[calc(100vh-57px)] overflow-auto">
      <nav className="space-y-1">
        <NavLink to="/" end className={linkClass}>Dashboard</NavLink>
        <NavLink to="/products" className={linkClass}>Products</NavLink>
        <NavLink to="/orders" className={linkClass}>Orders</NavLink>
        <NavLink to="/cart" className={linkClass}>Cart</NavLink>
        <NavLink to="/reports" className={linkClass}>Reports</NavLink>
        <NavLink to="/feedback" className={linkClass}>Feedback</NavLink>
      </nav>
    </aside>
  )
}
