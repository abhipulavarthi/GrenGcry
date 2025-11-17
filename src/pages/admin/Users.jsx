import { useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [q, setQ] = useState('')
  const [role, setRole] = useState('all')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await api.getUsers({ page: 1, limit: 1000 })
      const data = res.data?.items || res.data || []
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load users')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return users.filter(u => {
      const roleOk = role === 'all' || String(u.role || '').toLowerCase() === role
      const txt = `${u.name || ''} ${u.email || ''}`.toLowerCase()
      const qOk = !term || txt.includes(term)
      return roleOk && qOk
    })
  }, [users, q, role])

  const exportCSV = () => {
    const cols = ['Name','Email','Role']
    const rows = filtered.map(u => [u.name||'', u.email||'', u.role||''])
    const csv = [cols.join(','), ...rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex items-center gap-2 ml-auto">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name or email" className="px-3 py-2 border rounded-full text-sm" />
          <select value={role} onChange={e=>setRole(e.target.value)} className="px-3 py-2 border rounded-full text-sm">
            <option value="all">All Roles</option>
            <option value="admin">ADMIN</option>
            <option value="customer">CUSTOMER</option>
          </select>
          <button onClick={fetchUsers} className="px-3 py-2 border rounded-full text-sm hover:bg-[#FF0038] hover:text-white">Refresh</button>
          <button onClick={exportCSV} className="px-3 py-2 border rounded-full text-sm hover:bg-[#FF0038] hover:text-white">Export CSV</button>
          <div className="text-sm text-gray-600">Total: <span className="font-semibold">{filtered.length}</span></div>
        </div>
      </div>
      {loading ? 'Loading...' : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-800">
                <th className="p-2">#</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id || i} className="border-b dark:border-gray-800">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2">{u.name || '-'}</td>
                  <td className="p-2">{u.email || '-'}</td>
                  <td className="p-2 uppercase">{(u.role || '').toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
