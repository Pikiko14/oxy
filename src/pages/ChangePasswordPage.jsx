import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LockOutlined from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import {
  completePasswordReset,
  validatePasswordResetToken,
} from "../mocks/passwordResetService";
import { brandColors } from "../theme";
import oxychemLogoColor from "../assets/OXYCHEM_LOGO_COLOR_RGB.jpg";

function ChangePasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [formValues, setFormValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", severity: "success" });
  const [tokenState, setTokenState] = useState({
    loading: true,
    valid: false,
    reason: "",
    email: "",
  });

  useEffect(() => {
    let isMounted = true;
    const checkToken = async () => {
      if (!token) {
        if (!isMounted) return;
        setTokenState({ loading: false, valid: false, reason: "invalid", email: "" });
        return;
      }

      const result = await validatePasswordResetToken(token);
      if (!isMounted) return;
      setTokenState({
        loading: false,
        valid: result.valid,
        reason: result.reason,
        email: result.email,
      });
    };

    checkToken();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const validateForm = () => {
    const errors = {};
    const strongPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    if (!strongPassword.test(formValues.newPassword)) {
      errors.newPassword = "Usa al menos 8 caracteres incluyendo letras y numeros.";
    }

    if (formValues.newPassword !== formValues.confirmPassword) {
      errors.confirmPassword = "Las contraseñas nuevas no coinciden.";
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage({ text: "", severity: "success" });
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    const result = await completePasswordReset({
      token,
      newPassword: formValues.newPassword,
    });
    setSubmitting(false);

    if (!result.ok) {
      setMessage({ text: result.message, severity: "error" });
      return;
    }

    setMessage({ text: "Contraseña actualizada correctamente.", severity: "success" });
    setTokenState((prev) => ({ ...prev, valid: false, reason: "used" }));
  };

  const tokenReasonText = {
    invalid: "El enlace no es válido. Solicita una nueva recuperación.",
    expired: "El enlace caduco. Solicita uno nuevo para continuar.",
    used: "Este enlace ya fue utilizado. Solicita uno nuevo si lo necesitas.",
  };

  return (
    <AuthLayout
      title="Crear nueva contraseña"
      subtitle="Define una nueva clave para recuperar el acceso a tu cuenta."
      logoSrc={oxychemLogoColor}
      logoAlt="Logo OXYCHEM color"
      logoFullWidth
      titleColor={brandColors.oxyBlue}
      subtitleColor="text.secondary"
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2.2}>
          {tokenState.loading && <Typography variant="body2">Validando enlace...</Typography>}

          {!tokenState.loading && !tokenState.valid && (
            <Alert severity="error">{tokenReasonText[tokenState.reason] || tokenReasonText.invalid}</Alert>
          )}

          {message.text && <Alert severity={message.severity}>{message.text}</Alert>}

          {!tokenState.loading && tokenState.valid && (
            <Typography variant="body2" color="text.secondary">
              Correo asociado: {tokenState.email}
            </Typography>
          )}

          <TextField
            fullWidth
            size="small"
            label="Nueva contraseña"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            required
            disabled={!tokenState.valid || submitting}
            value={formValues.newPassword}
            onChange={handleChange}
            error={Boolean(formErrors.newPassword)}
            helperText={formErrors.newPassword}
            autoComplete="new-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="mostrar u ocultar nueva contraseña"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            size="small"
            label="Confirmar nueva contraseña"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
            disabled={!tokenState.valid || submitting}
            value={formValues.confirmPassword}
            onChange={handleChange}
            error={Boolean(formErrors.confirmPassword)}
            helperText={formErrors.confirmPassword}
            autoComplete="new-password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="mostrar u ocultar confirmación de contraseña"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            disabled={!tokenState.valid || submitting}
          >
            Guardar cambios
          </Button>

          <Box sx={{ textAlign: "right" }}>
            {!tokenState.valid ? (
              <Link component={RouterLink} to="/recuperar-password" underline="hover">
                Solicitar nuevo correo
              </Link>
            ) : (
              <Link component={RouterLink} to="/login" underline="hover">
                Volver a login
              </Link>
            )}
          </Box>
        </Stack>
      </Box>
    </AuthLayout>
  );
}

export default ChangePasswordPage;
