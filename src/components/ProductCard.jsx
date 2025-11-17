import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

export default function ProductCard({ product, onAdd, onDec }) {
  const [qty, setQty] = useState(1)
  const [opt, setOpt] = useState(null)
  const cartItems = useSelector(s => s.cart.items || [])

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
    return (cartItems||[]).filter(i => i.id === id).reduce((sum, i) => sum + (i.qty||0), 0)
  }, [cartItems, product.id, selected.label])
  const effectiveUnitPrice = (product.price || 0) * selected.multiplier
  const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

  const add = (units = 1) => {
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

  const dec = (units = 1) => {
    if (!onDec) return
    const id = `${product.id}:${selected.label}`
    onDec({ id, qty: units })
  }

  const imgSrc = (() => {
    const img = String(product.image || '').trim()
    if (/^https?:\/\//i.test(img) || img.startsWith('/')) return img
    return 'https://via.placeholder.com/300x200'
  })()

  return (
    <div className="rounded-lg p-4 flex flex-col border border-brand-steel/50 hover:border-brand-steel transition shadow-sm hover:shadow-md bg-white/60">
      <img src={imgSrc} alt={product.name} className="rounded mb-3 aspect-video object-cover border border-brand-steel/30" />
      <h3 className="font-semibold text-lg mb-0.5 text-gray-900">{product.name}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-3">{product.category}</p>
      <div className="mt-auto space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-2xl text-black">{fmtINR(effectiveUnitPrice)}</span>
            {product.originalPrice != null && (
              <span className="text-xs line-through text-gray-500">{fmtINR((product.originalPrice||0) * selected.multiplier)}</span>
            )}
          </div>
          <select className="border border-brand-steel/50 rounded-full px-3 py-1 text-base text-center bg-transparent focus:outline-none focus:ring-2 focus:ring-[#FF0038]/40" value={selected.label} onChange={(e)=>setOpt(options.find(o=>o.label===e.target.value) || options[0])}>
            {options.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button className="w-9 h-9 flex items-center justify-center border border-brand-steel/60 rounded-full bg-white hover:bg-[#FF0038]/10 text-base" onClick={()=>dec(1)}>-</button>
            <span className="mx-1 h-9 min-w-[2.25rem] px-3 flex items-center justify-center border border-brand-steel/60 rounded-full bg-white text-base" title="In cart">{inCart}</span>
            <button className="w-9 h-9 flex items-center justify-center border border-brand-steel/60 rounded-full bg-white hover:bg-[#FF0038]/10 text-base" onClick={()=>add(1)}>+</button>
          </div>
          <div className="flex items-center gap-2">
            {inCart > 0 && <span className="text-xs text-gray-700">In cart: {inCart}</span>}
            {onAdd && <button className="px-4 py-1.5 bg-[#0014A8] text-white rounded-full hover:bg-[#0014A8]/90" onClick={()=>add(qty)}>Add</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
