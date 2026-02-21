import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, decrementItem } from '../../store/slices/cartSlice'
import api from '../../services/api'
import { toast } from 'react-toastify'

const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
)
const PlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)
const MinusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
)
const ShoppingBagIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
)
const TruckIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
)
const ShieldIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
)
const RotateCcwIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15.1a9 9 0 1 0 2.13-9.36L1 10"></path></svg>
)

export default function ProductView() {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedOpt, setSelectedOpt] = useState(null)
    const cartItems = useSelector(s => s.cart.items || [])

    const fetchProduct = async () => {
        try {
            const res = await api.getProduct(id)
            setProduct(res.data)
        } catch (e) {
            toast.error('Failed to load product')
            navigate('/products')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [id])

    const unitType = product?.unitType || (/fruit|veg|vegetable|onion|potato|tomato/i.test(product?.category || '') ? 'kg' : 'pcs')

    const options = useMemo(() => {
        if (!product) return []
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
    }, [product, unitType])

    useEffect(() => {
        if (options.length && !selectedOpt) {
            setSelectedOpt(options[0])
        }
    }, [options])

    const selected = selectedOpt || options[0]

    const inCart = useMemo(() => {
        if (!product || !selected) return 0
        const cartId = `${product.id}:${selected.label}`
        return (cartItems || []).filter(i => i.id === cartId).reduce((sum, i) => sum + (i.qty || 0), 0)
    }, [cartItems, product, selected])

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0014A8]"></div>
        </div>
    )

    if (!product) return null

    // Price overrides from localStorage (if any)
    let overrides = {}
    try { overrides = JSON.parse(localStorage.getItem('saleOverrides') || '{}') || {} } catch { }
    const salePrice = overrides[product.name]
    const basePrice = (salePrice != null && !isNaN(+salePrice)) ? +salePrice : product.price
    const originalPrice = (salePrice != null && !isNaN(+salePrice)) ? product.price : (product.originalPrice || product.price)

    const effectivePrice = basePrice * (selected?.multiplier || 1)
    const effectiveOriginalPrice = originalPrice * (selected?.multiplier || 1)
    const discount = effectiveOriginalPrice > effectivePrice
        ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)
        : 0

    const fmtINR = (n) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(n)

    const add = () => {
        const item = {
            id: `${product.id}:${selected.label}`,
            productId: product.id,
            name: product.name,
            price: effectivePrice,
            qty: 1,
            unitLabel: selected.label,
            unitMultiplier: selected.multiplier,
            image: product.image,
        }
        dispatch(addToCart(item))
    }

    const dec = () => {
        const cartId = `${product.id}:${selected.label}`
        dispatch(decrementItem({ id: cartId, qty: 1 }))
    }

    const imgSrc = (() => {
        const img = String(product.image || '').trim()
        if (/^https?:\/\//i.test(img) || img.startsWith('/')) return img
        return `https://image.pollinations.ai/prompt/fresh ${encodeURIComponent(product.name)} fruit vegetable grocery?nologo=true`
    })()

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-[#0014A8] transition-colors mb-8 group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">
                    <ArrowLeftIcon />
                </span>
                <span>Back to products</span>
            </button>

            <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Left: Image */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center justify-center aspect-square md:sticky md:top-24">
                    <img
                        src={imgSrc}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply"
                    />
                    {discount > 0 && (
                        <div className="absolute top-6 left-6 bg-[#FF0038] text-white px-4 py-1 rounded-full font-bold text-sm shadow-lg">
                            {discount}% OFF
                        </div>
                    )}
                </div>

                {/* Right: Details */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-sm font-bold text-[#0014A8] uppercase tracking-wider mb-2">{product.category}</h2>
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-3xl font-bold text-gray-900">{fmtINR(effectivePrice)}</span>
                        {effectiveOriginalPrice > effectivePrice && (
                            <span className="text-xl text-gray-400 line-through">{fmtINR(effectiveOriginalPrice)}</span>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase">Select Quantity</h3>
                        <div className="flex flex-wrap gap-3">
                            {options.map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => setSelectedOpt(opt)}
                                    className={`px-6 py-2.5 rounded-xl border-2 transition-all font-medium ${selected.label === opt.label
                                            ? 'border-[#0014A8] bg-blue-50 text-[#0014A8] shadow-sm'
                                            : 'border-gray-100 bg-white text-gray-600 hover:border-gray-300'
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        {inCart > 0 ? (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-200">
                                    <button
                                        onClick={dec}
                                        className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        <MinusIcon />
                                    </button>
                                    <span className="w-12 text-center font-bold text-xl">{inCart}</span>
                                    <button
                                        onClick={add}
                                        className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-green-500 transition-colors"
                                    >
                                        <PlusIcon />
                                    </button>
                                </div>
                                <button
                                    onClick={() => navigate('/cart')}
                                    className="flex-1 bg-[#0014A8] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#0C3E96] transition-all shadow-lg hover:shadow-xl"
                                >
                                    <ShoppingBagIcon />
                                    View in Cart
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={add}
                                disabled={product.stock <= 0}
                                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl ${product.stock > 0
                                        ? 'bg-[#0014A8] text-white hover:bg-[#0C3E96]'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                <PlusIcon />
                                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0014A8] shadow-sm">
                                <TruckIcon />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">Express</p>
                                <p className="text-[10px] text-gray-500">10-15 mins</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0014A8] shadow-sm">
                                <ShieldIcon />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-900">Premium</p>
                                <p className="text-[10px] text-gray-500">Quality Assured</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-4 border border-blue-100 bg-blue-50/30 rounded-2xl flex items-start gap-3">
                        <div className="text-[#0014A8] mt-1">
                            <RotateCcwIcon />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">100% Satisfaction Guarantee</p>
                            <p className="text-xs text-gray-600">If you're not happy with the quality, we'll replace it no questions asked.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
