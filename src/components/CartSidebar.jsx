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
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: '#FAFAFA' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-brand-steel/20">
            <div>
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              <p className="text-sm text-gray-500">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-brand-sand/40 rounded-full transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <p className="text-gray-500 mb-2">Your cart is empty</p>
                <Link 
                  to="/products" 
                  onClick={onClose}
                  className="text-[#FF0038] hover:underline"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 pb-4 border-b border-brand-steel/20">
                    <img 
                      src={item.image || 'https://via.placeholder.com/80x80'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm mb-1 truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.unitLabel || ''}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => dispatch(decrementItem({ id: item.id, qty: 1 }))}
                          className="w-9 h-9 flex items-center justify-center border border-brand-steel/40 rounded-full bg-white hover:bg-[#FF0038]/10 text-base"
                        >
                          -
                        </button>
                        <span className="px-3 h-9 min-w-[2.25rem] flex items-center justify-center text-base font-medium border border-brand-steel/40 rounded-full bg-white">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => dispatch(addToCart({ ...item, qty: 1 }))}
                          className="w-9 h-9 flex items-center justify-center border border-brand-steel/40 rounded-full bg-white hover:bg-[#FF0038]/10 text-base"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#FF0038]">{fmtINR(item.price * item.qty)}</span>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-xs text-[#0014A8] hover:text-[#0014A8] border border-[#0014A8] rounded-full px-2 py-0.5"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-brand-steel/20 p-4 space-y-3">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span className="text-[#FF0038]">{fmtINR(total)}</span>
              </div>
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full py-3 text-center bg-[#FF0038] text-white rounded-full hover:bg-[#FF0038]/90 transition font-medium"
              >
                Go to Cart
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="block w-full py-3 text-center border-2 border-[#0014A8] text-[#0014A8] rounded-full hover:bg-[#0014A8]/5 transition font-medium"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
