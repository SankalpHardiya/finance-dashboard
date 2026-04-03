import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";
import ClientDash from "./pages/ClientDash";
import AdminDash from "./pages/AdminDash";

import data from "./data/mockData.json";

function App() {

  const [role, setRole] = useState("viewer");

  const [darkMode, setDarkMode] = useState(true);

  // ✅ CLIENTS FROM JSON
  const [clientsState, setClientsState] = useState(data.clients);

  // ✅ SELECTED CLIENT
  const [selectedClient, setSelectedClient] = useState(data.clients[0]);

  // ✅ TRANSACTIONS FROM JSON
  const [transactionsMap, setTransactionsMap] = useState(data.transactions);

  const transactions = transactionsMap[selectedClient.id] || [];

  const profile = selectedClient;

  // ------------------ THEME ------------------

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#111111" },
          secondary: { main: "#6b7280" },
          background: {
            default: darkMode ? "#0b0b0c" : "#f4f4f5",
            paper: darkMode ? "#111111" : "#ffffff",
          },
          text: {
            primary: darkMode ? "#f5f5f5" : "#111827",
            secondary: darkMode ? "#a3a3a3" : "#6b7280",
          },
        },
        shape: { borderRadius: 16 },
      }),
    [darkMode]
  );

  // ------------------ CRUD ------------------

  const handleAddTransaction = (tx) => {
    setTransactionsMap((prev) => ({
      ...prev,
      [selectedClient.id]: [
        { ...tx, id: Date.now() },
        ...(prev[selectedClient.id] || []),
      ],
    }));
  };

  const handleUpdateTransaction = (tx) => {
    setTransactionsMap((prev) => ({
      ...prev,
      [selectedClient.id]: prev[selectedClient.id].map((item) =>
        item.id === tx.id ? { ...item, ...tx } : item
      ),
    }));
  };

  const handleDeleteTransaction = (id) => {
    setTransactionsMap((prev) => ({
      ...prev,
      [selectedClient.id]: prev[selectedClient.id].filter((item) => item.id !== id),
    }));
  };

  // ------------------ RENDER ------------------

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-shell">

        <Header
          role={role}
          onRoleChange={setRole}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        />

        <main className="app-main">
          <Routes>

            <Route path="/" element={<MainPage />} />

            <Route
              path="/dashboard"
              element={
                <ClientDash
                  role={role}
                  profile={profile}
                  transactions={transactions}

                  onAddTransaction={handleAddTransaction}
                  onUpdateTransaction={handleUpdateTransaction}
                  onDeleteTransaction={handleDeleteTransaction}

                  client={selectedClient}
                  clients={clientsState}
                  setClient={setSelectedClient}
                />
              }
            />

            <Route
              path="/admin"
              element={
                <AdminDash
                  clients={clientsState}
                  setClients={setClientsState}
                />
              }
            />
            

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>

        <Footer />

      </div>
    </ThemeProvider>
  );
}

export default App;