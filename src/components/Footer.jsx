import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import "./../styles/Footer.css";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        pt: 3,
        pb: 2,
        borderTop: "1px solid",
        borderColor: "divider",
        backgroundColor: "transparent",
      }}
    >
      <Container maxWidth="lg">

        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          {/* LEFT */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, letterSpacing: "0.02em" }}
            >
              Sankalp Hardiya
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary" }}
            >
              Finance Dashboard UI Assignment
            </Typography>
          </Box>

          {/* RIGHT */}
          <Box textAlign={{ xs: "left", md: "right" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              © {new Date().getFullYear()} Zorvyn FinTech Pvt. Ltd.
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "text.secondary", opacity: 0.7 }}
            >
              Built for clarity • Designed for better decisions
            </Typography>
          </Box>
        </Stack>

      </Container>
    </Box>
  );
}

export default Footer;