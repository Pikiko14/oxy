import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Build from "@mui/icons-material/Build";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Warning from "@mui/icons-material/Warning";
import { brandColors } from "../../theme";

const camionesData = [
  {
    id: "CAM-001",
    patente: "ABCD12",
    tipo: "Camión Cisterna",
    modelo: "Volvo FH 500",
    año: "2023",
    capacidad: "12,000 kg",
    estado: "Disponible",
    ultimoMantenimiento: "2025-03-01",
    proximoMantenimiento: "2025-04-01",
    estadoTecnico: "Óptimo",
    kilometraje: "45,230 km",
  },
  {
    id: "CAM-002",
    patente: "EFGH34",
    tipo: "Camión Cisterna",
    modelo: "Scania R 450",
    año: "2022",
    capacidad: "10,000 kg",
    estado: "En Uso",
    ultimoMantenimiento: "2025-02-15",
    proximoMantenimiento: "2025-03-15",
    estadoTecnico: "Bueno",
    kilometraje: "78,450 km",
  },
  {
    id: "CAM-003",
    patente: "IJKL56",
    tipo: "Camión Cisterna",
    modelo: "Mercedes Actros",
    año: "2024",
    capacidad: "15,000 kg",
    estado: "Mantenimiento",
    ultimoMantenimiento: "2025-03-10",
    proximoMantenimiento: "2025-04-10",
    estadoTecnico: "Requiere Atención",
    kilometraje: "12,890 km",
  },
];

function DashboardCamionesPage() {
  const [searchValue, setSearchValue] = useState("");

  const estadoStyle = {
    Disponible: { bg: "#BCE8D2", color: "#0E5E46" },
    "En Uso": { bg: "#C7D6EB", color: "#1D4AB8" },
    Mantenimiento: { bg: "#FEE2E2", color: "#991B1B" },
  };

  const estadoTecnicoStyle = {
    Óptimo: { bg: "#BCE8D2", color: "#0E5E46", icon: <CheckCircle /> },
    Bueno: { bg: "#C7D6EB", color: "#1D4AB8", icon: <CheckCircle /> },
    "Requiere Atención": { bg: "#FEE2E2", color: "#991B1B", icon: <Warning /> },
  };

  const filteredCamiones = camionesData.filter(
    (camion) =>
      !searchValue.trim() ||
      camion.patente.toLowerCase().includes(searchValue.toLowerCase()) ||
      camion.modelo.toLowerCase().includes(searchValue.toLowerCase()) ||
      camion.tipo.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Stack spacing={2.4}>
      <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
        <Stack spacing={1.4}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Dashboard de Camiones
            </Typography>
            <TextField
              size="small"
              placeholder="Buscar por patente, modelo, tipo..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              sx={{ minWidth: { xs: "100%", md: 300 } }}
            />
          </Stack>

          <Grid container spacing={2}>
            {filteredCamiones.map((camion) => (
              <Grid key={camion.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <Card
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    transition: "all 200ms ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0px 8px 24px rgba(0, 46, 77, 0.12)",
                    },
                  }}
                >
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: `${brandColors.dayBlue}20`,
                            color: brandColors.dayBlue,
                            border: `3px solid ${brandColors.dayBlue}40`,
                          }}
                        >
                          <LocalShipping sx={{ fontSize: "2rem" }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "monospace", color: brandColors.oxyBlue }}>
                            {camion.patente}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {camion.tipo}
                          </Typography>
                        </Box>
                        <Chip
                          label={camion.estado}
                          size="small"
                          sx={{
                            bgcolor: estadoStyle[camion.estado]?.bg || "#E5E7EB",
                            color: estadoStyle[camion.estado]?.color || "#4B5563",
                            fontWeight: 700,
                          }}
                        />
                      </Stack>

                      <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Modelo
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {camion.modelo}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Año
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {camion.año}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Capacidad
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {camion.capacidad}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Kilometraje
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {camion.kilometraje}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            Estado Técnico
                          </Typography>
                          <Chip
                            icon={estadoTecnicoStyle[camion.estadoTecnico]?.icon}
                            label={camion.estadoTecnico}
                            size="small"
                            sx={{
                              bgcolor: estadoTecnicoStyle[camion.estadoTecnico]?.bg || "#E5E7EB",
                              color: estadoTecnicoStyle[camion.estadoTecnico]?.color || "#4B5563",
                              fontWeight: 700,
                            }}
                          />
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Ver detalle" arrow placement="top">
                          <IconButton size="small" color="primary" sx={{ border: "1px solid", borderColor: "primary.main" }}>
                            <LocalShipping fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mantenimiento" arrow placement="top">
                          <IconButton size="small" color="primary" sx={{ border: "1px solid", borderColor: "primary.main" }}>
                            <Build fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Paper>
    </Stack>
  );
}

export default DashboardCamionesPage;
