import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import Navbar from '../../components/Navbar'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'


const priorityColors = {
    Low: 'secondary', Medium: 'outline', High: 'default', Urgent: 'destructive',
}
const statusColors = {
    Open: 'outline', 'In Progress': 'default', Resolved: 'secondary', Closed: 'secondary',
}

function StatCard({ title, items }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {items.map((item) => (
                    <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">{item._id}</span>
                        <span className="text-sm font-semibold text-slate-800">{item.count}</span>
                    </div>
                ))}
            </CardContent>
        </Card>
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


    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                <Input
                    placeholder="Search tickets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4 max-w-sm"
                />
                {stats && (
                    <div>
                        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">Overview</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-500">Total Tickets</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-3xl font-bold text-slate-800">{stats.totalTickets}</p>
                                </CardContent>
                            </Card>
                            <StatCard title="By Status" items={stats.byStatus} />
                            <StatCard title="By Priority" items={stats.byPriority} />
                            <StatCard title="By Category" items={stats.byCategory} />
                        </div>

                    </div>
                )}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800">All Tickets</h2>
                            <p className="text-sm text-slate-500">{filtered.length} of {tickets.length} tickets</p>
                        </div>
                        <div className="flex gap-3">
                            <Select onValueChange={setStatusFilter} defaultValue="All">
                                <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(s => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={setPriorityFilter} defaultValue="All">
                                <SelectTrigger className="w-36"><SelectValue placeholder="Priority" /></SelectTrigger>
                                <SelectContent>
                                    {['All', 'Low', 'Medium', 'High', 'Urgent'].map(p => (
                                        <SelectItem key={p} value={p}>{p}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {loading ? (
                        <p className="text-slate-500">Loading...</p>
                    ) : filtered.length === 0 ? (
                        <Card><CardContent className="py-12 text-center"><p className="text-slate-500">No tickets match the filters.</p></CardContent></Card>
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
                </div>
            </main>
        </div>
    )
}