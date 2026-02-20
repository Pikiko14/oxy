import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import oxyLogo from "../assets/logo.png";
import { brandColors } from "../theme";

function AuthLayout({
  title,
  subtitle,
  children,
  logoSrc = oxyLogo,
  logoAlt = "Logo OXY",
  logoFullWidth = false,
  titleColor = "text.primary",
  subtitleColor = "text.secondary",
}) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -140,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brandColors.oxyBlue}33, ${brandColors.oxyBlue}00)`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -180,
          left: -160,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${brandColors.oxyRed}22, ${brandColors.oxyRed}00)`,
        }}
      />

      <Container maxWidth={false} sx={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            border: "1px solid",
            borderColor: "divider",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255,255,255,0.82)",
            boxShadow: "0px 24px 50px rgba(15,23,42,0.08)",
            width: "100%",
          }}
        >
          <Stack spacing={2.25}>
            {logoFullWidth ? (
              <Box
                component="img"
                src={logoSrc}
                alt={logoAlt}
                sx={{
                  width: "100%",
                  maxHeight: 92,
                  objectFit: "contain",
                  objectPosition: "left center",
                  mb: 0.5,
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0px 8px 18px rgba(15, 23, 42, 0.12)",
                }}
              >
                <Box
                  component="img"
                  src={logoSrc}
                  alt={logoAlt}
                  sx={{
                    width: 56,
                    height: 56,
                    objectFit: "contain",
                  }}
                />
              </Box>
            )}
            <Box>
              <Typography component="h1" variant="h4" sx={{ color: titleColor }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: subtitleColor }}>
                {subtitle}
              </Typography>
            </Box>
            {children}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default AuthLayout;
