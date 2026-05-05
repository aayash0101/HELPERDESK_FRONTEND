import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Layout from '../../components/Layout'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'

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

export default function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tickets/my')
      .then(({ data }) => setTickets(data.tickets))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const displayed = tickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">My Tickets</h1>
            <p className="text-slate-500 text-sm mt-1">{tickets.length} total tickets</p>
          </div>
          <Link to="/tickets/new">
            <Button className="bg-blue-600 hover:bg-blue-500 text-white">
              + New Ticket
            </Button>
          </Link>
        </div>

        {/* Search */}
        <Input
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm mb-6 bg-white"
        />

        {/* Ticket list */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
            <p className="text-slate-400 text-lg mb-1">No tickets found</p>
            <p className="text-slate-400 text-sm mb-6">
              {search ? 'Try a different search term' : 'Submit your first support request'}
            </p>
            {!search && (
              <Link to="/tickets/new">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white">Create ticket</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {displayed.map((ticket, i) => (
              <Link to={`/tickets/${ticket._id}`} key={ticket._id}>
                <div className={`flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors ${i !== 0 ? 'border-t border-slate-100' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{ticket.title}</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}
                      {ticket.comments.length > 0 && ` · ${ticket.comments.length} comment${ticket.comments.length > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityStyles[ticket.priority]}`}>
                      {ticket.priority}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}