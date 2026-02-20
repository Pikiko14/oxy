import { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Button,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Build from "@mui/icons-material/Build";
import Visibility from "@mui/icons-material/Visibility";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Warning from "@mui/icons-material/Warning";
import { brandColors } from "../../theme";
import VehiculoFormModal from "../../components/VehiculoFormModal";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const camionesData = [
  {
    id: "CAM-001",
    categoria: "camion",
    patente: "ABCD12",
    tipo: "Camión Cisterna",
    modelo: "Volvo FH 500",
    año: "2023",
    capacidad: "12,000 kg",
    estado: "Disponible",
    ultimoMantenimiento: "2025-03-01",
    proximoMantenimiento: "2025-04-01",
    estadoTecnico: "Óptimo",
    estadoTecnicoBase: "Óptimo",
    kilometraje: "45,230 km",
  },
  {
    id: "CAM-002",
    categoria: "camion",
    patente: "EFGH34",
    tipo: "Camión Cisterna",
    modelo: "Scania R 450",
    año: "2022",
    capacidad: "10,000 kg",
    estado: "En Uso",
    ultimoMantenimiento: "2025-02-15",
    proximoMantenimiento: "2025-03-15",
    estadoTecnico: "Bueno",
    estadoTecnicoBase: "Bueno",
    kilometraje: "78,450 km",
  },
  {
    id: "CAM-003",
    categoria: "camion",
    patente: "IJKL56",
    tipo: "Camión Cisterna",
    modelo: "Mercedes Actros",
    año: "2024",
    capacidad: "15,000 kg",
    estado: "Mantenimiento",
    ultimoMantenimiento: "2025-03-10",
    proximoMantenimiento: "2025-04-10",
    estadoTecnico: "Requiere Atención",
    estadoTecnicoBase: "Requiere Atención",
    kilometraje: "12,890 km",
  },
];

const carrosData = [
  {
    id: "CAR-001",
    categoria: "carro",
    patente: "TRA-123",
    tipo: "Remolque Cisterna",
    modelo: "Schmitz Cargobull",
    año: "2023",
    capacidad: "12,000 kg",
    estado: "Disponible",
    ultimoMantenimiento: "2025-03-05",
    proximoMantenimiento: "2025-04-05",
    estadoTecnico: "Óptimo",
    estadoTecnicoBase: "Óptimo",
    acople: "Disponible",
  },
  {
    id: "CAR-002",
    categoria: "carro",
    patente: "TRA-456",
    tipo: "Remolque Cisterna",
    modelo: "Krone Cool Liner",
    año: "2022",
    capacidad: "10,000 kg",
    estado: "En Uso",
    ultimoMantenimiento: "2025-02-20",
    proximoMantenimiento: "2025-03-20",
    estadoTecnico: "Bueno",
    estadoTecnicoBase: "Bueno",
    acople: "Acoplado",
  },
  {
    id: "CAR-003",
    categoria: "carro",
    patente: "TRA-789",
    tipo: "Remolque Cisterna",
    modelo: "Kögel Cargo",
    año: "2024",
    capacidad: "15,000 kg",
    estado: "Mantenimiento",
    ultimoMantenimiento: "2025-03-12",
    proximoMantenimiento: "2025-04-12",
    estadoTecnico: "Requiere Atención",
    estadoTecnicoBase: "Requiere Atención",
    acople: "Disponible",
  },
];

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

function DashboardVehiculosPage() {
  const [camiones, setCamiones] = useState(camionesData);
  const [carros, setCarros] = useState(carrosData);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [searchValue, setSearchValue] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);

  const handleChangeFiltro = (_event, newValue) => {
    if (newValue !== null) {
      setTipoFiltro(newValue);
    }
  };

  const vehiculosData = [...camiones, ...carros];

  const handleOpenDetalle = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setDetailOpen(true);
  };

  const handleCloseDetalle = () => {
    setDetailOpen(false);
    setSelectedVehiculo(null);
  };

  const handleOpenCrear = () => {
    setEditingVehiculo(null);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingVehiculo(null);
  };

  const handleSaveVehiculo = (vehiculo) => {
    const vehiculoConBase = {
      ...vehiculo,
      estadoTecnicoBase: vehiculo.estadoTecnicoBase || vehiculo.estadoTecnico,
    };

    if (vehiculoConBase.categoria === "camion") {
      setCamiones((prev) => {
        const exists = prev.some((v) => v.id === vehiculoConBase.id);
        return exists ? prev.map((v) => (v.id === vehiculoConBase.id ? vehiculoConBase : v)) : [...prev, vehiculoConBase];
      });
    } else {
      setCarros((prev) => {
        const exists = prev.some((v) => v.id === vehiculoConBase.id);
        return exists ? prev.map((v) => (v.id === vehiculoConBase.id ? vehiculoConBase : v)) : [...prev, vehiculoConBase];
      });
    }
    setFormOpen(false);
    setEditingVehiculo(null);
  };

  const toggleMantenimiento = (vehiculo) => {
    const nuevoEstado = vehiculo.estado === "Mantenimiento" ? "Disponible" : "Mantenimiento";

    if (vehiculo.categoria === "camion") {
      setCamiones((prev) =>
        prev.map((v) =>
          v.id === vehiculo.id
            ? {
                ...v,
                estado: nuevoEstado,
                estadoTecnico: nuevoEstado === "Mantenimiento" ? "Requiere Atención" : v.estadoTecnicoBase || v.estadoTecnico,
              }
            : v
        )
      );
    } else {
      setCarros((prev) =>
        prev.map((v) =>
          v.id === vehiculo.id
            ? {
                ...v,
                estado: nuevoEstado,
                estadoTecnico: nuevoEstado === "Mantenimiento" ? "Requiere Atención" : v.estadoTecnicoBase || v.estadoTecnico,
              }
            : v
        )
      );
    }
  };

  const filteredData = vehiculosData.filter((item) => {
    const term = searchValue.trim().toLowerCase();
    const matchesTipo = tipoFiltro === "todos" || item.categoria === tipoFiltro;
    const matchesSearch =
      !term ||
      item.patente.toLowerCase().includes(term) ||
      item.modelo.toLowerCase().includes(term) ||
      item.tipo.toLowerCase().includes(term);
    return matchesTipo && matchesSearch;
  });

  return (
    <Stack spacing={2.4}>
      <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
        <Stack spacing={1.4}>
          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.2} alignItems="flex-start">
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Dashboard de Vehículos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Control y seguimiento de flota de camiones y carros
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <ToggleButtonGroup
                value={tipoFiltro}
                exclusive
                onChange={handleChangeFiltro}
                size="small"
                sx={{
                  alignSelf: { xs: "stretch", sm: "center" },
                  "& .MuiToggleButton-root": {
                    height: 40,
                    px: 2.4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                }}
              >
                <ToggleButton value="todos">Todos</ToggleButton>
                <ToggleButton value="camion">Camiones</ToggleButton>
                <ToggleButton value="carro">Carros</ToggleButton>
              </ToggleButtonGroup>
              <TextField
                size="small"
                placeholder="Buscar por patente, modelo, tipo..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                sx={{
                  minWidth: { xs: "100%", sm: 260, md: 300 },
                  "& .MuiOutlinedInput-root": {
                    height: 40,
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<DirectionsCar fontSize="small" />}
                onClick={handleOpenCrear}
                sx={{
                  alignSelf: { xs: "stretch", sm: "center" },
                  height: 40,
                  borderRadius: 999,
                  px: 2.6,
                }}
              >
                Agregar Vehículo
              </Button>
            </Stack>
          </Stack>

          <Grid container spacing={2}>
            {filteredData.map((item) => {
              const isCamion = item.categoria === "camion";
              const avatarBg = `${isCamion ? brandColors.dayBlue : brandColors.oceanAqua}20`;
              const avatarColor = isCamion ? brandColors.dayBlue : brandColors.oceanAqua;
              const avatarBorder = `3px solid ${isCamion ? brandColors.dayBlue : brandColors.oceanAqua}40`;

              return (
                <Grid key={item.id} size={{ xs: 12, md: 6, lg: 4 }}>
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
                              bgcolor: avatarBg,
                              color: avatarColor,
                              border: avatarBorder,
                            }}
                          >
                            <LocalShipping sx={{ fontSize: "2rem" }} />
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 700,
                                fontFamily: "monospace",
                                color: avatarColor,
                              }}
                            >
                              {item.patente}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.tipo}
                            </Typography>
                          </Box>
                          <Chip
                            label={item.estado}
                            size="small"
                            sx={{
                              bgcolor: estadoStyle[item.estado]?.bg || "#E5E7EB",
                              color: estadoStyle[item.estado]?.color || "#4B5563",
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
                              {item.modelo}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">
                              Año
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.año}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">
                              Capacidad
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.capacidad}
                            </Typography>
                          </Stack>

                          {isCamion ? (
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="caption" color="text.secondary">
                                Kilometraje
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.kilometraje}
                              </Typography>
                            </Stack>
                          ) : (
                            <Stack direction="row" justifyContent="space-between">
                              <Typography variant="caption" color="text.secondary">
                                Estado Acople
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {item.acople}
                              </Typography>
                            </Stack>
                          )}

                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              Estado Técnico
                            </Typography>
                            <Chip
                              icon={estadoTecnicoStyle[item.estadoTecnico]?.icon}
                              label={item.estadoTecnico}
                              size="small"
                              sx={{
                                bgcolor: estadoTecnicoStyle[item.estadoTecnico]?.bg || "#E5E7EB",
                                color: estadoTecnicoStyle[item.estadoTecnico]?.color || "#4B5563",
                                fontWeight: 700,
                              }}
                            />
                          </Stack>
                        </Stack>

                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Ver detalle" arrow placement="top">
                            <IconButton
                              size="small"
                              color="primary"
                              sx={{ border: "1px solid", borderColor: "primary.main" }}
                              onClick={() => handleOpenDetalle(item)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip
                            title={item.estado === "Mantenimiento" ? "Quitar de mantenimiento" : "Marcar en mantenimiento"}
                            arrow
                            placement="top"
                          >
                            <IconButton
                              size="small"
                              color={item.estado === "Mantenimiento" ? "error" : "primary"}
                              sx={{
                                border: "1px solid",
                                borderColor: item.estado === "Mantenimiento" ? "error.main" : "primary.main",
                                bgcolor: item.estado === "Mantenimiento" ? "error.main" : "transparent",
                                color: item.estado === "Mantenimiento" ? "white" : "primary.main",
                                "&:hover": {
                                  bgcolor: item.estado === "Mantenimiento" ? "error.dark" : "primary.light",
                                },
                              }}
                              onClick={() => toggleMantenimiento(item)}
                            >
                              <Build fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </Paper>

      <VehiculoFormModal open={formOpen} onClose={handleCloseForm} initialData={editingVehiculo} onSave={handleSaveVehiculo} />

      <Dialog open={detailOpen} onClose={handleCloseDetalle} fullWidth maxWidth="sm">
        <DialogTitle>Detalle de Vehículo</DialogTitle>
        <DialogContent dividers>
          {selectedVehiculo && (
            <Stack spacing={1.2} sx={{ mt: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {selectedVehiculo.patente} · {selectedVehiculo.tipo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Categoría: {selectedVehiculo.categoria === "camion" ? "Camión" : "Carro / Remolque"}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Modelo</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedVehiculo.modelo}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Año</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedVehiculo.año}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Capacidad</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedVehiculo.capacidad}
                </Typography>
              </Stack>
              {selectedVehiculo.categoria === "camion" ? (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Kilometraje</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedVehiculo.kilometraje}
                  </Typography>
                </Stack>
              ) : (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Estado Acople</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {selectedVehiculo.acople}
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Estado</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedVehiculo.estado}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Estado Técnico</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedVehiculo.estadoTecnico}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Último Mantenimiento</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedVehiculo.ultimoMantenimiento || "-"}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Próximo Mantenimiento</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {selectedVehiculo.proximoMantenimiento || "-"}
                </Typography>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetalle} size="small">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default DashboardVehiculosPage;

