import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.user, data.token)
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">H</span>
          </div>
          <span className="text-white font-semibold text-lg">Helpdesk</span>
        </div>
        <div>
          <blockquote className="text-slate-300 text-xl font-light leading-relaxed">
            "A well-managed support system is the backbone of any productive organization."
          </blockquote>
          <p className="text-slate-500 mt-4 text-sm">Internal Support Platform</p>
        </div>
        <div className="flex gap-6 text-slate-500 text-sm">
          <span>Fast</span><span>Reliable</span><span>Secure</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Welcome back</h1>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Email address</Label>
              <Input name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Password</Label>
              <Input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="text-center text-slate-500 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}