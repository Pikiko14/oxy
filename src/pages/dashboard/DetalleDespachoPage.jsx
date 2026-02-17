import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
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
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Print from "@mui/icons-material/Print";
import Edit from "@mui/icons-material/Edit";
import Message from "@mui/icons-material/Message";
import Call from "@mui/icons-material/Call";
import ReportProblem from "@mui/icons-material/ReportProblem";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Download from "@mui/icons-material/Download";
import Place from "@mui/icons-material/Place";
import LocationOn from "@mui/icons-material/LocationOn";
import AccessTime from "@mui/icons-material/AccessTime";
import Person from "@mui/icons-material/Person";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import Description from "@mui/icons-material/Description";
import History from "@mui/icons-material/History";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import Schedule from "@mui/icons-material/Schedule";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { brandColors } from "../../theme";
import DespachoFormModal from "../../components/DespachoFormModal";

// ============================================
// DATOS MOCK
// ============================================

const detailMock = {
  status: "En Ruta",
  updatedAt: "10:45 AM",
  updatedAgo: "hace 15 min",
  dispatchId: "#843295",
  departureDate: "23 Octubre, 2023 - 08:30 AM",
  eta: "23 Octubre, 2023 - 10:45 AM",
  loadType: "ISOPROPANOL",
  origin: "Planta Oxy Santiago",
  originAddress: "Av. Las Industrias 1200, Quilicura",
  destination: "Hospital El Salvador",
  destinationAddress: "Av. Salvador 364, Providencia, Santiago",
  distance: "18.5 km",
  driver: {
    name: "GEROLAMO GNETTI",
    code: "DRV-2023-0087",
    phone: "+56 9 8765 4321",
    experience: "5 años",
    license: "Clase A4 - Vigente",
    rest: "Hoy, 06:00 AM (2 horas)",
  },
  vehicle: {
    type: "Camión Cisterna",
    plate: "ABCD12",
    model: "Volvo FH 500",
    year: "2023",
    maintenance: "15 Abril, 2025",
    capacity: "12,000 kg",
    technicalStatus: "Óptimo",
  },
  contacts: [
    { name: "Dra. Maria Gonzalez", role: "Jefa de Abastecimiento", phone: "+56 9 1234 5678" },
    { name: "Jorge Ramirez", role: "Encargado de Recepción", phone: "+56 9 8765 4321" },
  ],
  events: [
    { title: "Aproximándose al destino", time: "11:00 AM", description: "El vehículo se encuentra a 2 km del punto de entrega." },
    { title: "Cambio de ruta", time: "10:15 AM", description: "El conductor ha tomado una ruta alternativa para evitar el tráfico." },
  ],
  documents: [
    { name: "Guía de Despacho", code: "#GD-542187" },
    { name: "Manifiesto de Carga", code: "#MC-98732" },
    { name: "Certificado de Calidad", code: "#CC-342156" },
    { name: "Orden de Compra", code: "#OC-76543" },
  ],
};

// ============================================
// COMPONENTES REUTILIZABLES
// ============================================

function StatCard({ icon, label, value, color = brandColors.oxyBlue }) {
  return (
    <Paper
      sx={{
        p: 2,
        border: `1px solid ${color}20`,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${color}08 0%, rgba(255,255,255,1) 100%)`,
        boxShadow: `0px 4px 12px ${color}10`,
        transition: "all 200ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0px 6px 16px ${color}20`,
        },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ width: 40, height: 40, bgcolor: `${color}20`, color }}>
          {icon}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.3 }}>
            {label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.midnightBlue, wordBreak: "break-word" }}>
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

function InfoCard({ title, children, icon, headerBg }) {
  return (
    <Paper
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        boxShadow: "0px 6px 20px rgba(0, 46, 77, 0.08)",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.8,
          bgcolor: headerBg || `${brandColors.morningBlue}08`,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.2}>
          {icon && (
            <Avatar sx={{ width: 32, height: 32, bgcolor: `${brandColors.oxyBlue}20`, color: brandColors.oxyBlue }}>
              {icon}
            </Avatar>
          )}
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: brandColors.midnightBlue }}>
            {title}
          </Typography>
        </Stack>
      </Box>
      <Box sx={{ p: 2.5, flex: 1 }}>{children}</Box>
    </Paper>
  );
}

function RouteCard({ origin, originAddress, destination, destinationAddress, distance }) {
  return (
    <Paper
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        background: `linear-gradient(135deg, ${brandColors.oceanAqua}06 0%, rgba(255,255,255,1) 100%)`,
        boxShadow: "0px 6px 20px rgba(0, 46, 77, 0.08)",
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar sx={{ width: 44, height: 44, bgcolor: `${brandColors.forestGreen}20`, color: brandColors.forestGreen, mt: 0.5 }}>
              <LocationOn />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Chip label="Origen" size="small" sx={{ mb: 1, bgcolor: `${brandColors.forestGreen}20`, color: brandColors.forestGreen, fontWeight: 700 }} />
              <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 700, mb: 0.5, color: brandColors.midnightBlue }}>
                {origin}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {originAddress}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ pl: 7, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              left: 21,
              top: -12,
              bottom: -12,
              width: 3,
              background: `linear-gradient(180deg, ${brandColors.forestGreen} 0%, ${brandColors.oxyRed} 100%)`,
              borderRadius: 2,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              width: 20,
              height: 20,
              borderRadius: "50%",
              bgcolor: brandColors.dayBlue,
              border: `4px solid white`,
              boxShadow: `0 0 0 2px ${brandColors.dayBlue}`,
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 700, color: brandColors.oxyBlue }}>
            {distance}
          </Typography>
        </Box>

        <Box>
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Avatar sx={{ width: 44, height: 44, bgcolor: `${brandColors.oxyRed}20`, color: brandColors.oxyRed, mt: 0.5 }}>
              <LocationOn />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Chip label="Destino" size="small" sx={{ mb: 1, bgcolor: `${brandColors.oxyRed}20`, color: brandColors.oxyRed, fontWeight: 700 }} />
              <Typography variant="h6" sx={{ fontSize: "1.1rem", fontWeight: 700, mb: 0.5, color: brandColors.midnightBlue }}>
                {destination}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {destinationAddress}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

function PersonCard({ name, code, phone, experience, license, rest, avatarBg, onCall }) {
  return (
    <Paper
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        background: `linear-gradient(135deg, ${avatarBg}08 0%, rgba(255,255,255,1) 100%)`,
        boxShadow: "0px 6px 20px rgba(0, 46, 77, 0.08)",
      }}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 2.5, pb: 2.5, borderBottom: "2px solid", borderColor: "divider" }}>
        <Avatar sx={{ width: 72, height: 72, bgcolor: avatarBg, fontSize: "1.75rem", fontWeight: 700 }}>
          {name.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
            <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 700, color: brandColors.midnightBlue }}>
              {name}
            </Typography>
            <Tooltip title="Llamar" arrow placement="top">
              <IconButton size="small" color="primary" onClick={onCall} sx={{ border: "1px solid", borderColor: "primary.main" }}>
                <Call fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "monospace" }}>
            {code}
          </Typography>
        </Box>
      </Stack>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            Teléfono
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.midnightBlue }}>
            {phone}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            Experiencia
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.midnightBlue }}>
            {experience}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            Licencia
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.midnightBlue }}>
            {license}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            Último descanso
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.midnightBlue }}>
            {rest}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

function VehicleCard({ type, plate, model, year, capacity, maintenance, technicalStatus }) {
  return (
    <Paper
      sx={{
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        background: `linear-gradient(135deg, ${brandColors.dayBlue}08 0%, rgba(255,255,255,1) 100%)`,
        boxShadow: "0px 6px 20px rgba(0, 46, 77, 0.08)",
      }}
    >
      <Stack direction="row" spacing={2} sx={{ mb: 2.5, pb: 2.5, borderBottom: "2px solid", borderColor: "divider" }}>
        <Avatar
          sx={{
            width: 72,
            height: 72,
            bgcolor: `${brandColors.dayBlue}20`,
            color: brandColors.dayBlue,
            border: `3px solid ${brandColors.dayBlue}40`,
          }}
        >
          <LocalShipping sx={{ fontSize: "2rem" }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontSize: "1.2rem", fontWeight: 700, mb: 0.5, color: brandColors.midnightBlue }}>
            {type}
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "monospace", fontWeight: 700, color: brandColors.oxyBlue, fontSize: "1.1rem" }}>
            {plate}
          </Typography>
        </Box>
      </Stack>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            Modelo
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.midnightBlue }}>
            {model}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            Año
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.midnightBlue }}>
            {year}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            Capacidad
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.midnightBlue }}>
            {capacity}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            Estado técnico
          </Typography>
          <Chip label={technicalStatus} size="small" sx={{ bgcolor: `${brandColors.forestGreen}20`, color: brandColors.forestGreen, fontWeight: 700 }} />
        </Grid>
        <Grid size={12}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
            Último mantenimiento
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.midnightBlue }}>
            {maintenance}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function DetalleDespachoPage() {
  const navigate = useNavigate();
  const { actNumber } = useParams();
  const d = detailMock;
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Convertir detailMock al formato esperado por el modal
  const getDispatchDataForModal = () => {
    // Función auxiliar para convertir fechas de forma segura
    const safeDateParse = (dateString) => {
      if (!dateString) return "";
      try {
        // Intentar parsear la fecha en formato "DD Mes, YYYY" o similar
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        return date.toISOString().split("T")[0];
      } catch (error) {
        return "";
      }
    };

    // Extraer fecha y hora de departureDate de forma segura
    const departureParts = d.departureDate ? d.departureDate.split(" - ") : [];
    const departureDateStr = departureParts[0] || "";
    const departureTimeStr = departureParts[1] || "";

    // Extraer fecha y hora de eta de forma segura
    const etaParts = d.eta ? d.eta.split(" - ") : [];
    const etaDateStr = etaParts[0] || "";
    const etaTimeStr = etaParts[1] || "";

    return {
      actNumber: d.dispatchId ? d.dispatchId.replace("#", "") : "",
      company: "TRANSPORTES OSORIO", // Mock, debería venir de los datos reales
      driver: d.driver?.name || "",
      movement: "CARGA", // Mock
      product: d.loadType || "",
      plate: d.vehicle?.plate || "",
      status: d.status || "En Atención",
      region: "Centro", // Mock
      origin: d.origin || "",
      originAddress: d.originAddress || "",
      destination: d.destination || "",
      destinationAddress: d.destinationAddress || "",
      distance: d.distance || "",
      departureDate: safeDateParse(departureDateStr),
      departureTime: departureTimeStr,
      eta: safeDateParse(etaDateStr),
      etaTime: etaTimeStr,
      driverCode: d.driver?.code || "",
      driverPhone: d.driver?.phone || "",
      driverExperience: d.driver?.experience || "",
      driverLicense: d.driver?.license || "",
      driverRest: d.driver?.rest || "",
      vehicleType: d.vehicle?.type || "",
      vehicleModel: d.vehicle?.model || "",
      vehicleYear: d.vehicle?.year || "",
      vehicleCapacity: d.vehicle?.capacity || "",
      vehicleMaintenance: d.vehicle?.maintenance ? safeDateParse(d.vehicle.maintenance) : "",
      vehicleTechnicalStatus: d.vehicle?.technicalStatus || "",
      loadQuantity: "5000", // Mock
      loadUnit: "kg",
      loadLot: "LOT-2025-04-23-A", // Mock
      loadProductionDate: "", // Mock
      arrival: "08:30", // Mock
      attention: "09:15", // Mock
      departure: "10:45", // Mock
      durationMin: "94", // Mock
    };
  };

  const handleOpenEditModal = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveDispatch = (formData, initialData) => {
    // Aquí se guardarían los cambios en el backend
    console.log("Guardando cambios:", formData);
    // Por ahora solo cerramos el modal
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Stack spacing={3}>
      {/* Header compacto */}
      <Paper
        sx={{
          p: 2.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
          background: `linear-gradient(135deg, ${brandColors.oxyBlue}08 0%, rgba(255,255,255,1) 100%)`,
          boxShadow: "0px 6px 20px rgba(0, 46, 77, 0.08)",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={2} alignItems={{ xs: "flex-start", sm: "center" }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title="Volver" arrow placement="top">
              <IconButton
                size="medium"
                onClick={() => navigate("/dashboard/despachos")}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { bgcolor: `${brandColors.oxyBlue}10`, borderColor: brandColors.oxyBlue },
                }}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: brandColors.midnightBlue, lineHeight: 1.2 }}>
                Despacho {d.dispatchId}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5 }}>
                <Chip label={d.status} sx={{ bgcolor: "#BCE8D2", color: "#0E5E46", fontWeight: 700, height: 26 }} />
                <Typography variant="caption" color="text.secondary">
                  {d.updatedAt} ({d.updatedAgo})
                </Typography>
              </Stack>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Imprimir" arrow placement="top">
              <IconButton
                size="medium"
                color="primary"
                sx={{
                  border: "1px solid",
                  borderColor: "primary.main",
                }}
              >
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title={dialogOpen ? "Cerrar" : "Editar"} arrow placement="top">
              <IconButton
                size="medium"
                color="primary"
                onClick={dialogOpen ? handleCloseDialog : handleOpenEditModal}
                sx={{
                  bgcolor: dialogOpen ? "error.main" : "primary.main",
                  color: "white",
                  border: "1px solid",
                  borderColor: dialogOpen ? "error.main" : "primary.main",
                  "&:hover": {
                    bgcolor: dialogOpen ? "error.dark" : "primary.dark",
                    borderColor: dialogOpen ? "error.dark" : "primary.dark",
                  },
                }}
              >
                {dialogOpen ? <Cancel /> : <Edit />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      {/* Estadísticas rápidas */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard icon={<AccessTime fontSize="small" />} label="Fecha Salida" value={d.departureDate.split(" - ")[0]} color={brandColors.oxyBlue} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard icon={<AccessTime fontSize="small" />} label="ETA" value={d.eta.split(" - ")[1]} color={brandColors.oceanAqua} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard icon={<LocalShipping fontSize="small" />} label="Carga" value={d.loadType} color={brandColors.dayBlue} />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <StatCard icon={<Place fontSize="small" />} label="Distancia" value={d.distance} color={brandColors.sunriseOrange} />
        </Grid>
      </Grid>

      {/* Contenido principal */}
      <Grid container spacing={3}>
        {/* Columna izquierda */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            {/* Ruta */}
            <RouteCard
              origin={d.origin}
              originAddress={d.originAddress}
              destination={d.destination}
              destinationAddress={d.destinationAddress}
              distance={d.distance}
            />

            {/* Carga */}
            <InfoCard title="Detalles de la Carga" icon={<LocalShipping fontSize="small" />}>
              <TableContainer
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: `${brandColors.morningBlue}08` }}>
                      <TableCell sx={{ fontWeight: 700, display: { xs: "none", md: "table-cell" } }}>PRODUCTO</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>PRODUCTO</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>CANTIDAD</TableCell>
                      <TableCell sx={{ fontWeight: 700, display: { xs: "none", sm: "table-cell" } }}>UNIDAD</TableCell>
                      <TableCell sx={{ fontWeight: 700, display: { xs: "none", lg: "table-cell" } }}>LOTE</TableCell>
                      <TableCell sx={{ fontWeight: 700, display: { xs: "none", lg: "table-cell" } }}>FECHA PRODUCCIÓN</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, display: { xs: "none", md: "table-cell" } }}>ISOPROPANOL</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>ISOPROPANOL</TableCell>
                      <TableCell>5,000</TableCell>
                      <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>kg</TableCell>
                      <TableCell sx={{ fontFamily: "monospace", display: { xs: "none", lg: "table-cell" } }}>LOT-2025-04-23-A</TableCell>
                      <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>23 Abril, 2025</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </InfoCard>

            {/* Documentos */}
            <InfoCard title="Documentos" icon={<Description fontSize="small" />}>
              <Grid container spacing={2}>
                {d.documents.map((doc) => (
                  <Grid key={doc.code} size={{ xs: 12, sm: 6 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "all 200ms ease",
                        "&:hover": {
                          borderColor: brandColors.oxyBlue,
                          bgcolor: `${brandColors.oxyBlue}05`,
                          transform: "translateY(-2px)",
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack spacing={0.3}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.midnightBlue }}>
                            {doc.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                            {doc.code}
                          </Typography>
                        </Stack>
                        <Tooltip title="Descargar" arrow placement="top">
                          <IconButton size="small" color="primary">
                            <Download fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </InfoCard>

            {/* Mapa */}
            <InfoCard title="Seguimiento en Tiempo Real" icon={<Place fontSize="small" />}>
              <Box
                sx={{
                  borderRadius: 2.5,
                  overflow: "hidden",
                  height: 400,
                  bgcolor: "#cde6ff",
                  position: "relative",
                  border: "2px solid",
                  borderColor: brandColors.dayBlue + "40",
                  boxShadow: `0px 8px 24px ${brandColors.dayBlue}20`,
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(90deg, rgba(46,123,201,0.28) 0%, rgba(255,255,255,0) 40%), url('https://tile.openstreetmap.org/5/10/12.png') center/cover no-repeat",
                  }}
                />
                <Paper
                  sx={{
                    position: "absolute",
                    left: 20,
                    bottom: 20,
                    p: 2,
                    borderRadius: 2.5,
                    boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                    bgcolor: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Place sx={{ color: brandColors.dayBlue, fontSize: "1.5rem" }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: brandColors.midnightBlue }}>
                        Posición actual
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        Última actualización: 06:23 p.m.
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </InfoCard>

            {/* Eventos */}
            <InfoCard title="Historial de Eventos" icon={<History fontSize="small" />}>
              <Stack spacing={2.5}>
                {d.events.map((event, index) => (
                  <Stack key={event.title} direction="row" spacing={2}>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: `${brandColors.dayBlue}20`,
                          color: brandColors.dayBlue,
                          border: `2px solid ${brandColors.dayBlue}40`,
                        }}
                      >
                        <Place />
                      </Avatar>
                      {index < d.events.length - 1 && (
                        <Box
                          sx={{
                            width: 2,
                            flex: 1,
                            bgcolor: "divider",
                            minHeight: 40,
                            mt: 1.5,
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, pb: index < d.events.length - 1 ? 2.5 : 0 }}>
                      <Typography sx={{ fontWeight: 700, mb: 0.5, color: brandColors.midnightBlue }}>
                        {event.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.8 }}>
                        {event.time}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {event.description}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </InfoCard>
          </Stack>
        </Grid>

        {/* Columna derecha */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            {/* Conductor */}
            <PersonCard
              name={d.driver.name}
              code={d.driver.code}
              phone={d.driver.phone}
              experience={d.driver.experience}
              license={d.driver.license}
              rest={d.driver.rest}
              avatarBg={brandColors.oxyBlue}
              onCall={() => {}}
            />

            {/* Vehículo */}
            <VehicleCard
              type={d.vehicle.type}
              plate={d.vehicle.plate}
              model={d.vehicle.model}
              year={d.vehicle.year}
              capacity={d.vehicle.capacity}
              maintenance={d.vehicle.maintenance}
              technicalStatus={d.vehicle.technicalStatus}
            />

            {/* Contactos */}
            <InfoCard title="Contactos del Cliente" icon={<Person fontSize="small" />}>
              <Stack spacing={2}>
                {d.contacts.map((contact) => (
                  <Paper
                    key={contact.name}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 200ms ease",
                      "&:hover": {
                        borderColor: brandColors.oceanAqua,
                        bgcolor: `${brandColors.oceanAqua}05`,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.5}>
                      <Avatar sx={{ width: 48, height: 48, bgcolor: "#D9F3E6", color: "#1A936F", fontWeight: 700 }}>
                        {contact.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography sx={{ fontWeight: 700, color: brandColors.midnightBlue, mb: 0.3 }}>
                              {contact.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {contact.role}
                            </Typography>
                          </Box>
                          <Tooltip title="Llamar" arrow placement="top">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => window.open(`tel:${contact.phone.replace(/\s/g, "")}`)}
                              sx={{ border: "1px solid", borderColor: "primary.main" }}
                            >
                              <Call fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </InfoCard>

            {/* Acciones */}
            <InfoCard title="Acciones">
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Tooltip title="Actualizar estado" arrow placement="top">
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{
                        height: 64,
                        borderRadius: 2.5,
                        boxShadow: `0px 4px 12px ${brandColors.oxyBlue}30`,
                        transition: "all 200ms ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0px 6px 16px ${brandColors.oxyBlue}40`,
                        },
                      }}
                    >
                      <Stack direction="column" spacing={0.5} alignItems="center">
                        <Edit sx={{ fontSize: "1.5rem" }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.7rem", lineHeight: 1 }}>
                          Actualizar
                        </Typography>
                      </Stack>
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid size={6}>
                  <Tooltip title="Registrar entrega" arrow placement="top">
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{
                        height: 64,
                        borderRadius: 2.5,
                        borderWidth: 2,
                        borderColor: brandColors.oxyBlue,
                        transition: "all 200ms ease",
                        "&:hover": {
                          bgcolor: `${brandColors.oxyBlue}10`,
                          borderWidth: 2,
                          transform: "translateY(-2px)",
                          boxShadow: `0px 4px 12px ${brandColors.oxyBlue}20`,
                        },
                      }}
                    >
                      <Stack direction="column" spacing={0.5} alignItems="center">
                        <CheckCircle sx={{ fontSize: "1.5rem", color: brandColors.oxyBlue }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.7rem", lineHeight: 1, color: brandColors.oxyBlue }}>
                          Registrar
                        </Typography>
                      </Stack>
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid size={6}>
                  <Tooltip title="Cancelar despacho" arrow placement="top">
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      sx={{
                        height: 64,
                        borderRadius: 2.5,
                        borderWidth: 2,
                        borderColor: brandColors.oxyRed,
                        transition: "all 200ms ease",
                        "&:hover": {
                          bgcolor: `${brandColors.oxyRed}10`,
                          borderWidth: 2,
                          transform: "translateY(-2px)",
                          boxShadow: `0px 4px 12px ${brandColors.oxyRed}20`,
                        },
                      }}
                    >
                      <Stack direction="column" spacing={0.5} alignItems="center">
                        <Cancel sx={{ fontSize: "1.5rem", color: brandColors.oxyRed }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.7rem", lineHeight: 1, color: brandColors.oxyRed }}>
                          Cancelar
                        </Typography>
                      </Stack>
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid size={6}>
                  <Tooltip title="Modificar horario" arrow placement="top">
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{
                        height: 64,
                        borderRadius: 2.5,
                        borderWidth: 2,
                        borderColor: brandColors.oxyBlue,
                        transition: "all 200ms ease",
                        "&:hover": {
                          bgcolor: `${brandColors.oxyBlue}10`,
                          borderWidth: 2,
                          transform: "translateY(-2px)",
                          boxShadow: `0px 4px 12px ${brandColors.oxyBlue}20`,
                        },
                      }}
                    >
                      <Stack direction="column" spacing={0.5} alignItems="center">
                        <Schedule sx={{ fontSize: "1.5rem", color: brandColors.oxyBlue }} />
                        <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.7rem", lineHeight: 1, color: brandColors.oxyBlue }}>
                          Horario
                        </Typography>
                      </Stack>
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </InfoCard>
          </Stack>
        </Grid>
      </Grid>

      {/* Botón flotante "Ir arriba" */}
      {showScrollTop && (
        <Tooltip title="Ir arriba" arrow placement="left">
          <IconButton
            onClick={scrollToTop}
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              width: 56,
              height: 56,
              bgcolor: brandColors.oxyBlue,
              color: "white",
              boxShadow: `0px 6px 20px ${brandColors.oxyBlue}40`,
              zIndex: 1000,
              transition: "all 200ms ease",
              "&:hover": {
                bgcolor: brandColors.midnightBlue,
                transform: "translateY(-4px)",
                boxShadow: `0px 8px 24px ${brandColors.oxyBlue}50`,
              },
            }}
          >
            <KeyboardArrowUp sx={{ fontSize: "1.75rem" }} />
          </IconButton>
        </Tooltip>
      )}

      <DespachoFormModal
        open={dialogOpen}
        onClose={handleCloseDialog}
        initialData={getDispatchDataForModal()}
        onSave={handleSaveDispatch}
      />
    </Stack>
  );
}

export default DetalleDespachoPage;
