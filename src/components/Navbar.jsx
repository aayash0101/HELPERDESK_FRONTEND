import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import api from '../api/axios'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      // continue logout even if request fails
    }
    logout()
    navigate('/login')
  }

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-slate-800">
            🎫 Helpdesk
          </h1>
          <Badge variant="outline" className="text-xs capitalize">
            {user?.role}
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">
            {user?.name}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}