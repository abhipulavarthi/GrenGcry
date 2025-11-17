import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { connectSocket, onMessage } from '../services/socket'

export default function Dashboard() {
  const { user } = useSelector(s => s.auth)

  useEffect(() => {
    connectSocket()
    onMessage((msg) => {
      if (msg?.type === 'alert') toast.info(msg.message || 'New notification')
    })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="text-sm text-gray-500">Welcome</div>
          <div className="text-xl font-semibold">{user?.name || 'Guest'}</div>
        </div>
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="text-sm text-gray-500">Role</div>
          <div className="text-xl font-semibold">{user?.role || 'guest'}</div>
        </div>
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="text-sm text-gray-500">Status</div>
          <div className="text-xl font-semibold">Online</div>
        </div>
      </div>
    </div>
  )
}
