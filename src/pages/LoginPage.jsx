import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AlternateEmailOutlined from "@mui/icons-material/AlternateEmailOutlined";
import LoginIcon from "@mui/icons-material/Login";
import LockOutlined from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { isAuthenticated, loginMock } from "../mocks/authService";
import { brandColors } from "../theme";
import oxychemLogoColor from "../assets/OXYCHEM_LOGO_COLOR_RGB.jpg";

function LoginPage() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    rememberSession: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formValues.email)) {
      errors.email = "Ingresa un correo electrónico válido.";
    }

    if (formValues.password.length < 8) {
      errors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    await loginMock(formValues);
    setSubmitting(false);
    setMessage("Inicio de sesión correcto.");
    navigate("/dashboard", { replace: true });
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <AuthLayout
      title="Bienvenido"
      subtitle="Accede con tus credenciales para continuar."
      logoSrc={oxychemLogoColor}
      logoAlt="Logo OXYCHEM color"
      logoFullWidth
      titleColor={brandColors.oxyBlue}
      subtitleColor="text.secondary"
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2.2}>
          {message && <Alert severity="success">{message}</Alert>}
          <TextField
            fullWidth
            size="small"
            label="Correo electrónico"
            name="email"
            type="email"
            required
            value={formValues.email}
            onChange={handleChange}
            error={Boolean(formErrors.email)}
            helperText={formErrors.email}
            autoComplete="email"
            sx={{
              "& .MuiInputLabel-root": { color: brandColors.oxyBlue },
              "& .MuiInputLabel-root.Mui-focused": { color: brandColors.oxyBlue },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailOutlined fontSize="small" sx={{ color: brandColors.dayBlue }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            size="small"
            label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            value={formValues.password}
            onChange={handleChange}
            error={Boolean(formErrors.password)}
            helperText={formErrors.password}
            autoComplete="current-password"
            sx={{
              "& .MuiInputLabel-root": { color: brandColors.oxyBlue },
              "& .MuiInputLabel-root.Mui-focused": { color: brandColors.oxyBlue },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined fontSize="small" sx={{ color: brandColors.dayBlue }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="mostrar u ocultar contraseña"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            sx={{ "& .MuiFormControlLabel-label": { color: brandColors.oxyBlue } }}
            control={
              <Checkbox
                name="rememberSession"
                checked={formValues.rememberSession}
                onChange={handleChange}
                sx={{
                  color: brandColors.dayBlue,
                  "&.Mui-checked": { color: brandColors.oxyBlue },
                }}
              />
            }
            label="Recordar sesión en este equipo"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<LoginIcon />}
            disabled={submitting}
          >
            Entrar
          </Button>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Gestiona tu acceso
            </Typography>
            <Link
              component={RouterLink}
              to="/recuperar-password"
              underline="hover"
              sx={{ color: brandColors.oxyBlue, fontWeight: 600 }}
            >
              Olvidé mi contraseña
            </Link>
          </Stack>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default LoginPage;
