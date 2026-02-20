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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Build from "@mui/icons-material/Build";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Warning from "@mui/icons-material/Warning";
import { brandColors } from "../../theme";

const carrosData = [
  {
    id: "CAR-001",
    patente: "TRA-123",
    tipo: "Remolque Cisterna",
    modelo: "Schmitz Cargobull",
    año: "2023",
    capacidad: "12,000 kg",
    estado: "Disponible",
    ultimoMantenimiento: "2025-03-05",
    proximoMantenimiento: "2025-04-05",
    estadoTecnico: "Óptimo",
    acople: "Disponible",
  },
  {
    id: "CAR-002",
    patente: "TRA-456",
    tipo: "Remolque Cisterna",
    modelo: "Krone Cool Liner",
    año: "2022",
    capacidad: "10,000 kg",
    estado: "En Uso",
    ultimoMantenimiento: "2025-02-20",
    proximoMantenimiento: "2025-03-20",
    estadoTecnico: "Bueno",
    acople: "Acoplado",
  },
  {
    id: "CAR-003",
    patente: "TRA-789",
    tipo: "Remolque Cisterna",
    modelo: "Kögel Cargo",
    año: "2024",
    capacidad: "15,000 kg",
    estado: "Mantenimiento",
    ultimoMantenimiento: "2025-03-12",
    proximoMantenimiento: "2025-04-12",
    estadoTecnico: "Requiere Atención",
    acople: "Disponible",
  },
];

function DashboardCarrosPage() {
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

  const filteredCarros = carrosData.filter(
    (carro) =>
      !searchValue.trim() ||
      carro.patente.toLowerCase().includes(searchValue.toLowerCase()) ||
      carro.modelo.toLowerCase().includes(searchValue.toLowerCase()) ||
      carro.tipo.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Stack spacing={2.4}>
      <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
        <Stack spacing={1.4}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.2}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Dashboard de Carros
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
            {filteredCarros.map((carro) => (
              <Grid key={carro.id} size={{ xs: 12, md: 6, lg: 4 }}>
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
                            bgcolor: `${brandColors.oceanAqua}20`,
                            color: brandColors.oceanAqua,
                            border: `3px solid ${brandColors.oceanAqua}40`,
                          }}
                        >
                          <LocalShipping sx={{ fontSize: "2rem" }} />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: "monospace", color: brandColors.oceanAqua }}>
                            {carro.patente}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {carro.tipo}
                          </Typography>
                        </Box>
                        <Chip
                          label={carro.estado}
                          size="small"
                          sx={{
                            bgcolor: estadoStyle[carro.estado]?.bg || "#E5E7EB",
                            color: estadoStyle[carro.estado]?.color || "#4B5563",
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
                            {carro.modelo}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Año
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {carro.año}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Capacidad
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {carro.capacidad}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="caption" color="text.secondary">
                            Estado Acople
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {carro.acople}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            Estado Técnico
                          </Typography>
                          <Chip
                            icon={estadoTecnicoStyle[carro.estadoTecnico]?.icon}
                            label={carro.estadoTecnico}
                            size="small"
                            sx={{
                              bgcolor: estadoTecnicoStyle[carro.estadoTecnico]?.bg || "#E5E7EB",
                              color: estadoTecnicoStyle[carro.estadoTecnico]?.color || "#4B5563",
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

export default DashboardCarrosPage;
