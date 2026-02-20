import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AssessmentOutlined from "@mui/icons-material/AssessmentOutlined";
import Business from "@mui/icons-material/Business";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Download from "@mui/icons-material/Download";
import { brandColors } from "../../theme";

const tiposReporte = [
  { id: "comercial", label: "Reporte Comercial", icon: <Business />, descripcion: "Análisis de ventas, clientes y facturación" },
  { id: "operativo", label: "Reporte Operativo", icon: <LocalShipping />, descripcion: "Rendimiento operativo y entregas" },
  { id: "auditoria", label: "Reporte de Auditoría", icon: <AssessmentOutlined />, descripcion: "Trazabilidad y cumplimiento normativo" },
];

function ReportesPage() {
  const [tipoReporte, setTipoReporte] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const handleGenerarReporte = () => {
    console.log("Generar reporte:", { tipoReporte, fechaDesde, fechaHasta });
  };

  return (
    <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
      <Stack spacing={2.4}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Reportes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Genera reportes personalizables con campos seleccionables
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ p: 2.4, borderRadius: 2 }}>
          <Stack spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-reporte-label">Tipo de Reporte</InputLabel>
              <Select
                labelId="tipo-reporte-label"
                label="Tipo de Reporte"
                value={tipoReporte}
                onChange={(event) => setTipoReporte(event.target.value)}
              >
                {tiposReporte.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                size="small"
                label="Fecha Desde"
                type="date"
                value={fechaDesde}
                onChange={(event) => setFechaDesde(event.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                size="small"
                label="Fecha Hasta"
                type="date"
                value={fechaHasta}
                onChange={(event) => setFechaHasta(event.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>

            <Button variant="contained" color="primary" startIcon={<Download />} onClick={handleGenerarReporte} size="small" sx={{ alignSelf: "flex-start" }}>
              Generar Reporte
            </Button>
          </Stack>
        </Paper>

        <Grid container spacing={2}>
          {tiposReporte.map((tipo) => (
            <Grid key={tipo.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  transition: "all 200ms ease",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 8px 24px rgba(0, 46, 77, 0.12)",
                    borderColor: brandColors.oxyBlue,
                  },
                }}
                onClick={() => setTipoReporte(tipo.id)}
              >
                <CardContent>
                  <Stack spacing={1.5} alignItems="center" sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        bgcolor: `${brandColors.oxyBlue}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: brandColors.oxyBlue,
                      }}
                    >
                      {tipo.icon}
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brandColors.midnightBlue }}>
                      {tipo.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {tipo.descripcion}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Paper>
  );
}

export default ReportesPage;
