import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import SavingsRoundedIcon from "@mui/icons-material/SavingsRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import SortRoundedIcon from "@mui/icons-material/SortRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";


import {
  applyFiltersAndSort,
  buildInsights,
  buildMonthlyTrend,
  buildSpendingBreakdown,
  calculateSummary,
  formatCurrency,
  formatShortDate,
  getCategories,
} from "../utils/dashboardUtils";
import "./../styles/ClientDash.css";

const commonCategories = [
  "Salary",
  "Freelance",
  "Bonus",
  "Food",
  "Bills",
  "Travel",
  "Shopping",
  "Health",
  "Entertainment",
  "Education",
  "Savings",
];

const pieColors = ["#6b7280", "#9ca3af", "#d1d5db", "#a8a29e", "#94a3b8", "#14b8a6"];

function buildEmptyTx() {
  return {
    title: "",
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    category: "Food",
    type: "Expense",
    note: "",
  };
}

function buildProfileDraft(profile) {
  return {
    name: profile?.name || "",
    monthlyIncome: String(profile?.monthlyIncome ?? ""),
    monthlyBudget: String(profile?.monthlyBudget ?? ""),
    savingsGoal: String(profile?.savingsGoal ?? ""),
  };
}

function ClientDash({
  role,
  profile,
  transactions,
  onProfileChange,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,

  // ✅ NEW
  client,
  clients,
  setClient
})  {
  const isAdmin = role === "admin";

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [txDialogOpen, setTxDialogOpen] = useState(false);
  const [editingTxId, setEditingTxId] = useState(null);
  const [txDraft, setTxDraft] = useState(buildEmptyTx());

  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState(buildProfileDraft(profile));

  const [snack, setSnack] = useState({ open: false, message: "" });

  const categoryOptions = useMemo(() => {
    const fromData = getCategories(transactions);
    return [...new Set([...commonCategories, ...fromData])];
  }, [transactions]);

  const summary = useMemo(() => calculateSummary(transactions, profile), [transactions, profile]);
  const trendData = useMemo(() => buildMonthlyTrend(transactions), [transactions]);
  const breakdownData = useMemo(() => buildSpendingBreakdown(transactions), [transactions]);
  const insights = useMemo(() => buildInsights(transactions, profile), [transactions, profile]);

  const filteredTransactions = useMemo(
    () =>
      applyFiltersAndSort(transactions, {
        search,
        typeFilter,
        categoryFilter,
        sortBy,
      }),
    [transactions, search, typeFilter, categoryFilter, sortBy]
  );

  const budgetUsage = Math.min(summary.budgetUsage, 100);

  const openAddDialog = () => {
    setEditingTxId(null);
    setTxDraft(buildEmptyTx());
    setTxDialogOpen(true);
  };

  const openEditDialog = (tx) => {
    setEditingTxId(tx.id);
    setTxDraft({
      title: tx.title || "",
      date: tx.date || new Date().toISOString().slice(0, 10),
      amount: String(tx.amount || ""),
      category: tx.category || "Food",
      type: tx.type || "Expense",
      note: tx.note || "",
    });
    setTxDialogOpen(true);
  };

  const handleSaveTransaction = () => {
    const payload = {
      id: editingTxId || `tx-${Date.now()}`,
      title: txDraft.title.trim(),
      date: txDraft.date,
      amount: Number(txDraft.amount),
      category: txDraft.category.trim(),
      type: txDraft.type,
      note: txDraft.note.trim(),
    };

    if (editingTxId) {
      onUpdateTransaction(payload);
      setSnack({ open: true, message: "Transaction updated locally." });
    } else {
      onAddTransaction(payload);
      setSnack({ open: true, message: "Transaction added locally." });
    }

    setTxDialogOpen(false);
  };

  const handleDelete = (tx) => {
    const confirmed = window.confirm(`Delete "${tx.title}" from ${formatShortDate(tx.date)}?`);
    if (!confirmed) return;

    onDeleteTransaction(tx.id);
    setSnack({ open: true, message: "Transaction deleted locally." });
  };

  const openProfileDialog = () => {
    setProfileDraft(buildProfileDraft(profile));
    setProfileDialogOpen(true);
  };

  const handleSaveProfile = () => {
  onProfileChange({
    ...profile,
    name: profileDraft.name.trim() || profile?.name || "",
    monthlyIncome: Number(profileDraft.monthlyIncome) || profile?.monthlyIncome || 0,
    monthlyBudget: Number(profileDraft.monthlyBudget) || profile?.monthlyBudget || 0,
    savingsGoal: Number(profileDraft.savingsGoal) || profile?.savingsGoal || 0,
  });


    setProfileDialogOpen(false);
    setSnack({ open: true, message: "Profile saved locally." });
  };

  const txValid =
    txDraft.title.trim() &&
    txDraft.date &&
    Number(txDraft.amount) > 0 &&
    txDraft.category.trim() &&
    txDraft.type;

  const profileValid =
    profileDraft.name.trim() &&
    Number(profileDraft.monthlyIncome) > 0 &&
    Number(profileDraft.monthlyBudget) > 0 &&
    Number(profileDraft.savingsGoal) >= 0;

  const noTransactions = transactions.length === 0;
  const noFilteredTransactions = filteredTransactions.length === 0;

  const exportToCSV = () => {
  if (!transactions || transactions.length === 0) return;

  const headers = ["Date", "Title", "Category", "Type", "Amount", "Note"];

  const rows = transactions.map((tx) => [
    tx.date,
    tx.title,
    tx.category,
    tx.type,
    tx.amount,
    tx.note || "",
  ]);

  const csvContent =
    [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${profile.name}_transactions.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const [openDialog, setOpenDialog] = useState(false);

const handleOpenAdd = () => {
  setOpenDialog(true);
};

const handleCloseDialog = () => {
  setOpenDialog(false);
};
  return (
    <Container maxWidth="xl" className="dashboard-page">
      <Paper
        elevation={0}
        className="dashboard-hero"
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 5,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Box className="hero-left">
          <Stack spacing={1.2}>
            <Chip
              icon={isAdmin ? <EditRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
              label={isAdmin ? "Admin Mode" : "Viewer Mode"}
              variant="outlined"
              sx={{ width: "fit-content" }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.04em" }}>
              Welcome back, {profile?.name || "user"} 👋
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 820, lineHeight: 1.8 }}>
              Here&apos;s your financial overview. All data is stored locally in the browser.
              Viewer mode is read-only. Admin mode unlocks create, update, and delete actions.
            </Typography>
          </Stack>
        </Box>
{/* 🔥 CLIENT SWITCH */}
<Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
  <Select
    size="small"
    value={client?.id}
    onChange={(e) => {
      const selected = clients.find(c => c.id === e.target.value);
      setClient(selected);
    }}
  >
    {clients.map((c) => (
      <MenuItem key={c.id} value={c.id}>
        {c.name}
      </MenuItem>
    ))}
  </Select>
</Box>
        <Stack spacing={1.5} className="hero-right">
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="flex-start">
            {isAdmin && (
              <Button variant="outlined" onClick={openProfileDialog} startIcon={<EditRoundedIcon />}>
                Edit profile
              </Button>
            )}
          </Stack>

          <Box className="budget-meter">
            <Box className="budget-meter-head">
              <Typography variant="body2" color="text.secondary">
                Budget usage
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {summary.budgetUsage}% used
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={budgetUsage}
              sx={{
                height: 8,
                borderRadius: 999,
                bgcolor: "action.hover",
                "& .MuiLinearProgress-bar": {
                  bgcolor: summary.budgetUsage > 100 ? "error.main" : "success.main",
                },
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {summary.remainingBudget >= 0
                ? `${formatCurrency(summary.remainingBudget, profile?.currency)} left in the budget`
                : `${formatCurrency(Math.abs(summary.remainingBudget), profile?.currency)} over budget`}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Grid container spacing={3} className="summary-grid">
        {[
          {
            label: "Total Balance",
            value: formatCurrency(summary.balance, profile?.currency),
            helper: summary.balance >= 0 ? "Net positive" : "Net negative",
            icon: <AccountBalanceWalletRoundedIcon />,
          },
          {
            label: "Income",
            value: formatCurrency(summary.income, profile?.currency),
            helper: `${summary.incomeCount} income entries`,
            icon: <PaidRoundedIcon />,
          },
          {
            label: "Expenses",
            value: formatCurrency(summary.expenses, profile?.currency),
            helper: `${summary.expenseCount} expense entries`,
            icon: <TrendingDownRoundedIcon />,
          },
          {
            label: "Savings Rate",
            value: `${summary.savingsRate}%`,
            helper: `Budget used ${summary.budgetUsage}%`,
            icon: <SavingsRoundedIcon />,
          },
        ].map((item) => (
          <Grid item xs={12} sm={6} lg={3} key={item.label}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                p: 5,
                borderRadius: 4,
                border: "2px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
              }}
            >
              <Box className="summary-card">
                <Box className="summary-top">
                  <Box>
                    <Typography variant="overline" className="summary-label">
                      {item.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                      {item.value}
                    </Typography>
                  </Box>
                  <Box className="summary-icon">{item.icon}</Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.helper}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} className="chart-grid">
        <Grid item xs={12} lg={8}>
          <Paper
            elevation={0}
            className="panel-card"
            sx={{
              width:900,
              p: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Balance Over Time
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Track how your balance changes across the last six months.
            </Typography>

            {noTransactions ? (
              <Box className="empty-state">
                <ReceiptLongRoundedIcon sx={{ fontSize: 42, color: "text.disabled", mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No transaction data available yet.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="balance" stroke="#6b7280" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            className="panel-card"
            sx={{
              width:500,
              p: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Spending Breakdown
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Category-wise distribution of expenses.
            </Typography>

            {breakdownData.length === 0 ? (
              <Box className="empty-state">
                <Typography variant="body2" color="text.secondary">
                  No expense data available yet.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={82}
                      outerRadius={126}
                      paddingAngle={3}
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell key={`${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={42} />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* 🔥 EXTRA CHARTS */}

<Grid container spacing={3} className="chart-grid" sx={{ mt: 1 }}>

  {/* BAR CHART */}
  <Grid item xs={12} md={6}>
    <Paper sx={{ 
      width:800,
      p: 3,

       borderRadius: 4 }}>
      <Typography variant="h6">Income vs Expense</Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={trendData}>
          <XAxis dataKey="month" />
          <YAxis />
          <RechartsTooltip />
          <Bar dataKey="income" fill="#7af57e" />
          <Bar dataKey="expense" fill="#f44336" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  </Grid>

  {/* AREA CHART */}
  <Grid item xs={12} md={6}>
    <Paper sx={{ 
      width:590,
      p: 3, borderRadius: 4 }}>
      <Typography variant="h6">Balance Flow</Typography>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={trendData}>
          <XAxis dataKey="month" />
          <YAxis />
          <RechartsTooltip />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#6366f1"
            fill="#6366f1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Paper>
  </Grid>

</Grid>

      <Box className="section-block">
        <Typography variant="h5" className="section-title">
          Key Insights
        </Typography>

        <Grid container spacing={2}>
          {insights.map((item) => (
            <Grid item xs={12} md={6} lg={3} key={item.title}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 2.5,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  backgroundColor: "background.paper",
                }}
              >
                <Typography variant="overline" sx={{ letterSpacing: "0.08em" }}>
                  {item.title}
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.7, fontWeight: 800 }}>
                  {item.value}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "text.secondary", lineHeight: 1.7 }}>
                  {item.detail}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box className="section-block">
        <Box className="transactions-header">
          <Box>
            <Typography variant="h5" className="section-title">
              Recent Transactions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredTransactions.length} records shown from {transactions.length} total.
            </Typography>
          </Box>

          {isAdmin && (
    <Button
      variant="contained"
      startIcon={<AddRoundedIcon />}
      onClick={handleOpenAdd}
      
    >
      <Dialog open={openDialog} onClose={handleCloseDialog}></Dialog>
      Add Transaction
    </Button>
  )}

  {/* ✅ EXPORT BUTTON */}
  <Button
  variant="outlined"
  onClick={exportToCSV}
  sx={{
    textTransform: "none",
    borderColor: "#6366f1",
    color: "#6366f1",
    fontWeight: 500,
    "&:hover": {
      borderColor: "#4f46e5",
      backgroundColor: "rgba(99,102,241,0.08)",
    },
  }}
>
  Export CSV
</Button>
          
        </Box>

        <Paper
          elevation={0}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Box className="transactions-toolbar">
            <TextField
              className="toolbar-search"
              size="small"
              fullWidth
              placeholder="Search title, category, or note"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" fullWidth>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <FilterAltRoundedIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Income">Income</MenuItem>
                <MenuItem value="Expense">Expense</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <FilterAltRoundedIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="All">All Categories</MenuItem>
                {categoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <SortRoundedIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="Newest">Newest</MenuItem>
                <MenuItem value="Oldest">Oldest</MenuItem>
                <MenuItem value="Amount High">Amount: High to Low</MenuItem>
                <MenuItem value="Amount Low">Amount: Low to High</MenuItem>
                <MenuItem value="Category A-Z">Category A-Z</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box className="table-scroll">
            {noTransactions ? (
              <Box className="empty-state">
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No transactions available yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Data will appear here once added.
                </Typography>
                {isAdmin && (
                  <Button sx={{ mt: 2 }} variant="outlined" startIcon={<AddRoundedIcon />} onClick={openAddDialog}>
                    Add first transaction
                  </Button>
                )}
              </Box>
            ) : noFilteredTransactions ? (
              <Box className="empty-state">
                <Typography variant="h6" sx={{ mb: 1 }}>
                  No matching transactions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try a different search, filter, or sort option.
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Type</TableCell>
                      {isAdmin && <TableCell align="right">Actions</TableCell>}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell>{formatShortDate(tx.date)}</TableCell>
                        <TableCell>
                          <Typography sx={{ fontWeight: 700 }}>{tx.title}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {tx.note || "—"}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="right"
                          className={tx.type === "Income" ? "amount-income" : "amount-expense"}
                        >
                          {formatCurrency(tx.type === "Income" ? tx.amount : -tx.amount, profile?.currency)}
                        </TableCell>
                        <TableCell>{tx.category}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={tx.type}
                            variant="outlined"
                            color={tx.type === "Income" ? "success" : "default"}
                          />
                        </TableCell>
                        {isAdmin && (
                          <TableCell align="right">
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <IconButton size="small" onClick={() => openEditDialog(tx)}>
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => handleDelete(tx)}>
                                <DeleteOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </Paper>
      </Box>

      <Dialog open={txDialogOpen} onClose={() => setTxDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingTxId ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Title"
              value={txDraft.title}
              onChange={(e) => setTxDraft((prev) => ({ ...prev, title: e.target.value }))}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  type="date"
                  value={txDraft.date}
                  onChange={(e) => setTxDraft((prev) => ({ ...prev, date: e.target.value }))}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Amount"
                  type="number"
                  value={txDraft.amount}
                  onChange={(e) => setTxDraft((prev) => ({ ...prev, amount: e.target.value }))}
                  fullWidth
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Category"
                  select
                  value={txDraft.category}
                  onChange={(e) => setTxDraft((prev) => ({ ...prev, category: e.target.value }))}
                  fullWidth
                >
                  {commonCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Type"
                  select
                  value={txDraft.type}
                  onChange={(e) => setTxDraft((prev) => ({ ...prev, type: e.target.value }))}
                  fullWidth
                >
                  <MenuItem value="Income">Income</MenuItem>
                  <MenuItem value="Expense">Expense</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <TextField
              label="Note"
              value={txDraft.note}
              onChange={(e) => setTxDraft((prev) => ({ ...prev, note: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTxDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveTransaction} disabled={!txValid}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Client Profile</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Client Name"
              value={profileDraft.name}
              onChange={(e) => setProfileDraft((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Monthly Income"
              type="number"
              value={profileDraft.monthlyIncome}
              onChange={(e) =>
                setProfileDraft((prev) => ({ ...prev, monthlyIncome: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Monthly Budget"
              type="number"
              value={profileDraft.monthlyBudget}
              onChange={(e) =>
                setProfileDraft((prev) => ({ ...prev, monthlyBudget: e.target.value }))
              }
              fullWidth
            />
            <TextField
              label="Savings Goal"
              type="number"
              value={profileDraft.savingsGoal}
              onChange={(e) =>
                setProfileDraft((prev) => ({ ...prev, savingsGoal: e.target.value }))
              }
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProfile} disabled={!profileValid}>
            Save Profile
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={2200}
        onClose={() => setSnack({ open: false, message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnack({ open: false, message: "" })}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Container>
  );

}

export default ClientDash;