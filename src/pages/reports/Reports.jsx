import { useEffect, useState } from 'react'
import api from '../../services/api'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts'
import { toast } from 'react-toastify'

export default function Reports() {
  const [sales, setSales] = useState([])
  const [revenue, setRevenue] = useState([])

  useEffect(() => {
    (async () => {
      try {
        // Fetch recent orders and aggregate per day
        const res = await api.getOrders({ page: 1, limit: 1000 })
        const list = res.data?.items || res.data || []
        const byDate = new Map()
        for (const o of list) {
          const d = new Date(o.createdAt || Date.now())
          const key = d.toISOString().slice(0, 10) // YYYY-MM-DD
          const cur = byDate.get(key) || { date: key, count: 0, amount: 0 }
          cur.count += 1
          cur.amount += Number(o.total || 0)
          byDate.set(key, cur)
        }
        const rows = Array.from(byDate.values()).sort((a,b)=>a.date.localeCompare(b.date))
        setSales(rows.map(r => ({ date: r.date, count: r.count })))
        setRevenue(rows.map(r => ({ date: r.date, amount: r.amount })))
      } catch (e) { toast.error(e?.response?.data?.message || 'Failed to load reports') }
    })()
  }, [])

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="font-medium mb-2">Sales</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="font-medium mb-2">Revenue</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
