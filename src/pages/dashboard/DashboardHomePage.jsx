import { useMemo, useState, useRef } from "react";
import { toast } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es.js";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import RouteOutlined from "@mui/icons-material/RouteOutlined";
import TaskAltOutlined from "@mui/icons-material/TaskAltOutlined";
import ReportProblemOutlined from "@mui/icons-material/ReportProblemOutlined";
import TimelineOutlined from "@mui/icons-material/TimelineOutlined";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import MoreVertOutlined from "@mui/icons-material/MoreVertOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import InventoryOutlined from "@mui/icons-material/InventoryOutlined";
import BookmarkBorderOutlined from "@mui/icons-material/BookmarkBorderOutlined";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { brandColors } from "../../theme";
import { dispatchRows } from "./DespachosPage";
import { reservasRows } from "./ReservasPage";

// ============================================
// CONSTANTES Y DATOS MOCK
// ============================================

const BASE_KPIS = [
  {
    title: "Delivery Totales",
    value: 248,
    delta: "Deliverys activas de SAP",
    color: brandColors.oxyBlue,
    icon: LocalShippingOutlined,
  },
  {
    title: "En Proceso",
    value: 42,
    delta: "Aprobadas para ingreso SAC",
    color: brandColors.oceanAqua,
    icon: RouteOutlined,
  },
  {
    title: "Completados Hoy",
    value: 28,
    delta: "+8 vs ayer",
    color: brandColors.dayBlue,
    icon: TaskAltOutlined,
  },
  {
    title: "Alertas",
    value: 5,
    delta: "Requieren atención",
    color: brandColors.oxyRed,
    icon: ReportProblemOutlined,
  },
];

const STATUS_ROWS = [
  { label: "Entregados", value: 152, total: 248, color: brandColors.oceanAqua },
  { label: "En ruta", value: 42, total: 248, color: brandColors.sunriseOrange },
  { label: "Programados", value: 49, total: 248, color: brandColors.dayBlue },
  { label: "Cancelados", value: 5, total: 248, color: brandColors.oxyRed },
];

// Función auxiliar para convertir fecha DD/MM/YYYY a Date
const parseDeliveryDate = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("/");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

// Función auxiliar para convertir Date a YYYY-MM-DD (fecha local)
const formatDateToKey = (date) => {
  if (!date || isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Función auxiliar para formatear fecha a DD/MM
const formatDateShort = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
};

// Función auxiliar para obtener nombre del día
const getDayName = (date) => {
  const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  return days[date.getDay()];
};

const DISPATCHES_BY_LOAD_TYPE = [
  { label: "SODA CAUSTICA", orders: 45, kg: 125000, color: brandColors.dayBlue },
  { label: "HIPOCLORITO DE SODIO", orders: 38, kg: 98000, color: brandColors.oxyBlue },
  { label: "A CLORHIDRICO", orders: 32, kg: 76000, color: brandColors.oceanAqua },
  { label: "CLORURO FERRICO", orders: 28, kg: 89000, color: brandColors.sunriseOrange },
  { label: "CALCIO TUR", orders: 22, kg: 65000, color: brandColors.aluminumGray },
  { label: "CALCIO REFI", orders: 18, kg: 52000, color: brandColors.morningBlue },
  { label: "A SULFURICO DILUIDO", orders: 15, kg: 42000, color: brandColors.oxyRed },
  { label: "CLORO", orders: 12, kg: 35000, color: brandColors.midnightBlue },
];

// ============================================
// COMPONENTES REUTILIZABLES
// ============================================

function SummaryBanner() {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.4 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        mb: 2.4,
        background: `linear-gradient(120deg, ${brandColors.morningBlue}44, rgba(255,255,255,0.95) 45%, ${brandColors.oxyRed}14)`,
        boxShadow: "0px 8px 20px rgba(0, 46, 77, 0.06)",
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        Resumen ejecutivo de operación: visualiza rendimiento, entregas y estado de deliveries.
      </Typography>
    </Box>
  );
}

function FiltersBar({ onExport }) {
  return (
    <Paper
      sx={{
        p: 1.8,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "0px 6px 18px rgba(0, 46, 77, 0.05)",
      }}
    >
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.4} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          La data de este dashboard inicialmente carga la información del día en curso
        </Typography>
        <Button variant="outlined" color="primary" startIcon={<DownloadOutlined />} size="small" onClick={onExport} sx={{ alignSelf: { xs: "flex-start", md: "center" } }}>
          Exportar KPI
        </Button>
      </Stack>
    </Paper>
  );
}

function KpiCard({ item, onClick }) {
  const Icon = item.icon;
  const miniBars = [9, 12, 11, 13, 15, 14];

  return (
    <Paper
      sx={{
        p: 2.4,
        border: "1px solid",
        borderColor: "divider",
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: "0px 8px 20px rgba(0, 46, 77, 0.06)",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        cursor: onClick ? "pointer" : "default",
        "&:hover": {
          transform: onClick ? "translateY(-3px)" : "none",
          boxShadow: onClick ? "0px 12px 28px rgba(0, 46, 77, 0.1)" : "0px 8px 20px rgba(0, 46, 77, 0.06)",
        },
      }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, bgcolor: item.color }} />
      <Stack spacing={1.2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {item.title}
          </Typography>
          <Avatar sx={{ width: 36, height: 36, bgcolor: `${item.color}18`, color: item.color }}>
            <Icon fontSize="small" />
          </Avatar>
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {item.value}
        </Typography>
        <Typography variant="caption" sx={{ color: item.color, fontWeight: 600 }}>
          {item.delta}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ mt: 0.8 }}>
          {miniBars.map((height, index) => (
            <Box
              key={`${item.title}-${index}`}
              sx={{
                width: 6,
                height: `${height}px`,
                bgcolor: `${item.color}70`,
                borderRadius: "8px 8px 2px 2px",
                transition: "height 200ms ease",
              }}
            />
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

function ChartCard({ title, subtitle, action, children, onCalendarClick }) {
  return (
    <Paper
      sx={{
        p: 2.4,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        borderRadius: 2,
        boxShadow: "0px 8px 20px rgba(0, 46, 77, 0.06)",
        backgroundColor: "rgba(255,255,255,0.98)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.4 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {onCalendarClick && (
            <Tooltip title="Filtrar por fecha" arrow placement="top">
              <IconButton size="small" onClick={onCalendarClick} sx={{ color: brandColors.dayBlue }}>
                <CalendarToday fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {action && <Box>{action}</Box>}
        </Stack>
      </Stack>
      {children}
    </Paper>
  );
}

function StatusBar({ row }) {
  const percent = Math.round((row.value / row.total) * 100);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {row.label}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {row.value}
        </Typography>
      </Stack>
      <Box
        sx={{
          height: 12,
          borderRadius: 10,
          bgcolor: "grey.200",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${percent}%`,
            bgcolor: row.color,
            transition: "width 300ms ease",
          }}
        />
      </Box>
    </Box>
  );
}

function DayBarChart({ data }) {
  const maxValue = Math.max(...data.map((item) => Math.max(item.planned, item.completed)));
  const chartHeight = 150;

  // Obtener fecha actual en formato YYYY-MM-DD usando fecha local
  const hoy = new Date();
  const year = hoy.getFullYear();
  const month = String(hoy.getMonth() + 1).padStart(2, "0");
  const day = String(hoy.getDate()).padStart(2, "0");
  const hoyKey = `${year}-${month}-${day}`;

  return (
    <Stack spacing={1.6}>
      <Stack direction="row" spacing={1.5}>
        <Chip
          label="Planificados"
          size="small"
          sx={{
            bgcolor: `${brandColors.morningBlue}CC`,
            color: brandColors.midnightBlue,
            fontWeight: 600,
          }}
        />
        <Chip
          label="Completados"
          size="small"
          sx={{
            bgcolor: `${brandColors.oceanAqua}22`,
            color: brandColors.midnightBlue,
            fontWeight: 600,
          }}
        />
      </Stack>
      <Box sx={{ height: chartHeight, position: "relative", display: "flex", flexDirection: "column" }}>
        <Box sx={{ flex: 1, display: "flex", alignItems: "flex-end", pb: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ width: "100%", height: "100%" }}>
            {data.map((item) => {
              const plannedHeight = maxValue > 0 ? (item.planned / maxValue) * 100 : 0;
              const completedHeight = maxValue > 0 ? (item.completed / maxValue) * 100 : 0;
              const esHoy = item.fechaCompleta === hoyKey;
              
              return (
                <Stack 
                  key={item.fechaCompleta || item.day} 
                  alignItems="center" 
                  spacing={0.2} 
                  sx={{ 
                    height: "100%", 
                    justifyContent: "flex-end",
                    position: "relative",
                    px: 0.5,
                  }}
                >
                  <Stack 
                    direction="row" 
                    spacing={0.5} 
                    alignItems="flex-end" 
                    sx={{ 
                      height: "100%",
                    }}
                  >
                    <Box sx={{ position: "relative", width: 16, height: "100%", display: "flex", alignItems: "flex-end" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          top: -18,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontWeight: 700,
                          color: brandColors.dayBlue,
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.planned}
                      </Typography>
                      <Box
                        sx={{
                          width: 16,
                          height: `${plannedHeight}%`,
                          minHeight: plannedHeight > 0 ? "4px" : 0,
                          borderRadius: "12px 12px 4px 4px",
                          bgcolor: brandColors.dayBlue,
                          boxShadow: "inset 0 -2px 0 rgba(255,255,255,0.25)",
                          transition: "height 300ms ease",
                        }}
                      />
                    </Box>
                    <Box sx={{ position: "relative", width: 16, height: "100%", display: "flex", alignItems: "flex-end" }}>
                      <Typography
                        variant="caption"
                        sx={{
                          position: "absolute",
                          top: -18,
                          left: "50%",
                          transform: "translateX(-50%)",
                          fontWeight: 700,
                          color: brandColors.oceanAqua,
                          lineHeight: 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.completed}
                      </Typography>
                      <Box
                        sx={{
                          width: 16,
                          height: `${completedHeight}%`,
                          minHeight: completedHeight > 0 ? "4px" : 0,
                          borderRadius: "12px 12px 4px 4px",
                          bgcolor: brandColors.oceanAqua,
                          boxShadow: "inset 0 -2px 0 rgba(255,255,255,0.25)",
                          transition: "height 300ms ease",
                        }}
                      />
                    </Box>
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.2 }}>
          {data.map((item) => {
            const esHoy = item.fechaCompleta === hoyKey;
            return (
              <Box 
                key={item.fechaCompleta || item.day} 
                sx={{ 
                  minWidth: 40, 
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    fontWeight: esHoy ? 700 : 500, 
                    display: "block",
                    color: esHoy ? brandColors.oxyRed : "text.secondary",
                  }}
                >
                  {item.day}
                </Typography>
                {item.dayName && (
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: esHoy ? 24 : "auto",
                      height: esHoy ? 24 : "auto",
                      borderRadius: esHoy ? "50%" : 0,
                      bgcolor: esHoy ? brandColors.oxyRed : "transparent",
                      color: esHoy ? "white" : "text.secondary",
                      mt: 0.5,
                    }}
                  >
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: "0.65rem", 
                        opacity: esHoy ? 1 : 0.7,
                        fontWeight: esHoy ? 700 : 400,
                        color: esHoy ? "white" : "text.secondary",
                      }}
                    >
                      {item.dayName}
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
}

function DispatchesByLoadTypeChart({ data, totalDespachos }) {
  const totalKg = data.reduce((acc, item) => acc + item.kg, 0);
  const totalDespachosValue = totalDespachos || 248;

  return (
    <Stack spacing={1.6}>
      {data.map((item) => {
        const percent = totalDespachosValue > 0 ? Math.round((item.orders / totalDespachosValue) * 100) : 0;
        return (
          <Box key={item.label}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.label}
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {item.orders} órdenes ({percent}%)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: "0.75rem" }}>
                  {item.kg.toLocaleString("es-CL")} kg
                </Typography>
              </Stack>
            </Stack>
            <Box
              sx={{
                height: 12,
                borderRadius: 10,
                bgcolor: "grey.200",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${percent}%`,
                  bgcolor: item.color,
                  transition: "width 300ms ease",
                }}
              />
            </Box>
          </Box>
        );
      })}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
        <Chip
          size="small"
          label={`TOTAL ORDENES: ${totalDespachosValue}`}
          sx={{
            bgcolor: `${brandColors.morningBlue}AA`,
            color: brandColors.midnightBlue,
            fontWeight: 600,
          }}
        />
        <Chip
          size="small"
          label={`TOTAL KG: ${totalKg.toLocaleString("es-CL")}`}
          sx={{
            bgcolor: `${brandColors.oceanAqua}AA`,
            color: brandColors.midnightBlue,
            fontWeight: 600,
          }}
        />
      </Stack>
    </Stack>
  );
}

function ReservasWithoutDeliveryCard({ reservas, onItemClick }) {
  return (
    <Paper
      sx={{
        p: 2.4,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        boxShadow: "0px 8px 20px rgba(0, 46, 77, 0.06)",
        backgroundColor: "rgba(255,255,255,0.98)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.4 }}>
            <WarningAmberOutlined sx={{ color: brandColors.sunriseOrange, fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Reserva sin Delivery
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Reservas pendientes de asignar delivery
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${reservas.length} pendientes`}
          sx={{
            bgcolor: `${brandColors.sunriseOrange}22`,
            color: brandColors.sunriseOrange,
            fontWeight: 600,
          }}
        />
      </Stack>
      <Grid container spacing={1.5}>
        {reservas.map((reserva) => (
          <Grid key={reserva.reservaId} size={{ xs: 12, sm: 6, md: 3 }}>
            <Box
              sx={{
                p: 1.2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                bgcolor: "grey.50",
                height: "100%",
                cursor: onItemClick ? "pointer" : "default",
                "&:hover": onItemClick
                  ? {
                      borderColor: brandColors.sunriseOrange,
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
                      bgcolor: "white",
                    }
                  : undefined,
              }}
              onClick={onItemClick ? () => onItemClick(reserva) : undefined}
            >
              <Stack spacing={0.8}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {reserva.reservaId}
                  </Typography>
                  {reserva.diasSinDelivery !== undefined && (
                    <Chip
                      label={`${reserva.diasSinDelivery} día${reserva.diasSinDelivery !== 1 ? 's' : ''}`}
                      size="small"
                      sx={{
                        bgcolor: reserva.diasSinDelivery >= 7 ? brandColors.oxyRed : reserva.diasSinDelivery >= 3 ? brandColors.sunriseOrange : `${brandColors.sunriseOrange}40`,
                        color: reserva.diasSinDelivery >= 7 ? "white" : reserva.diasSinDelivery >= 3 ? "white" : brandColors.midnightBlue,
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        height: 20,
                      }}
                    />
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                  {reserva.cliente} • {reserva.producto}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {reserva.fecha}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.sunriseOrange }}>
                    {reserva.cantidad}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function DashboardHomePage() {
  const navigate = useNavigate();
  
  // Calcular inicio y fin de la semana en curso
  const getStartOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar para que lunes sea el primer día
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split("T")[0];
  };

  const getEndOfWeek = (date = new Date()) => {
    const start = getStartOfWeek(date);
    const sunday = new Date(start);
    sunday.setDate(sunday.getDate() + 6);
    return sunday.toISOString().split("T")[0];
  };

  // Obtener fecha actual en formato YYYY-MM-DD
  const getTodayKey = () => {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Estados para filtros de fecha del gráfico "Delivery por Día" (inicialmente semana en curso)
  const [chartFromDate, setChartFromDate] = useState(getStartOfWeek());
  const [chartToDate, setChartToDate] = useState(getEndOfWeek());
  
  // Estados para filtros de fecha del gráfico "Delivery por Tipo de Carga" (inicialmente día actual)
  const [loadTypeFromDate, setLoadTypeFromDate] = useState(getTodayKey());
  const [loadTypeToDate, setLoadTypeToDate] = useState(getTodayKey());
  
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(getStartOfWeek());
  const [tempToDate, setTempToDate] = useState(getEndOfWeek());
  const [calendarModalType, setCalendarModalType] = useState(null); // 'day' o 'loadType'
  
  // Estados para el modal de edición de reserva
  const [editReservaModalOpen, setEditReservaModalOpen] = useState(false);
  const [selectedReservaForEdit, setSelectedReservaForEdit] = useState(null);
  const [editFechaReserva, setEditFechaReserva] = useState("");
  const [editHoraReserva, setEditHoraReserva] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const calendarRef = useRef(null);

  // Factor fijo para los KPIs (ya no depende de filtros de fecha)
  const factor = 1;

  // Calcular reservas pendientes (sin delivery asociado)
  const reservasPendientes = useMemo(() => {
    // Contar solo las reservas que no tienen deliveryId asignado (null, undefined o string vacío)
    return reservasRows.filter((reserva) => {
      return reserva.deliveryId === null || reserva.deliveryId === undefined || reserva.deliveryId === "";
    }).length;
  }, []);

  // Calcular deliverys y reservas aprobadas para ingreso desde SAC
  const enProceso = useMemo(() => {
    // Contar deliverys aprobados para ingreso desde SAC (status === "INGRESO_APROBADO")
    const deliverysAprobados = dispatchRows.filter((delivery) => {
      return delivery.status === "INGRESO_APROBADO";
    }).length;

    // Contar reservas aprobadas para ingreso desde SAC
    const reservasAprobadas = reservasRows.filter((reserva) => {
      // Verificar si tiene el campo aprobadoIngresoSAC o si el estado indica aprobación
      return reserva.aprobadoIngresoSAC === true || reserva.estado === "Confirmada";
    }).length;

    // Retornar el total de deliverys y reservas aprobadas
    return deliverysAprobados + reservasAprobadas;
  }, []);

  // Calcular completados hoy (deliveries con status "Completado" del día actual)
  const completadosHoy = useMemo(() => {
    // Obtener fecha actual en formato local
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    const hoyKey = `${year}-${month}-${day}`;

    // Contar deliveries completados del día actual (status === "SALIDA_APROBADA")
    return dispatchRows.filter((delivery) => {
      if (delivery.status !== "SALIDA_APROBADA") return false;
      
      // Obtener fecha del delivery
      const fechaStr = delivery.scheduledDate || delivery.deliveryDate;
      if (!fechaStr) return false;
      
      const fecha = parseDeliveryDate(fechaStr);
      if (!fecha || isNaN(fecha.getTime())) return false;
      
      const fechaKey = formatDateToKey(fecha);
      return fechaKey === hoyKey;
    }).length;
  }, []);

  // Calcular deliveries del día actual
  const deliveryTotalesHoy = useMemo(() => {
    // Obtener fecha actual en formato local
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, "0");
    const day = String(hoy.getDate()).padStart(2, "0");
    const hoyKey = `${year}-${month}-${day}`;

    // Contar todos los deliveries del día actual (sin importar el status)
    return dispatchRows.filter((delivery) => {
      // Obtener fecha del delivery
      const fechaStr = delivery.scheduledDate || delivery.deliveryDate;
      if (!fechaStr) return false;
      
      const fecha = parseDeliveryDate(fechaStr);
      if (!fecha || isNaN(fecha.getTime())) return false;
      
      const fechaKey = formatDateToKey(fecha);
      return fechaKey === hoyKey;
    }).length;
  }, []);

  const kpis = useMemo(() => {
    // Crear la lista de KPIs
    const baseKpis = BASE_KPIS.map((kpi) => {
      if (kpi.title === "Delivery Totales") {
        // Usar el total de deliverys del día actual
        return { ...kpi, value: deliveryTotalesHoy };
      }
      if (kpi.title === "En Proceso") {
        // Usar el conteo real de deliverys y reservas aprobadas para ingreso SAC
        return { ...kpi, value: enProceso };
      }
      if (kpi.title === "Completados Hoy") {
        // Usar el conteo real de deliveries completados del día actual
        return { ...kpi, value: completadosHoy };
      }
      if (kpi.title === "Alertas") {
        // Calcular alertas: deliveries con status "No Recogido" del día actual o anteriores
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        const alertas = dispatchRows.filter((delivery) => {
          if (delivery.status !== "No Recogido") return false;
          
          const fechaStr = delivery.scheduledDate || delivery.deliveryDate;
          if (!fechaStr) return false;
          
          const fecha = parseDeliveryDate(fechaStr);
          if (!fecha || isNaN(fecha.getTime())) return false;
          
          const fechaNormalizada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
          // Contar solo los que son del día actual o anteriores
          return fechaNormalizada <= hoy;
        }).length;
        
        return { ...kpi, value: alertas };
      }
      return { ...kpi, value: Math.max(1, Math.round(kpi.value * factor)) };
    });
    
    // Insertar el KPI de Reservas Pendientes después de Delivery Totales
    const deliveryIndex = baseKpis.findIndex((kpi) => kpi.title === "Delivery Totales");
    baseKpis.splice(deliveryIndex + 1, 0, {
      title: "Reservas Pendientes",
      value: reservasPendientes,
      delta: "Sin delivery asociado",
      color: brandColors.sunriseOrange,
      icon: BookmarkBorderOutlined,
    });
    
    return baseKpis;
  }, [factor, reservasPendientes, enProceso, completadosHoy, deliveryTotalesHoy]);

  const filteredStatusRows = useMemo(() => {
    // Usar el total real de deliverys de la tabla
    const total = dispatchRows.length;
    return STATUS_ROWS.map((row) => {
      const newValue = Math.max(1, Math.round(row.value * factor));
      return { ...row, value: newValue, total };
    });
  }, [factor]);

  const filteredDayData = useMemo(() => {
    // Obtener todas las fechas únicas de deliverys dentro del rango de fechas
    const fechaMap = new Map();
    const startDate = chartFromDate ? new Date(chartFromDate) : null;
    const endDate = chartToDate ? new Date(chartToDate) : null;

    // Procesar todos los deliverys del listado mock (dispatchRows)
    // Los "planificados" son todos los deliveries que tienen fecha programada (scheduledDate o deliveryDate)
    dispatchRows.forEach((delivery) => {
      // Usar scheduledDate como prioridad, si no existe usar deliveryDate
      const fechaStr = delivery.scheduledDate || delivery.deliveryDate;
      if (fechaStr) {
        const fecha = parseDeliveryDate(fechaStr);
        if (fecha && !isNaN(fecha.getTime())) {
          // Normalizar fecha a inicio del día para comparación
          const fechaNormalizada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
          
          // Filtrar por rango de fechas si están definidas
          if (startDate) {
            const startNormalizada = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            if (fechaNormalizada < startNormalizada) return;
          }
          if (endDate) {
            const endNormalizada = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            if (fechaNormalizada > endNormalizada) return;
          }

          const fechaKey = formatDateToKey(fechaNormalizada); // YYYY-MM-DD (fecha local)
          if (!fechaKey) return;
          
          // Inicializar el día si no existe
          if (!fechaMap.has(fechaKey)) {
            fechaMap.set(fechaKey, {
              fecha: fechaNormalizada,
              fechaKey,
              planned: 0, // Contador de deliveries planificados para este día
              completed: 0, // Contador de deliveries completados para este día
            });
          }
          
          // Contar este delivery como planificado (todos los deliveries con fecha se cuentan como planificados)
          fechaMap.get(fechaKey).planned += 1;
          
          // Contar como completado solo si el status es "SALIDA_APROBADA"
          if (delivery.status === "SALIDA_APROBADA") {
            fechaMap.get(fechaKey).completed += 1;
          }
        }
      }
    });

    // Asegurar que siempre se muestren todos los días del rango seleccionado,
    // aunque no tengan datos (planned/completed = 0)
    const datosPorFecha = [];

    if (startDate && endDate) {
      const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const endDateObj = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

      while (currentDate <= endDateObj) {
        const fechaKey = formatDateToKey(currentDate);
        if (fechaKey) {
          const existente = fechaMap.get(fechaKey);
          if (existente) {
            datosPorFecha.push(existente);
          } else {
            datosPorFecha.push({
              fecha: new Date(currentDate),
              fechaKey,
              planned: 0,
              completed: 0,
            });
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      // Fallback: usar solo los días con datos si no hay rango definido
      Array.from(fechaMap.values())
        .sort((a, b) => a.fecha - b.fecha)
        .forEach((item) => datosPorFecha.push(item));
    }

    // Formatear para el gráfico
    return datosPorFecha.map((item) => ({
      day: formatDateShort(item.fecha),
      dayName: getDayName(item.fecha),
      fechaCompleta: item.fechaKey,
      planned: item.planned, // Solo deliveries planificados
      completed: item.completed, // Solo deliveries completados
    }));
  }, [chartFromDate, chartToDate, dispatchRows]);

  // Calcular deliveries por tipo de carga filtrados por fecha (usa fechas del gráfico de tipo de carga)
  const filteredDispatchesByLoadType = useMemo(() => {
    // Crear fechas en formato local para evitar problemas de zona horaria
    let startDate = null;
    let endDate = null;
    
    if (loadTypeFromDate) {
      const [year, month, day] = loadTypeFromDate.split('-').map(Number);
      startDate = new Date(year, month - 1, day);
    }
    
    if (loadTypeToDate) {
      const [year, month, day] = loadTypeToDate.split('-').map(Number);
      endDate = new Date(year, month - 1, day);
    }

    // Agrupar deliveries por tipo de producto dentro del rango de fechas
    const tipoMap = new Map();
    
    dispatchRows.forEach((delivery) => {
      const fechaStr = delivery.scheduledDate || delivery.deliveryDate;
      if (fechaStr) {
        const fecha = parseDeliveryDate(fechaStr);
        if (fecha && !isNaN(fecha.getTime())) {
          const fechaNormalizada = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
          
          // Filtrar por rango de fechas
          if (startDate) {
            const startNormalizada = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            if (fechaNormalizada < startNormalizada) return;
          }
          if (endDate) {
            const endNormalizada = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            if (fechaNormalizada > endNormalizada) return;
          }

          const producto = delivery.product || "";
          if (!tipoMap.has(producto)) {
            tipoMap.set(producto, { orders: 0, kg: 0 });
          }
          tipoMap.get(producto).orders += 1;
          // Extraer kg de deliveryQuantity (formato: "XX,XXX TO")
          const kgStr = delivery.deliveryQuantity?.replace(/[,\sTO]/g, "") || "0";
          const kg = parseInt(kgStr, 10) || 0;
          tipoMap.get(producto).kg += kg;
        }
      }
    });

    // Mapear a la estructura esperada, manteniendo los colores originales
    return DISPATCHES_BY_LOAD_TYPE.map((item) => {
      const data = tipoMap.get(item.label) || { orders: 0, kg: 0 };
      return {
        ...item,
        orders: data.orders,
        kg: data.kg,
      };
    }).filter((item) => item.orders > 0); // Solo mostrar tipos con órdenes
  }, [loadTypeFromDate, loadTypeToDate]);

  const handleExportKpi = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      kpis: kpis.map(({ title, value, delta }) => ({ title, value, delta })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kpi-dashboard-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Funciones para el modal de edición de reserva
  const getReservasByDate = (fechaKey) => {
    return reservasRows.filter((reserva) => {
      if (!reserva.fechaReserva) return false;
      return reserva.fechaReserva === fechaKey;
    });
  };

  const getHorariosOcupados = (fechaKey) => {
    const reservas = getReservasByDate(fechaKey);
    return reservas.map((r) => r.horaReserva).filter((h) => h);
  };

  const generarHorariosDisponibles = (fechaSeleccionada) => {
    const horarios = [];
    const horariosOcupados = fechaSeleccionada ? getHorariosOcupados(fechaSeleccionada) : [];
    
    for (let hora = 6; hora <= 17; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horaStr = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
        const disponible = !horariosOcupados.includes(horaStr);
        horarios.push({ hora: horaStr, disponible });
      }
    }
    return horarios;
  };

  // Obtener deliveries que no tienen reserva asociada (o el delivery actual si se está editando)
  const deliveriesSinReserva = useMemo(() => {
    const deliveryIdsConReserva = new Set(
      reservasRows
        .filter((r) => {
          // Si estamos editando, excluir la reserva actual del filtro
          if (selectedReservaForEdit && r.id === selectedReservaForEdit.id) {
            return false;
          }
          return r.deliveryId && r.deliveryId !== null && r.deliveryId !== undefined && r.deliveryId !== "";
        })
        .map((r) => {
          const match = r.deliveryId.match(/DEL-(\d+)/);
          return match ? match[1] : null;
        })
        .filter((id) => id !== null)
    );

    const deliveriesDisponibles = dispatchRows
      .filter((delivery) => {
        return !deliveryIdsConReserva.has(delivery.actNumber);
      })
      .map((delivery) => ({
        value: delivery.actNumber,
        label: `DEL-${delivery.actNumber} - ${delivery.product} - ${delivery.customerAddress?.substring(0, 30) || delivery.company}`,
        delivery: delivery,
      }));

    // Si estamos editando y la reserva tiene un delivery, agregarlo a la lista
    if (selectedReservaForEdit && selectedReservaForEdit.deliveryId) {
      const deliveryNumber = selectedReservaForEdit.deliveryId.replace(/^DEL-/, "");
      const deliveryActual = dispatchRows.find((d) => d.actNumber === deliveryNumber);
      if (deliveryActual) {
        const deliveryActualOption = {
          value: deliveryActual.actNumber,
          label: `DEL-${deliveryActual.actNumber} - ${deliveryActual.product} - ${deliveryActual.customerAddress?.substring(0, 30) || deliveryActual.company}`,
          delivery: deliveryActual,
        };
        if (!deliveriesDisponibles.find((d) => d.value === deliveryActual.actNumber)) {
          deliveriesDisponibles.unshift(deliveryActualOption);
        }
      }
    }

    return deliveriesDisponibles;
  }, [selectedReservaForEdit]);

  // Convertir reservas a eventos de FullCalendar
  const calendarEvents = useMemo(() => {
    return reservasRows
      .filter((reserva) => reserva.fechaReserva && reserva.horaReserva)
      .map((reserva) => {
        const [year, month, day] = reserva.fechaReserva.split("-").map(Number);
        const [hora, minuto] = reserva.horaReserva.split(":").map(Number);
        const fecha = new Date(year, month - 1, day, hora, minuto, 0);

        let backgroundColor = brandColors.sunriseOrange;
        let borderColor = brandColors.sunriseOrange;

        if (reserva.estado === "Confirmada" || reserva.estado === "Completada") {
          backgroundColor = brandColors.forestGreen;
          borderColor = brandColors.forestGreen;
        } else if (reserva.estado === "Anulada") {
          backgroundColor = brandColors.aluminumGray;
          borderColor = brandColors.aluminumGray;
        } else if (reserva.aprobadoIngresoSAC) {
          backgroundColor = brandColors.dayBlue;
          borderColor = brandColors.dayBlue;
        }

        return {
          id: reserva.id,
          title: reserva.id,
          start: fecha,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          textColor: "white",
          extendedProps: {
            reserva: reserva,
          },
        };
      });
  }, []);

  const handleOpenEditReservaModal = (reserva) => {
    setSelectedReservaForEdit(reserva);
    setEditFechaReserva(reserva.fechaReserva || "");
    setEditHoraReserva(reserva.horaReserva || "");
    
    // Si tiene delivery, extraer el número del deliveryId
    if (reserva.deliveryId) {
      const deliveryNumber = reserva.deliveryId.replace(/^DEL-/, "");
      setSelectedDelivery(deliveryNumber);
    } else {
      setSelectedDelivery("");
    }
    
    setEditReservaModalOpen(true);
    
    // Cambiar la vista del calendario a la fecha de la reserva si existe
    if (reserva.fechaReserva && calendarRef.current) {
      setTimeout(() => {
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          const fecha = new Date(reserva.fechaReserva);
          calendarApi.gotoDate(fecha);
          calendarApi.changeView("timeGridDay", reserva.fechaReserva);
        }
      }, 100);
    }
  };

  const handleCloseEditReservaModal = () => {
    setEditReservaModalOpen(false);
    setSelectedReservaForEdit(null);
    setEditFechaReserva("");
    setEditHoraReserva("");
    setSelectedDelivery("");
  };

  const handleSelectSlot = (selectInfo) => {
    const fechaInicio = selectInfo.start;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(fechaInicio);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    
    if (fechaSeleccionada < hoy) {
      if (calendarRef.current) {
        calendarRef.current.getApi().unselect();
      }
      return;
    }
    
    const year = fechaInicio.getFullYear();
    const month = String(fechaInicio.getMonth() + 1).padStart(2, "0");
    const day = String(fechaInicio.getDate()).padStart(2, "0");
    const fechaKey = `${year}-${month}-${day}`;
    
    setEditFechaReserva(fechaKey);
    
    const hora = fechaInicio.getHours();
    const minuto = fechaInicio.getMinutes();
    
    if (hora >= 6 && hora <= 17) {
      const minutoRedondeado = minuto < 30 ? 0 : 30;
      const horaStr = `${String(hora).padStart(2, "0")}:${String(minutoRedondeado).padStart(2, "0")}`;
      const horariosOcupados = getHorariosOcupados(fechaKey);
      
      if (!horariosOcupados.includes(horaStr)) {
        setEditHoraReserva(horaStr);
      } else {
        const horariosDisponibles = generarHorariosDisponibles(fechaKey);
        const siguienteDisponible = horariosDisponibles.find(h => h.disponible && h.hora > horaStr);
        if (siguienteDisponible) {
          setEditHoraReserva(siguienteDisponible.hora);
        }
      }
    } else {
      const horariosDisponibles = generarHorariosDisponibles(fechaKey);
      const primerDisponible = horariosDisponibles.find(h => h.disponible);
      if (primerDisponible) {
        setEditHoraReserva(primerDisponible.hora);
      }
    }
  };

  const handleDateClick = (dateClickInfo) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentView = calendarApi.view.type;
      
      if (currentView === "dayGridMonth") {
        calendarApi.changeView("timeGridDay", dateClickInfo.dateStr);
        
        const fecha = new Date(dateClickInfo.date);
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, "0");
        const day = String(fecha.getDate()).padStart(2, "0");
        const fechaKey = `${year}-${month}-${day}`;
        setEditFechaReserva(fechaKey);
        
        const horariosDisponibles = generarHorariosDisponibles(fechaKey);
        const primerDisponible = horariosDisponibles.find(h => h.disponible);
        if (primerDisponible) {
          setEditHoraReserva(primerDisponible.hora);
        }
      }
    }
  };

  const handleSaveEditReserva = () => {
    if (!editFechaReserva || !editHoraReserva) {
      toast.warning("Por favor seleccione fecha y hora de la reserva");
      return;
    }

    if (!selectedReservaForEdit) {
      return;
    }

    // Actualizar la reserva existente
    const index = reservasRows.findIndex((r) => r.id === selectedReservaForEdit.id);
    if (index !== -1) {
      reservasRows[index].fechaReserva = editFechaReserva;
      reservasRows[index].horaReserva = editHoraReserva;
      
      // Si cambió el delivery
      if (selectedDelivery) {
        const deliverySeleccionado = dispatchRows.find((d) => d.actNumber === selectedDelivery);
        if (deliverySeleccionado) {
          reservasRows[index].deliveryId = `DEL-${selectedDelivery}`;
          reservasRows[index].cliente = deliverySeleccionado.company || deliverySeleccionado.carrierName || reservasRows[index].cliente;
          reservasRows[index].producto = deliverySeleccionado.product || reservasRows[index].producto;
          reservasRows[index].cantidad = deliverySeleccionado.deliveryQuantity || reservasRows[index].cantidad;
          reservasRows[index].tipo = deliverySeleccionado.movement === "CARGA" ? "Carga" : "Descarga";
          reservasRows[index].conductor = deliverySeleccionado.driver || reservasRows[index].conductor;
          reservasRows[index].vehiculo = deliverySeleccionado.plate || reservasRows[index].vehiculo;
        }
      } else {
        reservasRows[index].deliveryId = null;
      }

      handleCloseEditReservaModal();
      toast.success(`Reserva ${selectedReservaForEdit.id} actualizada exitosamente`);
      
      // Forzar actualización navegando y volviendo (en producción esto vendría del backend)
      window.location.reload();
    }
  };

  const handleOpenCalendarModal = (type) => {
    if (type === 'loadType') {
      setTempFromDate(loadTypeFromDate);
      setTempToDate(loadTypeToDate);
      setCalendarModalType('loadType');
    } else {
      setTempFromDate(chartFromDate);
      setTempToDate(chartToDate);
      setCalendarModalType('day');
    }
    setCalendarModalOpen(true);
  };

  const handleCloseCalendarModal = () => {
    setCalendarModalOpen(false);
    setCalendarModalType(null);
  };

  const handleApplyDateFilter = () => {
    if (calendarModalType === 'loadType') {
      setLoadTypeFromDate(tempFromDate);
      setLoadTypeToDate(tempToDate);
    } else {
      setChartFromDate(tempFromDate);
      setChartToDate(tempToDate);
    }
    setCalendarModalOpen(false);
    setCalendarModalType(null);
  };

  const handleResetDateFilter = () => {
    if (calendarModalType === 'loadType') {
      const today = getTodayKey();
      setTempFromDate(today);
      setTempToDate(today);
      setLoadTypeFromDate(today);
      setLoadTypeToDate(today);
    } else {
      const startWeek = getStartOfWeek();
      const endWeek = getEndOfWeek();
      setTempFromDate(startWeek);
      setTempToDate(endWeek);
      setChartFromDate(startWeek);
      setChartToDate(endWeek);
    }
  };

  return (
    <Stack spacing={2.4}>
      <FiltersBar
        onExport={handleExportKpi}
      />

      <Grid container spacing={2.4}>
        {kpis.map((item) => (
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 2.4 }}>
            <KpiCard
              item={item}
              onClick={
                item.title === "Delivery Totales"
                  ? () => navigate("/dashboard/despachos")
                  : item.title === "Reservas Pendientes"
                  ? () => navigate("/dashboard/reservas")
                  : undefined
              }
            />
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 5 }}>
          <ChartCard
            title="Delivery por Tipo de Carga Pendientes"
            subtitle="Distribución de órdenes y kilogramos por tipo"
            action={<TimelineOutlined color="action" fontSize="small" />}
            onCalendarClick={() => handleOpenCalendarModal('loadType')}
          >
            <DispatchesByLoadTypeChart 
              data={filteredDispatchesByLoadType} 
              totalDespachos={kpis.find((kpi) => kpi.title === "Delivery Totales")?.value || dispatchRows.length}
            />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <ChartCard
            title="Delivery por Día"
            subtitle="Comparativo planificados vs completados"
            onCalendarClick={() => handleOpenCalendarModal('day')}
          >
            <Stack spacing={1}>
              {filteredDayData.length > 0 ? (
                <DayBarChart data={filteredDayData} />
              ) : (
                <Box sx={{ py: 4, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No hay datos para el rango de fechas seleccionado
                  </Typography>
                </Box>
              )}
            </Stack>
          </ChartCard>
        </Grid>

        <Grid size={12}>
          <ReservasWithoutDeliveryCard
            reservas={useMemo(() => {
              // Reservas sin delivery asociado (sin deliveryId)
              // Obtener fecha de hoy en formato local (sin hora)
              const hoy = new Date();
              const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
              
              return reservasRows.filter((reserva) => {
                return reserva.deliveryId === null || reserva.deliveryId === undefined || reserva.deliveryId === "";
              }).map((reserva) => {
                // Calcular días transcurridos desde la fecha de creación (fechaReserva) hasta hoy
                let diasTranscurridos = 0;
                if (reserva.fechaReserva) {
                  // Parsear fecha de reserva (formato YYYY-MM-DD)
                  const [year, month, day] = reserva.fechaReserva.split('-').map(Number);
                  const fechaCreacion = new Date(year, month - 1, day);
                  
                  // Calcular diferencia en días
                  const diferencia = hoyLocal - fechaCreacion;
                  diasTranscurridos = Math.floor(diferencia / (1000 * 60 * 60 * 24));
                  diasTranscurridos = Math.max(0, diasTranscurridos); // No permitir valores negativos
                }
                
                return {
                  reservaId: reserva.id,
                  cliente: reserva.cliente,
                  producto: reserva.producto,
                  cantidad: reserva.cantidad,
                  fecha: reserva.fechaReserva,
                  diasSinDelivery: diasTranscurridos,
                };
              });
            }, [])}
            onItemClick={(reservaData) => {
              // Buscar la reserva completa en reservasRows
              const reserva = reservasRows.find((r) => r.id === reservaData.reservaId);
              if (reserva) {
                handleOpenEditReservaModal(reserva);
              }
            }}
          />
        </Grid>
      </Grid>

      {/* Modal de Filtro de Fechas */}
      <Dialog open={calendarModalOpen} onClose={handleCloseCalendarModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Filtrar por Rango de Fechas
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Fecha Inicial"
              type="date"
              value={tempFromDate}
              onChange={(event) => setTempFromDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
              required
            />
            <TextField
              label="Fecha Final"
              type="date"
              value={tempToDate}
              onChange={(event) => setTempToDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleResetDateFilter} variant="text" size="small">
            Restablecer (Hoy)
          </Button>
          <Button onClick={handleCloseCalendarModal} variant="text" size="small">
            Cancelar
          </Button>
          <Button onClick={handleApplyDateFilter} variant="contained" color="primary" size="small">
            Aplicar Filtro
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Edición de Reserva */}
      <Dialog open={editReservaModalOpen} onClose={handleCloseEditReservaModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Editar Reserva
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="delivery-select-label">Delivery (Opcional)</InputLabel>
              <Select
                labelId="delivery-select-label"
                label="Delivery (Opcional)"
                value={selectedDelivery}
                onChange={(event) => setSelectedDelivery(event.target.value)}
              >
                <MenuItem value="">
                  <em>Sin delivery</em>
                </MenuItem>
                {deliveriesSinReserva.length === 0 ? (
                  <MenuItem disabled>No hay deliveries disponibles sin reserva</MenuItem>
                ) : (
                  deliveriesSinReserva.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {/* Calendario FullCalendar */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box
                sx={{
                  "& .fc": {
                    fontFamily: "inherit",
                    "& .fc-button-primary": {
                      backgroundColor: brandColors.dayBlue,
                      borderColor: brandColors.dayBlue,
                      color: "white",
                      "&:hover": {
                        backgroundColor: brandColors.oxyBlue,
                        borderColor: brandColors.oxyBlue,
                      },
                      "&:focus": {
                        boxShadow: `0 0 0 0.2rem ${brandColors.dayBlue}40`,
                      },
                    },
                    "& .fc-button-active": {
                      backgroundColor: brandColors.oxyBlue,
                      borderColor: brandColors.oxyBlue,
                    },
                    "& .fc-today-button": {
                      backgroundColor: brandColors.dayBlue,
                      borderColor: brandColors.dayBlue,
                      "&:hover": {
                        backgroundColor: brandColors.oxyBlue,
                        borderColor: brandColors.oxyBlue,
                      },
                    },
                    "& .fc-day-today": {
                      backgroundColor: `${brandColors.dayBlue}15 !important`,
                      "& .fc-daygrid-day-number": {
                        color: brandColors.dayBlue,
                        fontWeight: 700,
                      },
                    },
                    "& .fc-col-header-cell": {
                      backgroundColor: `${brandColors.midnightBlue}08`,
                      color: brandColors.midnightBlue,
                      fontWeight: 600,
                      borderColor: `${brandColors.midnightBlue}16`,
                    },
                    "& .fc-daygrid-day-number": {
                      color: brandColors.midnightBlue,
                      fontWeight: 500,
                    },
                    "& .fc-event": {
                      color: "white",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      borderWidth: "2px",
                      cursor: "pointer",
                      "& .fc-event-title": {
                        fontWeight: 600,
                      },
                    },
                    "& .fc-event:hover": {
                      opacity: 0.9,
                      transform: "scale(1.02)",
                      transition: "all 0.2s ease",
                    },
                    "& .fc-highlight": {
                      backgroundColor: `${brandColors.dayBlue}20`,
                      borderColor: brandColors.dayBlue,
                      borderWidth: "2px",
                    },
                    "& .fc-timegrid-slot": {
                      "&.fc-timegrid-slot-label": {
                        color: brandColors.slateGray,
                      },
                    },
                    "& .fc-timegrid-col.fc-day-today": {
                      backgroundColor: `${brandColors.dayBlue}08`,
                    },
                  },
                }}
              >
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    locale={esLocale}
                    selectable={true}
                    selectMirror={true}
                    unselectAuto={false}
                    unselectCancel=""
                    dayMaxEvents={true}
                    weekends={true}
                    selectConstraint={{
                      startTime: "06:00:00",
                      endTime: "17:00:00",
                    }}
                    businessHours={{
                      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                      startTime: "06:00",
                      endTime: "17:00",
                      color: `${brandColors.oceanAqua}20`,
                    }}
                    slotMinTime="06:00:00"
                    slotMaxTime="17:00:00"
                    slotDuration="00:30:00"
                    events={calendarEvents}
                    select={handleSelectSlot}
                    dateClick={handleDateClick}
                    eventClick={(eventInfo) => {
                      const reserva = eventInfo.event.extendedProps?.reserva;
                      if (reserva) {
                        navigate(`/dashboard/reservas/${reserva.id}`);
                      }
                    }}
                    height="auto"
                    dayCellContent={(arg) => {
                      // Contar reservas para este día
                      const fechaKey = `${arg.date.getFullYear()}-${String(arg.date.getMonth() + 1).padStart(2, "0")}-${String(arg.date.getDate()).padStart(2, "0")}`;
                      const reservasDelDia = getReservasByDate(fechaKey);
                      const numReservas = reservasDelDia.length;
                      
                      // Verificar si es hoy
                      const hoy = new Date();
                      const hoyKey = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
                      const isToday = fechaKey === hoyKey;
                      
                      if (numReservas > 0) {
                        return {
                          html: `<div style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 2px;">
                            <span style="font-weight: ${isToday ? '700' : '500'}; color: ${isToday ? brandColors.dayBlue : brandColors.midnightBlue};">${arg.dayNumberText}</span>
                            <span style="background-color: ${brandColors.sunriseOrange}; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; margin-left: 4px;">${numReservas}</span>
                          </div>`
                        };
                      }
                      return {
                        html: `<span style="font-weight: ${isToday ? '700' : '500'}; color: ${isToday ? brandColors.dayBlue : brandColors.midnightBlue};">${arg.dayNumberText}</span>`
                      };
                    }}
                  />
              </Box>
            </Paper>

            {selectedDelivery && (
              <Box sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                  Información del Delivery seleccionado:
                </Typography>
                {(() => {
                  const delivery = deliveriesSinReserva.find((d) => d.value === selectedDelivery)?.delivery;
                  if (!delivery) return null;
                  return (
                    <Stack spacing={0.5}>
                      <Typography variant="body2">
                        <strong>Cliente:</strong> {delivery.customerAddress || delivery.company || "-"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Producto:</strong> {delivery.product || "-"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Cantidad:</strong> {delivery.deliveryQuantity || "-"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Conductor:</strong> {delivery.driver || "-"}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Vehículo:</strong> {delivery.plate || "-"}
                      </Typography>
                    </Stack>
                  );
                })()}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseEditReservaModal} variant="text" size="small">
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveEditReserva} 
            variant="contained" 
            color="primary" 
            size="small" 
            startIcon={<Edit />}
            disabled={!editFechaReserva || !editHoraReserva}
          >
            Editar Reserva
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default DashboardHomePage;
