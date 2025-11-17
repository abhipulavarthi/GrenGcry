import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function RoleHomeRedirect() {
  const { role } = useSelector(s => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (role === 'admin') navigate('/admin', { replace: true })
    else if (role === 'salesperson') navigate('/sales', { replace: true })
    else navigate('/user', { replace: true })
  }, [role, navigate])

  return null
}
