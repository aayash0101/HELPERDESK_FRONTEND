import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
      const { data } = await api.post('/auth/register', form)
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
          <h2 className="text-slate-300 text-2xl font-light leading-relaxed">Get the help you need,<br />when you need it.</h2>
          <p className="text-slate-500 mt-4 text-sm">Submit tickets, track progress, get resolved.</p>
        </div>
        <div className="flex gap-6 text-slate-500 text-sm">
          <span>Fast</span><span>Reliable</span><span>Secure</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white mb-2">Create an account</h1>
            <p className="text-slate-400">Join your company's helpdesk platform</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Full name</Label>
              <Input name="name" placeholder="Jane Smith" value={form.name} onChange={handleChange} required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Email address</Label>
              <Input name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300 text-sm">Password</Label>
              <Input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-11" />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium">
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}