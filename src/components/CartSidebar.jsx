import { useDispatch, useSelector } from 'react-redux'
import { addToCart, decrementItem, removeFromCart } from '../store/slices/cartSlice'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function CartSidebar({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const items = useSelector(s => s.cart.items)
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const totalItems = items.reduce((s, i) => s + i.qty, 0)

  const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#F4F5F7] z-[70] transform transition-transform duration-300 cubic-bezier(0.25, 0.8, 0.25, 1) shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="bg-white px-6 py-5 shadow-sm z-10 flex items-center justify-between sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#FF0038]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 leading-tight">My Box</h2>
              <Link to="/products" onClick={onClose} className="text-xs font-semibold text-[#FF0038] hover:text-[#d0002d] uppercase tracking-wide">
                View Full Menu
              </Link>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="Empty Cart" className="w-48 h-48 object-contain mb-4 opacity-80 mix-blend-multiply" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Good food is always cooking</h3>
              <p className="text-gray-500 mb-6 max-w-[250px]">Your cart is empty. Add something from the menu</p>
              <Link
                to="/products"
                onClick={onClose}
                className="px-8 py-3 bg-[#FF0038] text-white font-bold rounded-lg shadow-lg hover:bg-[#e60032] transition transform active:scale-95"
              >
                BROWSE PRODUCTS
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {items.map((item, idx) => (
                <div key={item.id} className={`flex gap-4 p-4 ${idx !== items.length - 1 ? 'border-b border-gray-100' : ''}`}>

                  {/* Item Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image || 'https://via.placeholder.com/80x80'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                    />
                    {/* Veg/Non-veg Dot Placeholder - Assuming Veg to be safe or hiding */}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-2 pr-2">{item.name}</h3>
                      <span className="font-semibold text-gray-700 text-sm whitespace-nowrap">{fmtINR(item.price * item.qty)}</span>
                    </div>
                    <p className="text-xs text-gray-400">{item.unitLabel || 'Per Unit'}</p>

                    {/* Controls */}
                    <div className="flex justify-between items-end mt-2">
                      <div className="flex items-center bg-white border border-gray-200 rounded-lg h-8 shadow-sm">
                        <button
                          onClick={() => dispatch(decrementItem({ id: item.id, qty: 1 }))}
                          className="px-2.5 h-full text-gray-500 hover:text-[#FF0038] hover:bg-gray-50 rounded-l-lg transition"
                        >
                          <span className="text-lg leading-none font-bold">−</span>
                        </button>
                        <span className="px-2 text-sm font-semibold text-gray-700 min-w-[1.5rem] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => dispatch(addToCart({ ...item, qty: 1 }))}
                          className="px-2.5 h-full text-[#FF0038] hover:bg-gray-50 rounded-r-lg transition"
                        >
                          <span className="text-lg leading-none font-bold">+</span>
                        </button>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="text-[10px] font-medium text-gray-400 hover:text-red-500 uppercase tracking-wider pl-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bill Details */}
          {items.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Bill Details</h4>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Item Total</span>
                <span>{fmtINR(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">Delivery Fee <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">PRO</span></span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Platform Fee</span>
                <span>{fmtINR(5)}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                <span>To Pay</span>
                <span>{fmtINR(total + 5)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-20">
            <Link
              to="/cart"
              onClick={onClose}
              className="group flex items-center justify-between w-full bg-[#FF0038] hover:bg-[#d0002d] text-white py-3.5 px-6 rounded-xl shadow-lg shadow-red-200 transition-all duration-200 transform active:scale-[0.98]"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium opacity-90 uppercase">Total</span>
                <span className="text-lg font-bold">{fmtINR(total + 5)}</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-base">
                Checkout
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
