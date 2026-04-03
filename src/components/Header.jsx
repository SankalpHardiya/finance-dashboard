import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import "./../styles/Header.css";

function Header({ role, onRoleChange, darkMode, onToggleDarkMode }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (role) => {
    onRoleChange(role.toLowerCase());

    if (role === "Admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }

    handleClose();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="default"
      sx={{
        backgroundColor: "background.default",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(14px)",
      }}
      className="header-bar"
    >
      <Toolbar className="header-toolbar">
        <Box
          className="header-brand"
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
        >
          <Box className="brand-mark">
            <DashboardRoundedIcon fontSize="small" />
          </Box>

          <Box className="brand-copy">
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, lineHeight: 1.1 }}
            >
              FinDash
            </Typography>
          </Box>
        </Box>

        <Box className="header-actions">
          <Tooltip
            title={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <IconButton onClick={onToggleDarkMode} size="small">
              {darkMode ? (
                <LightModeRoundedIcon fontSize="small" />
              ) : (
                <DarkModeRoundedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* ROLE CHIP */}
          <Chip
            label={role === "admin" ? "Admin Mode" : "Viewer Mode"}
            size="small"
            variant="outlined"
            className={
              role === "admin"
                ? "role-chip role-chip-admin"
                : "role-chip role-chip-viewer"
            }
            sx={{
              borderColor: role === "admin" ? "#6366f1" : "divider",
              color: role === "admin" ? "#6366f1" : "text.primary",
              fontWeight: 500,
            }}
          />

          {/* SWITCH BUTTON (FIXED COLORS) */}
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpen}
            endIcon={<KeyboardArrowDownRoundedIcon />}
            sx={{
              textTransform: "none",
              borderColor: "#6366f1",
              color: "#6366f1",
              fontWeight: 500,
              px: 2,
              "&:hover": {
                borderColor: "#4f46e5",
                backgroundColor: "rgba(99,102,241,0.08)",
              },
            }}
          >
            Switch Role
          </Button>

          {/* MENU */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              sx: {
                mt: 1,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
              },
            }}
          >
            <MenuItem onClick={() => handleSelect("Admin")}>
              Admin Dashboard
            </MenuItem>

            <MenuItem onClick={() => handleSelect("Client")}>
              Client Dashboard
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;