import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'

const priorityColors = {
  Low: 'secondary',
  Medium: 'outline',
  High: 'default',
  Urgent: 'destructive',
}

const statusColors = {
  Open: 'outline',
  'In Progress': 'default',
  Resolved: 'secondary',
  Closed: 'secondary',
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  useEffect(() => {
    api.get('/tickets/admin/all')
      .then(({ data }) => {
        setTickets(data.tickets)
        setFiltered(data.tickets)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = tickets
    if (statusFilter !== 'All') result = result.filter(t => t.status === statusFilter)
    if (priorityFilter !== 'All') result = result.filter(t => t.priority === priorityFilter)
    setFiltered(result)
  }, [statusFilter, priorityFilter, tickets])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">All Tickets</h2>
            <p className="text-sm text-slate-500">{filtered.length} of {tickets.length} tickets</p>
          </div>
          <div className="flex gap-3">
            <Select onValueChange={setStatusFilter} defaultValue="All">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setPriorityFilter} defaultValue="All">
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {['All', 'Low', 'Medium', 'High', 'Urgent'].map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading tickets...</p>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500">No tickets match the filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((ticket) => (
              <Link to={`/admin/tickets/${ticket._id}`} key={ticket._id}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{ticket.title}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}
                        {ticket.comments.length > 0 && ` · ${ticket.comments.length} comments`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={priorityColors[ticket.priority]}>{ticket.priority}</Badge>
                      <Badge variant={statusColors[ticket.status]}>{ticket.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}