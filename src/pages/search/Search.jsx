import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const popular = [
  { name: 'Rolls', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&auto=format&fit=crop' },
  { name: 'Tea', img: 'https://images.unsplash.com/photo-1501707305551-9b2adda5e527?q=80&w=200&auto=format&fit=crop' },
  { name: 'Cake', img: 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=200&auto=format&fit=crop' },
  { name: 'Dessert', img: 'https://images.unsplash.com/photo-1541782814453-4f28a36e4489?q=80&w=200&auto=format&fit=crop' },
  { name: 'Sandwich', img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=200&auto=format&fit=crop' },
  { name: 'Beverages', img: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=200&auto=format&fit=crop' },
]

export default function Search() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [q, setQ] = useState('')

  useEffect(() => {
    const qp = params.get('q') || ''
    setQ(qp)
  }, [params])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!q.trim()) return
    navigate(`/products?q=${encodeURIComponent(q.trim())}`)
  }

  const onPick = (name) => {
    navigate(`/products?q=${encodeURIComponent(name)}`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="h-10" />
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-2 p-4 border border-brand-steel/40 rounded-xl shadow-sm bg-white/60 dark:bg-gray-800/40 backdrop-blur-lg">
          <input
            autoFocus
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Search for products and food"
            className="flex-1 outline-none bg-transparent text-lg"
          />
          <button className="px-4 py-2 rounded-md bg-brand-steel text-white">Search</button>
        </div>
      </form>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Popular Cuisines</h2>
        <div className="flex flex-wrap gap-6">
          {popular.map((p, idx) => (
            <button key={idx} onClick={()=>onPick(p.name)} className="flex flex-col items-center gap-2">
              <img src={p.img} alt={p.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700" />
              <span className="text-sm">{p.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
        <div className="flex gap-3 flex-wrap">
          {['Snacks','Tea','Coffee','Bread','Eggs','Milk'].map((k,i)=>(
            <Link key={i} to={`/products?q=${encodeURIComponent(k)}`} className="px-3 py-1 rounded-full border text-sm dark:border-gray-700">{k}</Link>
          ))}
        </div>
      </section>
    </div>
  )
}
