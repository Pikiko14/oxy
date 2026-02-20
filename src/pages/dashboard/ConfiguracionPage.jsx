import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Save from "@mui/icons-material/Save";
import { brandColors } from "../../theme";

const parametrosNegocio = [
  { id: "umbral_peso", label: "Umbral de Peso Máximo (kg)", value: "12000", tipo: "number" },
  { id: "tiempo_espera", label: "Tiempo de Espera Máximo (min)", value: "120", tipo: "number" },
  { id: "dias_vencimiento", label: "Días para Vencimiento de Documentos", value: "30", tipo: "number" },
];

const reglasSistema = [
  { id: "validar_peso", label: "Validar peso automáticamente", enabled: true },
  { id: "notificar_retrasos", label: "Notificar retrasos automáticamente", enabled: true },
  { id: "bloquear_sin_documentos", label: "Bloquear sin documentos completos", enabled: false },
];

function ConfiguracionPage() {
  const [parametros, setParametros] = useState(parametrosNegocio);
  const [reglas, setReglas] = useState(reglasSistema);

  const handleParametroChange = (id, value) => {
    setParametros((prev) => prev.map((p) => (p.id === id ? { ...p, value } : p)));
  };

  const handleReglaChange = (id) => {
    setReglas((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleSave = () => {
    console.log("Guardar configuración:", { parametros, reglas });
  };

  return (
    <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
      <Stack spacing={2.4}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Configuración del Sistema
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestiona parámetros de negocio, flujos y reglas del sistema
          </Typography>
        </Box>

        <Grid container spacing={2.4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.4 }}>
                  <Settings sx={{ color: brandColors.oxyBlue }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Parámetros de Negocio
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  {parametros.map((param) => (
                    <TextField
                      key={param.id}
                      size="small"
                      label={param.label}
                      type={param.tipo}
                      value={param.value}
                      onChange={(event) => handleParametroChange(param.id, event.target.value)}
                      fullWidth
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.4 }}>
                  <Settings sx={{ color: brandColors.oxyBlue }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Reglas del Sistema
                  </Typography>
                </Stack>
                <Stack spacing={1.5}>
                  {reglas.map((regla) => (
                    <Box key={regla.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2">{regla.label}</Typography>
                      <Switch checked={regla.enabled} onChange={() => handleReglaChange(regla.id)} color="primary" />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSave} size="small" sx={{ alignSelf: "flex-start" }}>
          Guardar Configuración
        </Button>
      </Stack>
    </Paper>
  );
}

export default ConfiguracionPage;
