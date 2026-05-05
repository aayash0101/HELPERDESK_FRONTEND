import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Layout from '../../components/Layout'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

export default function CreateTicket() {
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSelect = (field, value) => setForm({ ...form, [field]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/tickets', form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="p-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Submit a Ticket</h1>
          <p className="text-slate-500 text-sm mt-1">Describe your issue and we'll get back to you</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Title</Label>
              <Input
                name="title"
                placeholder="Brief summary of the issue"
                value={form.title}
                onChange={handleChange}
                required
                className="bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Description</Label>
              <Textarea
                name="description"
                placeholder="Describe the issue in detail — what happened, what you expected, any steps to reproduce..."
                value={form.description}
                onChange={handleChange}
                rows={5}
                required
                className="bg-slate-50 border-slate-200 focus:bg-white resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Category</Label>
                <Select onValueChange={(v) => handleSelect('category', v)} required>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {['IT Support', 'Hardware', 'Software', 'Network', 'Account Access', 'Other'].map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Priority</Label>
                <Select defaultValue="Medium" onValueChange={(v) => handleSelect('priority', v)}>
                  <SelectTrigger className="bg-slate-50 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white">
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}