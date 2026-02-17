import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AlternateEmailOutlined from "@mui/icons-material/AlternateEmailOutlined";
import MarkEmailReadOutlined from "@mui/icons-material/MarkEmailReadOutlined";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { requestPasswordReset } from "../mocks/passwordResetService";
import { brandColors } from "../theme";
import oxychemLogoColor from "../assets/OXYCHEM_LOGO_COLOR_RGB.jpg";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetRequest, setResetRequest] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Ingresa un correo electrónico válido.");
      return;
    }

    setEmailError("");
    setSubmitting(true);
    const request = await requestPasswordReset(email);
    setResetRequest(request);
    setSubmitting(false);
  };

  const goToResetForm = () => {
    if (!resetRequest?.token) return;
    navigate(`/reiniciar-password?token=${encodeURIComponent(resetRequest.token)}`);
  };

  return (
    <AuthLayout
      title="Recuperar acceso"
      subtitle="Ingresa tu correo para recibir el enlace de recuperación."
      logoSrc={oxychemLogoColor}
      logoAlt="Logo OXYCHEM color"
      logoFullWidth
      titleColor={brandColors.oxyBlue}
      subtitleColor="text.secondary"
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2.2}>
          {resetRequest && (
            <Alert
              severity="success"
              icon={<MarkEmailReadOutlined fontSize="inherit" />}
              sx={{
                bgcolor: `${brandColors.oceanAqua}14`,
                color: brandColors.midnightBlue,
                border: `1px solid ${brandColors.oceanAqua}55`,
              }}
            >
              Se ha enviado un correo con los datos para cambiar tu contraseña.
            </Alert>
          )}

          <TextField
            fullWidth
            size="small"
            label="Correo electrónico"
            name="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={Boolean(emailError)}
            helperText={emailError || "Usaremos este correo para enviarte el enlace de recuperación."}
            autoComplete="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailOutlined fontSize="small" sx={{ color: brandColors.dayBlue }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={submitting}
          >
            {submitting ? "Enviando..." : "Enviar correo de recuperación"}
          </Button>

          {resetRequest && (
            <Button
              variant="outlined"
              onClick={goToResetForm}
              sx={{
                color: brandColors.oxyRed,
                borderColor: `${brandColors.oxyRed}88`,
                "&:hover": {
                  borderColor: brandColors.oxyRed,
                  bgcolor: `${brandColors.oxyRed}12`,
                },
              }}
            >
              Abrir enlace de correo (mock)
            </Button>
          )}

          <Typography variant="body2" color="text.secondary">
            Flujo mock: el botón anterior simula el enlace recibido por correo.
          </Typography>

          <Box sx={{ textAlign: "right" }}>
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{ color: brandColors.oxyBlue, fontWeight: 600 }}
            >
              Volver a login
            </Link>
          </Box>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
