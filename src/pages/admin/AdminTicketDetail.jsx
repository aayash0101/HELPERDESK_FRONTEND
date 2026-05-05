import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Layout from '../../components/Layout'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

const priorityStyles = {
  Low: 'bg-slate-100 text-slate-600',
  Medium: 'bg-blue-50 text-blue-700',
  High: 'bg-orange-50 text-orange-700',
  Urgent: 'bg-red-50 text-red-700',
}

const statusStyles = {
  Open: 'bg-green-50 text-green-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Resolved: 'bg-slate-100 text-slate-600',
  Closed: 'bg-slate-100 text-slate-500',
}

export default function AdminTicketDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [updateForm, setUpdateForm] = useState({ status: '', priority: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get(`/tickets/${id}`)
      .then(({ data }) => {
        setTicket(data.ticket)
        setUpdateForm({ status: data.ticket.status, priority: data.ticket.priority })
      })
      .catch(() => navigate('/admin'))
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      const { data } = await api.patch(`/tickets/admin/${id}`, updateForm)
      setTicket(data.ticket)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      const { data } = await api.post(`/tickets/${id}/comments`, { message: comment })
      setTicket(data.ticket)
      setComment('')
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Layout><div className="p-8 text-slate-400">Loading...</div></Layout>
  if (!ticket) return null

  return (
    <Layout>
      <div className="p-8 max-w-3xl">
        <button onClick={() => navigate('/admin')} className="text-slate-400 hover:text-slate-600 text-sm mb-6 flex items-center gap-1">
          ← Back to all tickets
        </button>

        {/* Ticket info */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-xl font-semibold text-slate-800">{ticket.title}</h1>
            <div className="flex gap-2 shrink-0">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityStyles[ticket.priority]}`}>{ticket.priority}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[ticket.status]}`}>{ticket.status}</span>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-slate-400 mb-4">
            <span>{ticket.category}</span>
            <span>·</span>
            <span>{new Date(ticket.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {/* Admin controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
          <h2 className="font-semibold text-slate-800 mb-4">Update Ticket</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label className="text-slate-600 text-sm">Status</Label>
              <Select value={updateForm.status} onValueChange={(v) => setUpdateForm({ ...updateForm, status: v })}>
                <SelectTrigger className="bg-slate-50 border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-600 text-sm">Priority</Label>
              <Select value={updateForm.priority} onValueChange={(v) => setUpdateForm({ ...updateForm, priority: v })}>
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
          <Button onClick={handleUpdate} disabled={updating} className="bg-blue-600 hover:bg-blue-500 text-white">
            {saved ? '✓ Saved' : updating ? 'Saving...' : 'Save changes'}
          </Button>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">
            Comments {ticket.comments.length > 0 && <span className="text-slate-400 font-normal">({ticket.comments.length})</span>}
          </h2>
          {ticket.comments.length === 0 ? (
            <p className="text-slate-400 text-sm mb-6">No comments yet.</p>
          ) : (
            <div className="space-y-4 mb-6">
              {ticket.comments.map((c) => (
                <div key={c._id} className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-medium">A</span>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-lg px-4 py-3">
                    <p className="text-slate-700 text-sm">{c.message}</p>
                    <p className="text-slate-400 text-xs mt-1">{new Date(c.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleComment} className="space-y-3">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="bg-slate-50 border-slate-200 resize-none"
            />
            <Button type="submit" size="sm" disabled={submitting} className="bg-blue-600 hover:bg-blue-500 text-white">
              {submitting ? 'Posting...' : 'Post comment'}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  )
}