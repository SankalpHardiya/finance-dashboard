import { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function AdminDash({ clients, setClients }) {

  console.log("ADMIN DASH OPENED");

  // ---------------- STATE ----------------
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    monthlyIncome: "",
    monthlyBudget: "",
  });

  // ---------------- METRICS ----------------
  const totalUsers = clients.length;

  const avgIncome =
    clients.length > 0
      ? Math.round(
          clients.reduce((acc, c) => acc + Number(c.monthlyIncome), 0) /
            clients.length
        )
      : 0;

  const avgBudget =
    clients.length > 0
      ? Math.round(
          clients.reduce((acc, c) => acc + Number(c.monthlyBudget), 0) /
            clients.length
        )
      : 0;

  // ---------------- MOCK ANALYTICS ----------------
  const analyticsData = [
    { month: "Jan", users: 2 },
    { month: "Feb", users: 3 },
    { month: "Mar", users: clients.length },
  ];

  // ---------------- CRUD ----------------

  const handleOpen = () => {
    setForm({
      name: "",
      email: "",
      monthlyIncome: "",
      monthlyBudget: "",
    });
    setEditId(null);
    setOpen(true);
  };

  const handleEdit = (client) => {
    setForm(client);
    setEditId(client.id);
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;

    if (editId) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === editId ? { ...form, id: editId } : c
        )
      );
    } else {
      setClients((prev) => [
        ...prev,
        { ...form, id: Date.now().toString() },
      ]);
    }

    setOpen(false);
  };

  const handleDelete = (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // ---------------- UI ----------------

  return (
    <Container sx={{ mt: 4 }}>

      {/* HEADER */}
      <Typography variant="h4" sx={{ mb: 1 }}>
        Admin Dashboard
      </Typography>

      <Typography sx={{ mb: 3, color: "gray" }}>
        Manage users, view analytics, and control system data
      </Typography>

      {/* METRICS */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography>Total Users</Typography>
            <Typography variant="h5">{totalUsers}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography>Avg Income</Typography>
            <Typography variant="h5">₹{avgIncome}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography>Avg Budget</Typography>
            <Typography variant="h5">₹{avgBudget}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* CHART */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6">User Growth</Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData}>
            <XAxis dataKey="month" stroke="#9ca3af" />
    <YAxis stroke="#9ca3af" />
            <Tooltip />
         <Bar dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* CLIENT TABLE */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Clients</Typography>
          <Button variant="contained" onClick={handleOpen}>
            Add Client
          </Button>
        </Stack>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Income</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {clients.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>₹{c.monthlyIncome}</TableCell>
                <TableCell>₹{c.monthlyBudget}</TableCell>

                <TableCell>
                  <Button size="small" onClick={() => handleEdit(c)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editId ? "Edit Client" : "Add Client"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <TextField
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <TextField
              label="Income"
              type="number"
              value={form.monthlyIncome}
              onChange={(e) =>
                setForm({
                  ...form,
                  monthlyIncome: e.target.value,
                })
              }
            />

            <TextField
              label="Budget"
              type="number"
              value={form.monthlyBudget}
              onChange={(e) =>
                setForm({
                  ...form,
                  monthlyBudget: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default AdminDash;