import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Layout from '../../components/Layout'
import { Input } from '../../components/ui/input'
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

function StatCard({ label, value, color = 'text-slate-800' }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  )
}

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([])
  const [filtered, setFiltered] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/tickets/admin/all'),
      api.get('/tickets/admin/stats'),
    ]).then(([ticketsRes, statsRes]) => {
      setTickets(ticketsRes.data.tickets)
      setFiltered(ticketsRes.data.tickets)
      setStats(statsRes.data.stats)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = tickets
    if (statusFilter !== 'All') result = result.filter(t => t.status === statusFilter)
    if (priorityFilter !== 'All') result = result.filter(t => t.priority === priorityFilter)
    if (search) result = result.filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [statusFilter, priorityFilter, search, tickets])

  const getCount = (arr, key) => arr?.find(i => i._id === key)?.count || 0

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of all support tickets</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Tickets" value={stats.totalTickets} />
            <StatCard label="Open" value={getCount(stats.byStatus, 'Open')} color="text-green-600" />
            <StatCard label="In Progress" value={getCount(stats.byStatus, 'In Progress')} color="text-blue-600" />
            <StatCard label="Urgent" value={getCount(stats.byPriority, 'Urgent')} color="text-red-600" />
          </div>
        )}

        {/* Breakdown */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* By Status */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">By Status</h3>
              <div className="space-y-2">
                {stats.byStatus.map(item => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[item._id]}`}>{item._id}</span>
                    <span className="text-sm font-semibold text-slate-700">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* By Priority */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">By Priority</h3>
              <div className="space-y-2">
                {stats.byPriority.map(item => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityStyles[item._id]}`}>{item._id}</span>
                    <span className="text-sm font-semibold text-slate-700">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* By Category */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">By Category</h3>
              <div className="space-y-2">
                {stats.byCategory.map(item => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{item._id}</span>
                    <span className="text-sm font-semibold text-slate-700">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters + Search */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-white"
          />
          <Select onValueChange={setStatusFilter} defaultValue="All">
            <SelectTrigger className="w-36 bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={setPriorityFilter} defaultValue="All">
            <SelectTrigger className="w-36 bg-white"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              {['All', 'Low', 'Medium', 'High', 'Urgent'].map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-slate-400 ml-auto">{filtered.length} of {tickets.length} tickets</p>
        </div>

        {/* Ticket list */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
            <p className="text-slate-400">No tickets match the filters.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {filtered.map((ticket, i) => (
              <Link to={`/admin/tickets/${ticket._id}`} key={ticket._id}>
                <div className={`flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors ${i !== 0 ? 'border-t border-slate-100' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 truncate">{ticket.title}</p>
                    <p className="text-sm text-slate-400 mt-0.5">
                      {ticket.category} · {new Date(ticket.createdAt).toLocaleDateString()}
                      {ticket.comments.length > 0 && ` · ${ticket.comments.length} comment${ticket.comments.length > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityStyles[ticket.priority]}`}>{ticket.priority}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[ticket.status]}`}>{ticket.status}</span>
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