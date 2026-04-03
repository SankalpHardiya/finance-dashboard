import { Box, Paper, Typography } from "@mui/material";

function FeatureCard({ icon, title, description }) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        p: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 18px 40px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 3,
          display: "grid",
          placeItems: "center",
          mb: 2,
          bgcolor: "action.hover",
          color: "text.primary",
        }}
      >
        {icon}
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
        {description}
      </Typography>
    </Paper>
  );
}

export default FeatureCard;