import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Label } from '../../components/ui/label'

const priorityColors = {
  Low: 'secondary',
  Medium: 'outline',
  High: 'default',
  Urgent: 'destructive',
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

  if (loading) return <div className="min-h-screen bg-slate-50"><Navbar /><p className="p-8 text-slate-500">Loading...</p></div>
  if (!ticket) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Ticket info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{ticket.title}</CardTitle>
              <div className="flex gap-2">
                <Badge variant={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                <Badge variant="outline">{ticket.status}</Badge>
              </div>
            </div>
            <p className="text-sm text-slate-500">{ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}</p>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 whitespace-pre-wrap">{ticket.description}</p>
          </CardContent>
        </Card>

        {/* Admin controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Update Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Status</Label>
                <Select value={updateForm.status} onValueChange={(v) => setUpdateForm({ ...updateForm, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Priority</Label>
                <Select value={updateForm.priority} onValueChange={(v) => setUpdateForm({ ...updateForm, priority: v })}>
                  <SelectTrigger>
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
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? 'Saving...' : 'Save changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comments ({ticket.comments.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticket.comments.length === 0 ? (
              <p className="text-sm text-slate-400">No comments yet.</p>
            ) : (
              ticket.comments.map((c) => (
                <div key={c._id} className="bg-slate-50 rounded-md p-3 border">
                  <p className="text-sm text-slate-700">{c.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
            <form onSubmit={handleComment} className="space-y-2 pt-2">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <Button type="submit" size="sm" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post comment'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Button variant="outline" onClick={() => navigate('/admin')}>
          ← Back to all tickets
        </Button>
      </main>
    </div>
  )
}