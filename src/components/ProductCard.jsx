import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onAdd, onDec }) {
  const [opt, setOpt] = useState(null)
  const cartItems = useSelector(s => s.cart.items || [])
  const { user } = useSelector(s => s.auth || {})
  const isAdmin = user?.role === 'admin'

  const unitType = product.unitType || (/fruit|veg|vegetable|onion|potato|tomato/i.test(product.category || '') ? 'kg' : 'pcs')
  const options = useMemo(() => {
    if (Array.isArray(product.unitOptions) && product.unitOptions.length) return product.unitOptions
    if (unitType === 'kg') return [
      { label: '250 g', multiplier: 0.25 },
      { label: '500 g', multiplier: 0.5 },
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 },
    ]
    return [
      { label: '1 pc', multiplier: 1 },
      { label: '2 pcs', multiplier: 2 },
      { label: '4 pcs', multiplier: 4 },
    ]
  }, [product.unitOptions, unitType])

  const selected = opt || options[0]
  const inCart = useMemo(() => {
    const id = `${product.id}:${selected.label}`
    return (cartItems || []).filter(i => i.id === id).reduce((sum, i) => sum + (i.qty || 0), 0)
  }, [cartItems, product.id, selected.label])

  const effectiveUnitPrice = (product.price || 0) * selected.multiplier
  const originalUnitPrice = (product.originalPrice || 0) * selected.multiplier
  const discount = originalUnitPrice > effectiveUnitPrice
    ? Math.round(((originalUnitPrice - effectiveUnitPrice) / originalUnitPrice) * 100)
    : 0

  const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

  const add = (e, units = 1) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (!onAdd) return
    const item = {
      id: `${product.id}:${selected.label}`,
      productId: product.id,
      name: product.name,
      price: effectiveUnitPrice,
      qty: units,
      unitLabel: selected.label,
      unitMultiplier: selected.multiplier,
      image: product.image,
    }
    onAdd(item)
  }

  const dec = (e, units = 1) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (!onDec) return
    const id = `${product.id}:${selected.label}`
    onDec({ id, qty: units })
  }

  const imgSrc = (() => {
    const img = String(product.image || '').trim()
    if (/^https?:\/\//i.test(img) || img.startsWith('/')) return img
    // Fallback to dynamic image if no image provided
    if (product.name) {
      return `https://image.pollinations.ai/prompt/fresh ${encodeURIComponent(product.name)} fruit vegetable grocery?nologo=true`
    }
    return 'https://via.placeholder.com/300x200'
  })()

  return (
    <Link to={`/item/${product.id}`} className="block relative flex flex-col p-3 bg-white rounded-xl hover:shadow-lg transition-shadow duration-300 group border border-gray-100/50">
      {/* Image Area */}
      <div className="relative w-full aspect-[4/3] mb-3">
        <img src={imgSrc} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />

        {/* Add Button (Top Right Overlay) - Hidden for admins */}
        {!isAdmin && (
          <div className="absolute top-0 right-0" onClick={e => e.preventDefault()}>
            {inCart > 0 ? (
              <div className="flex flex-col items-center bg-white border border-[#0C3E96] rounded-md shadow-sm overflow-hidden w-8">
                <button
                  className="w-full h-7 flex items-center justify-center text-[#0C3E96] hover:bg-blue-50 transition font-bold text-lg leading-none pb-0.5"
                  onClick={(e) => dec(e, 1)}
                >−</button>
                <div className="bg-[#0C3E96] text-white text-xs font-bold w-full h-6 flex items-center justify-center">
                  {inCart}
                </div>
                <button
                  className="w-full h-7 flex items-center justify-center text-[#0C3E96] hover:bg-blue-50 transition font-bold text-lg leading-none pb-0.5"
                  onClick={(e) => add(e, 1)}
                >+</button>
              </div>
            ) : (
              <button
                className="w-8 h-8 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center text-[#0C3E96] hover:border-[#0C3E96] hover:shadow transition"
                onClick={(e) => add(e, 1)}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col gap-1">
        <h3 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2" title={product.name}>
          {product.name}
        </h3>

        {/* Weight / Options */}
        <div className="text-xs text-gray-500 font-medium">
          <span>{selected.label}</span>
        </div>

        {/* Price Row */}
        <div className="mt-1 flex items-center gap-2 flex-wrap text-sm">
          <span className="font-bold text-gray-900">{fmtINR(effectiveUnitPrice)}</span>
          {originalUnitPrice > effectiveUnitPrice && (
            <>
              <span className="text-xs text-gray-400 line-through decoration-gray-400">{fmtINR(originalUnitPrice)}</span>
              {discount > 0 && (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-1 rounded">{discount}% OFF</span>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
