import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Layout() {
  const location = useLocation()
  const isAuthNoChrome = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup')
  const hideFooter = isAuthNoChrome
  const hideNavbar = isAuthNoChrome
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-gray-900">
      {!hideNavbar && <Navbar />}
      <main className="relative z-10 flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      {!hideFooter && (
        <div className="relative z-10">
          <Footer />
        </div>
      )}
    </div>
  )
}
