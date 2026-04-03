import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import ManageAccountsRoundedIcon from "@mui/icons-material/ManageAccountsRounded";
import SummarizeRoundedIcon from "@mui/icons-material/SummarizeRounded";
import FeatureCard from "../components/FeatureCard";
import "./../styles/MainPage.css";

const featureItems = [
  {
    icon: <SummarizeRoundedIcon fontSize="small" />,
    title: "Dashboard Overview",
    description: "Summary cards for balance, income, expenses, and savings rate.",
  },
  {
    icon: <InsightsRoundedIcon fontSize="small" />,
    title: "Charts and Trends",
    description: "A balance trend chart and a category-based spending breakdown.",
  },
  {
    icon: <ReceiptLongRoundedIcon fontSize="small" />,
    title: "Transactions Control",
    description: "Search, filter, sort, and review transactions in one place.",
  },
  {
    icon: <ManageAccountsRoundedIcon fontSize="small" />,
    title: "Role Based UI",
    description: "Viewer is read-only. Admin can create, update, and delete.",
  },
];

const steps = [
  {
    title: "Pick a role",
    text: "Switch between Viewer and Admin mode using the header.",
  },
  {
    title: "Understand data",
    text: "Review charts, insights, and financial summary clearly.",
  },
  {
    title: "Manage records",
    text: "Admin mode allows creating and editing transactions.",
  },
];

function MainPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" className="main-page">

      {/* 🔥 HERO (NO CARD LOOK) */}
      <Box sx={{ py: 8 }}>
        <Stack spacing={3}>
          <Chip label="Finance Dashboard UI" sx={{ width: "fit-content" }} />

          <Typography variant="h2" sx={{ fontWeight: 800 }}>
            Take Control of Your Financial Clarity
          </Typography>

          <Typography sx={{ maxWidth: 700, color: "text.secondary" }}>
            A clean and minimal dashboard to track income, monitor expenses,
            and gain meaningful insights into your financial habits.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              onClick={() => navigate("/dashboard")}
              startIcon={<DashboardRoundedIcon />}
            >
              Go to Dashboard
            </Button>

            <Button
  variant="outlined"
  onClick={() => navigate("/dashboard")}
  startIcon={<InsightsRoundedIcon />}
  sx={{
    textTransform: "none",
    borderColor: "text.primary",
    color: "text.primary",
    fontWeight: 500,
    "&:hover": {
      borderColor: "text.primary",
      backgroundColor: "action.hover",
    },
  }}
>
  View Demo
</Button>
          </Stack>
        </Stack>
      </Box>

      {/* 🔥 WHY SECTION */}
      <Box sx={{ py: 6 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Why this dashboard?
        </Typography>

        <Typography sx={{ color: "text.secondary", maxWidth: 800 }}>
          Managing finance should feel simple. This dashboard highlights the
          most important information first, followed by transactions, insights,
          and role-based actions — all in a clean and readable layout.
        </Typography>
      </Box>

      {/* 🔥 FEATURES (ONLY CARDS HERE) */}
      <Box sx={{ py: 6 }}>
        <Grid container spacing={3}>
          {featureItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <FeatureCard {...item} />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 🔥 HOW IT WORKS (SOFT BG STRIP) */}
      <Box sx={{ py: 6, px: 3, borderRadius: 4,  border: "1px solid",
    borderColor: "divider", }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          How it works
        </Typography>

        <Grid container spacing={3}>
          {steps.map((step) => (
            <Grid item xs={12} md={4} key={step.title}>
              <Box>
                <Typography variant="h6">{step.title}</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  {step.text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 🔥 CTA SECTION */}
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Ready to explore your dashboard?
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/dashboard")}
        >
          Open Dashboard
        </Button>
      </Box>

      {/* 🔥 DISCLAIMER (MINIMAL) */}
      <Typography
        variant="caption"
        sx={{ display: "block", textAlign: "center", pb: 4 }}
      >
        All data is mocked and stored locally. No backend integration.
      </Typography>

    </Container>
  );
}

export default MainPage;