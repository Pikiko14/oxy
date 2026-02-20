import {
    Avatar,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    Paper,
    Stack,
    Step,
    StepLabel,
    Stepper,
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
import Refresh from "@mui/icons-material/Refresh";
import Warning from "@mui/icons-material/Warning";
import Visibility from "@mui/icons-material/Visibility";
import EditNote from "@mui/icons-material/EditNote";
import ContentCopy from "@mui/icons-material/ContentCopy";
import Timeline from "@mui/icons-material/Timeline";
import Create from "@mui/icons-material/Create";
import Assignment from "@mui/icons-material/Assignment";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
  import { useEffect, useState } from "react";
  import { useNavigate, useParams } from "react-router-dom";
  import { brandColors } from "../../theme";
  import { reservasRows } from "./ReservasPage";
  
  // ============================================
  // DATOS MOCK
  // ============================================
  
  const detailMock = {
    // Identificadores y estado PDOP
    deliveryNumber: "80012345",
    reservationNumber: "RES-100045",
    processStatus: "PESAJE_INICIAL",
    processTimestamps: {
      DISPONIBLE: "2025-03-16 07:45",
      EN_TRANSITO: "2025-03-16 08:10",
      INGRESO_APROBADO: "2025-03-16 08:25",
      PESAJE_INICIAL: "2025-03-16 08:35",
      CARGANDO: "2025-03-16 09:00",
      CARGA_COMPLETADA: "2025-03-16 10:10",
      PESAJE_FINAL: "",
      SALIDA_APROBADA: "",
    },
  
    status: "En Ruta",
    updatedAt: "10:45 AM",
    updatedAgo: "hace 15 min",
    dispatchId: "#843295",
    departureDate: "23 Octubre, 2023 - 08:30 AM",
    eta: "23 Octubre, 2023 - 10:45 AM",
    loadType: "SODA CAUSTICA",
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
    personasAdicionales: [
      { rut: "11.111.111-1", nombre: "Juan Pérez" },
      { rut: "22.222.222-2", nombre: "María López" },
    ],
    contacts: [
      { name: "Dra. Maria Gonzalez", role: "Jefa de Abastecimiento", phone: "+56 9 1234 5678" },
      { name: "Jorge Ramirez", role: "Encargado de Recepción", phone: "+56 9 8765 4321" },
    ],
    events: [
      { title: "Aproximándose al destino", time: "11:00 AM", description: "El vehículo se encuentra a 2 km del punto de entrega." },
      { title: "Cambio de ruta", time: "10:15 AM", description: "El conductor ha tomado una ruta alternativa para evitar el tráfico." },
    ],
    documents: [
      { name: "Guía de Delivery", code: "#GD-542187" },
      { name: "Manifiesto de Carga", code: "#MC-98732" },
      { name: "Certificado de Calidad", code: "#CC-342156" },
      { name: "Orden de Compra", code: "#OC-76543" },
    ],
    observacionesOperativas: [
      { fecha: "2025-03-16 14:30", usuario: "Romanero OXY", texto: "Retraso en la carga debido a verificación de calidad adicional" },
      { fecha: "2025-03-16 15:00", usuario: "Operador OXY", texto: "Documentación completa verificada" },
    ],
    validacionesPDOP: [
      { campo: "Peso Neto", valor: "5,000 kg", estado: "Válido", requiereCorreccion: false },
      { campo: "Concentración", valor: "99.5%", estado: "Válido", requiereCorreccion: false },
      { campo: "Temperatura", valor: "25°C", estado: "Fuera de rango", requiereCorreccion: true },
      { campo: "Documentación", valor: "Completa", estado: "Válido", requiereCorreccion: false },
    ],
    items: [
      {
        itemNumber: "10",
        material: "SODA CAUSTICA",
        quantity: "5,000",
        unit: "kg",
        lot: "LOT-2025-04-23-A",
        productionDate: "2025-04-23",
      },
    ],
    weighingEvents: [
      {
        type: "ENTRADA",
        weight: "18,500 kg",
        datetime: "2025-03-16 08:35",
        source: "PESAMATIC",
      },
      {
        type: "SALIDA",
        weight: "26,500 kg",
        datetime: "",
        source: "PESAMATIC",
      },
    ],
    bitacora: [
      {
        id: "BIT-001",
        tipo: "creacion",
        titulo: "Reserva creada",
        descripcion: "Reserva RES-100045 creada en el sistema",
        usuario: "Operador OXY",
        fecha: "2025-03-15 10:30:25",
        icono: "create",
        color: brandColors.oxyBlue,
      },
      {
        id: "BIT-002",
        tipo: "asignacion",
        titulo: "Delivery asignado",
        descripcion: "Delivery #843295 asignado a la reserva",
        usuario: "Supervisor",
        fecha: "2025-03-15 11:15:42",
        icono: "assignment",
        color: brandColors.oceanAqua,
      },
      {
        id: "BIT-003",
        tipo: "aprobacion",
        titulo: "Aprobada para ingreso SAC",
        descripcion: "Reserva aprobada para ingreso desde SAC",
        usuario: "Admin Sistema",
        fecha: "2025-03-15 14:20:10",
        icono: "check",
        color: brandColors.forestGreen,
      },
      {
        id: "BIT-004",
        tipo: "estado",
        titulo: "Estado cambiado",
        descripcion: "Estado cambiado de 'Pendiente' a 'Confirmada'",
        usuario: "Operador OXY",
        fecha: "2025-03-15 15:45:33",
        icono: "info",
        color: brandColors.dayBlue,
      },
      {
        id: "BIT-005",
        tipo: "pesaje",
        titulo: "Pesaje inicial registrado",
        descripcion: "Pesaje inicial: 18,500 kg registrado desde PESAMATIC",
        usuario: "Sistema PESAMATIC",
        fecha: "2025-03-16 08:35:15",
        icono: "shipping",
        color: brandColors.sunriseOrange,
      },
      {
        id: "BIT-006",
        tipo: "observacion",
        titulo: "Observación agregada",
        descripcion: "Retraso en la carga debido a verificación de calidad adicional",
        usuario: "Romanero OXY",
        fecha: "2025-03-16 14:30:00",
        icono: "warning",
        color: brandColors.oxyRed,
      },
      {
        id: "BIT-007",
        tipo: "documento",
        titulo: "Documento agregado",
        descripcion: "Guía de Delivery #GD-542187 adjuntada",
        usuario: "Operador OXY",
        fecha: "2025-03-16 15:00:20",
        icono: "document",
        color: brandColors.midnightBlue,
      },
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
  
function DetalleReservaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const d = detailMock;
  
  // Buscar la reserva por ID
  const reserva = reservasRows.find((r) => r.id === id) || null;
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editFechaReserva, setEditFechaReserva] = useState("");
  const [editHoraReserva, setEditHoraReserva] = useState("");
  
    const PDOP_STEPS = [
      "DISPONIBLE",
      "EN_TRANSITO",
      "INGRESO_APROBADO",
      "PESAJE_INICIAL",
      "CAPTURA_DIGITAL",
      "CARGANDO",
      "CARGA_COMPLETADA",
      "PESAJE_FINAL",
      "SALIDA_APROBADA",
    ];
  
    const activeStepIndex = Math.max(PDOP_STEPS.indexOf(d.processStatus || "DISPONIBLE"), 0);
  
    const handleOpenEditModal = () => {
      if (reserva) {
        setEditFechaReserva(reserva.fechaReserva || "");
        setEditHoraReserva(reserva.horaReserva || "");
      }
      setDialogOpen(true);
    };
  
    const handleCloseDialog = () => {
      setDialogOpen(false);
      setEditFechaReserva("");
      setEditHoraReserva("");
    };
  
    const handleSaveReserva = () => {
      if (reserva) {
        // Aquí se guardaría en el backend
        console.log("Guardando reserva:", {
          id: reserva.id,
          fechaReserva: editFechaReserva,
          horaReserva: editHoraReserva,
        });
        // Actualizar el array local (en producción vendría del backend)
        const index = reservasRows.findIndex((r) => r.id === reserva.id);
        if (index !== -1) {
          reservasRows[index].fechaReserva = editFechaReserva;
          reservasRows[index].horaReserva = editHoraReserva;
        }
        handleCloseDialog();
      }
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
  
    const handleCopy = (value) => {
      if (!value) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).catch(() => {});
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
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
                  onClick={() => navigate("/dashboard/reservas")}
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
                  Reserva {d.reservationNumber}
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 0.5, flexWrap: "wrap" }}>
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
  
        {/* Timeline de estados PDOP */}
        <InfoCard title="Flujo PDOP del Delivery" icon={<History fontSize="small" />}>
          <Stepper activeStep={activeStepIndex} alternativeLabel sx={{ px: { xs: 0, sm: 1 } }}>
            {PDOP_STEPS.map((stepKey) => (
              <Step key={stepKey}>
                <StepLabel
                  optional={
                    d.processTimestamps[stepKey] ? (
                      <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
                        {d.processTimestamps[stepKey]}
                      </Typography>
                    ) : undefined
                  }
                >
                  <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
                    {stepKey.replace(/_/g, " ").toLowerCase()}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </InfoCard>
  
        {/* Estadísticas rápidas */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard icon={<Description fontSize="small" />} label="Delivery SAP" value={d.deliveryNumber} color={brandColors.oxyBlue} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard icon={<Schedule fontSize="small" />} label="Reserva PDOP" value={d.reservationNumber} color={brandColors.oceanAqua} />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard
              icon={<ReportProblem fontSize="small" />}
              label="Estado PDOP"
              value={d.processStatus.replace(/_/g, " ")}
              color={brandColors.sunriseOrange}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <StatCard icon={<AccessTime fontSize="small" />} label="Fecha Salida" value={d.departureDate.split(" - ")[0]} color={brandColors.dayBlue} />
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
  
              {/* Ítems del Delivery */}
              <InfoCard title="Ítems del Delivery" icon={<LocalShipping fontSize="small" />}>
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
                        <TableCell sx={{ fontWeight: 700, display: { xs: "none", md: "table-cell" } }}>ITEM</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Material</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Cantidad</TableCell>
                        <TableCell sx={{ fontWeight: 700, display: { xs: "none", sm: "table-cell" } }}>Unidad</TableCell>
                        <TableCell sx={{ fontWeight: 700, display: { xs: "none", lg: "table-cell" } }}>Lote</TableCell>
                        <TableCell sx={{ fontWeight: 700, display: { xs: "none", lg: "table-cell" } }}>Fecha Producción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {d.items.map((item) => (
                        <TableRow key={item.itemNumber}>
                          <TableCell sx={{ fontFamily: "monospace", fontWeight: 600, display: { xs: "none", md: "table-cell" } }}>
                            {item.itemNumber}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{item.material}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{item.unit}</TableCell>
                          <TableCell sx={{ fontFamily: "monospace", display: { xs: "none", lg: "table-cell" } }}>{item.lot}</TableCell>
                          <TableCell sx={{ display: { xs: "none", lg: "table-cell" } }}>{item.productionDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </InfoCard>
  
              {/* Pesajes */}
              <InfoCard title="Pesajes PESAMATIC / Báscula" icon={<LocalShipping fontSize="small" />}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Peso</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Fecha y Hora</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Origen</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {d.weighingEvents.map((w, idx) => (
                        <TableRow key={`${w.type}-${idx}`}>
                          <TableCell>{w.type === "ENTRADA" ? "Entrada" : "Salida"}</TableCell>
                          <TableCell sx={{ fontFamily: "monospace" }}>{w.weight}</TableCell>
                          <TableCell sx={{ fontFamily: "monospace" }}>{w.datetime || "-"}</TableCell>
                          <TableCell>{w.source}</TableCell>
                        </TableRow>
                      ))}
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
  
              {/* Personas Adicionales */}
              {d.personasAdicionales && d.personasAdicionales.length > 0 && (
                <InfoCard title="Personas Adicionales" icon={<Person fontSize="small" />}>
                  <Stack spacing={1.5}>
                    {d.personasAdicionales.map((persona, idx) => (
                      <Paper
                        key={idx}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          bgcolor: `${brandColors.dayBlue}05`,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: brandColors.midnightBlue }}>
                              {persona.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                              RUT: {persona.rut}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                </InfoCard>
              )}
  
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
  
        {/* Modal de Edición de Reserva */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            Editar Reserva {reserva?.id || d.reservationNumber}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Solo se pueden editar la fecha y hora de reserva
              </Typography>

              {/* Campos de solo lectura */}
              <TextField
                label="ID Reserva"
                value={reserva?.id || d.reservationNumber || ""}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />
              <TextField
                label="Delivery"
                value={reserva?.deliveryId || d.dispatchId || "Sin delivery"} 
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />
              <TextField
                label="Cliente"
                value={reserva?.cliente || ""}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />
              <TextField
                label="Producto"
                value={reserva?.producto || d.loadType || ""}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />
              <TextField
                label="Cantidad"
                value={reserva?.cantidad || ""}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />
              <TextField
                label="Estado"
                value={reserva?.estado || d.status || ""}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />

              <Divider sx={{ my: 1 }} />

              {/* Campos editables */}
              <TextField
                label="Fecha de Reserva"
                type="date"
                value={editFechaReserva}
                onChange={(event) => setEditFechaReserva(event.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
                required
              />
              <TextField
                label="Hora de Reserva"
                type="time"
                value={editHoraReserva}
                onChange={(event) => setEditHoraReserva(event.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseDialog} variant="text" size="small">
              Cancelar
            </Button>
            <Button onClick={handleSaveReserva} variant="contained" color="primary" size="small" startIcon={<Edit />}>
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    );
  }
  
  export default DetalleReservaPage;
  