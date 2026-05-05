import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'

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

export default function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/tickets/my')
      .then(({ data }) => setTickets(data.tickets))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">My Tickets</h2>
            <p className="text-sm text-slate-500">{tickets.length} total</p>
          </div>
          <Link to="/tickets/new">
            <Button>+ New Ticket</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-500 mb-4">No tickets yet.</p>
              <Link to="/tickets/new">
                <Button>Submit your first ticket</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Link to={`/tickets/${ticket._id}`} key={ticket._id}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="py-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">{ticket.title}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        {ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}
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