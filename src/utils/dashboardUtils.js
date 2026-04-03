export function formatCurrency(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function formatShortDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(date) {
  return new Intl.DateTimeFormat("en-IN", { month: "short" }).format(date);
}

export function calculateSummary(transactions = [], profile = {}) {
  let income = 0;
  let expenses = 0;
  let incomeCount = 0;
  let expenseCount = 0;

  transactions.forEach((tx) => {
    const amount = Number(tx.amount || 0);
    if (tx.type === "Income") {
      income += amount;
      incomeCount += 1;
    } else {
      expenses += amount;
      expenseCount += 1;
    }
  });

  const budget = Number(profile.monthlyBudget || 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
  const budgetUsage = budget > 0 ? Math.round((expenses / budget) * 100) : 0;
  const remainingBudget = budget - expenses;

  return {
    income,
    expenses,
    balance,
    savingsRate,
    budget,
    budgetUsage,
    remainingBudget,
    incomeCount,
    expenseCount,
  };
}

export function buildMonthlyTrend(transactions = [], months = 6) {
  const now = new Date();
  const data = [];
  let runningBalance = 0;

  for (let i = months - 1; i >= 0; i -= 1) {
    const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = monthKey(ref);

    const monthTransactions = transactions.filter((tx) => {
      const txDate = new Date(tx.date);
      return monthKey(txDate) === key;
    });

    const income = monthTransactions
      .filter((tx) => tx.type === "Income")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    const expense = monthTransactions
      .filter((tx) => tx.type === "Expense")
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    runningBalance += income - expense;

    data.push({
      month: monthLabel(ref),
      income,
      expense,
      balance: runningBalance,
    });
  }

  return data;
}

export function buildSpendingBreakdown(transactions = []) {
  const categoryMap = new Map();

  transactions
    .filter((tx) => tx.type === "Expense")
    .forEach((tx) => {
      const current = categoryMap.get(tx.category) || 0;
      categoryMap.set(tx.category, current + Number(tx.amount || 0));
    });

  return [...categoryMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

export function getCategories(transactions = []) {
  return [...new Set(transactions.map((tx) => tx.category))].filter(Boolean).sort();
}

export function applyFiltersAndSort(
  transactions = [],
  { search = "", typeFilter = "All", categoryFilter = "All", sortBy = "Newest" } = {}
) {
  let list = [...transactions];

  const query = search.trim().toLowerCase();
  if (query) {
    list = list.filter((tx) => {
      const haystack = `${tx.title} ${tx.category} ${tx.note || ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  if (typeFilter !== "All") {
    list = list.filter((tx) => tx.type === typeFilter);
  }

  if (categoryFilter !== "All") {
    list = list.filter((tx) => tx.category === categoryFilter);
  }

  list.sort((a, b) => {
    const dateDiff = new Date(a.date) - new Date(b.date);
    const amountDiff = Number(a.amount || 0) - Number(b.amount || 0);

    switch (sortBy) {
      case "Oldest":
        return dateDiff;
      case "Amount High":
        return -amountDiff;
      case "Amount Low":
        return amountDiff;
      case "Category A-Z":
        return String(a.category).localeCompare(String(b.category));
      case "Newest":
      default:
        return -dateDiff;
    }
  });

  return list;
}

export function buildInsights(transactions = [], profile = {}) {
  const currency = profile.currency || "INR";
  const summary = calculateSummary(transactions, profile);
  const breakdown = buildSpendingBreakdown(transactions);
  const trend = buildMonthlyTrend(transactions, 6);

  const topCategory = breakdown[0];
  const currentMonth = trend[trend.length - 1] || { expense: 0 };
  const previousMonth = trend[trend.length - 2] || { expense: 0 };

  const delta =
    previousMonth.expense > 0
      ? ((currentMonth.expense - previousMonth.expense) / previousMonth.expense) * 100
      : 0;

  return [
    {
      title: "Highest spending category",
      value: topCategory
        ? `${topCategory.name} · ${formatCurrency(topCategory.value, currency)}`
        : "No expense data yet",
      detail: topCategory
        ? "This category takes the biggest share of your expenses."
        : "Add transactions to see spending patterns.",
    },
    {
      title: "Monthly comparison",
      value:
        previousMonth.expense > 0
          ? `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`
          : "Not enough data",
      detail:
        previousMonth.expense > 0
          ? delta >= 0
            ? "Spending increased versus last month."
            : "Spending decreased versus last month."
          : "Need at least two months of data.",
    },
    {
      title: "Budget watch",
      value: `${summary.budgetUsage}% used`,
      detail:
        summary.budget > 0
          ? summary.expenses > summary.budget
            ? "You are over budget."
            : "You are within budget."
          : "Add a monthly budget in the profile.",
    },
    {
      title: "Savings rate",
      value: `${summary.savingsRate}%`,
      detail:
        summary.balance >= 0
          ? "Positive net savings this period."
          : "Expenses are higher than income.",
    },
  ];
}