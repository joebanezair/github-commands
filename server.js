const express = require('express');

const app = express();
app.use(express.json());

let tickets = [
  { id: 1, title: 'Password reset', customer: 'Northwind', priority: 'medium', status: 'open', resolutionMinutes: null },
  { id: 2, title: 'Email sync failure', customer: 'Contoso', priority: 'high', status: 'resolved', resolutionMinutes: 42 },
  { id: 3, title: 'Printer offline', customer: 'Fabrikam', priority: 'low', status: 'resolved', resolutionMinutes: 18 }
];

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'supportops-api' }));

app.get('/tickets', (req, res) => {
  const { priority, status } = req.query;
  let result = tickets;
  if (priority) result = result.filter(t => t.priority === priority.toLowerCase());
  if (status) result = result.filter(t => t.status === status.toLowerCase());
  res.json({ count: result.length, tickets: result });
});

app.post('/tickets', (req, res) => {
  const { title, customer, priority = 'medium' } = req.body;
  if (!title || !customer) return res.status(400).json({ error: 'title and customer are required' });

  const allowedPriorities = ['low', 'medium', 'high', 'critical'];
  if (!allowedPriorities.includes(priority.toLowerCase())) {
    return res.status(400).json({ error: 'priority must be low, medium, high, or critical' });
  }

  const ticket = {
    id: tickets.length ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
    title,
    customer,
    priority: priority.toLowerCase(),
    status: 'open',
    resolutionMinutes: null
  };
  tickets.push(ticket);
  res.status(201).json(ticket);
});

app.patch('/tickets/:id/status', (req, res) => {
  const ticket = tickets.find(t => t.id === Number(req.params.id));
  if (!ticket) return res.status(404).json({ error: 'ticket not found' });

  const { status, resolutionMinutes } = req.body;
  const allowedStatuses = ['open', 'in-progress', 'resolved'];
  if (!allowedStatuses.includes(status)) return res.status(400).json({ error: 'invalid status' });

  ticket.status = status;
  if (status === 'resolved' && Number.isFinite(resolutionMinutes)) {
    ticket.resolutionMinutes = resolutionMinutes;
  }
  res.json(ticket);
});

app.get('/metrics', (_req, res) => {
  const resolved = tickets.filter(t => t.status === 'resolved' && Number.isFinite(t.resolutionMinutes));
  const averageResolutionMinutes = resolved.length
    ? Number((resolved.reduce((sum, t) => sum + t.resolutionMinutes, 0) / resolved.length).toFixed(1))
    : 0;

  res.json({
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    highPriorityTickets: tickets.filter(t => ['high', 'critical'].includes(t.priority)).length,
    averageResolutionMinutes
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`SupportOps API running on port ${port}`));
