import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Paper,
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
    title: "Entregados Hoy",
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
  return new Date(`${year}-${month}-${day}`);
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

function FiltersBar({ fromDate, toDate, onFromDateChange, onToDateChange, onExport }) {
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
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ flex: 1 }}>
          <TextField
            label="Desde"
            type="date"
            size="small"
            value={fromDate}
            onChange={(event) => onFromDateChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: { xs: "100%", sm: 180 } }}
          />
          <TextField
            label="Hasta"
            type="date"
            size="small"
            value={toDate}
            onChange={(event) => onToDateChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: { xs: "100%", sm: 180 } }}
          />
        </Stack>
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

function ChartCard({ title, subtitle, action, children }) {
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
        {action && <Box>{action}</Box>}
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
              return (
                <Stack key={item.fechaCompleta || item.day} alignItems="center" spacing={0.2} sx={{ height: "100%", justifyContent: "flex-end" }}>
                  <Stack direction="row" spacing={0.5} alignItems="flex-end" sx={{ height: "100%" }}>
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
          {data.map((item) => (
            <Box key={item.fechaCompleta || item.day} sx={{ minWidth: 40, textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: "block" }}>
                {item.day}
              </Typography>
              {item.dayName && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.65rem", opacity: 0.7 }}>
                  {item.dayName}
                </Typography>
              )}
            </Box>
          ))}
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

  const [fromDate, setFromDate] = useState(getStartOfWeek());
  const [toDate, setToDate] = useState(getEndOfWeek());

  const factor = useMemo(() => {
    if (!fromDate || !toDate) return 1;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diff = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (Number.isNaN(diff) || diff <= 0) return 1;
    return Math.max(0.65, Math.min(1.35, diff / 30));
  }, [fromDate, toDate]);

  // Calcular reservas pendientes (sin delivery asociado)
  const reservasPendientes = useMemo(() => {
    // Contar solo las reservas que no tienen deliveryId asignado (null, undefined o string vacío)
    return reservasRows.filter((reserva) => {
      return reserva.deliveryId === null || reserva.deliveryId === undefined || reserva.deliveryId === "";
    }).length;
  }, []);

  // Calcular deliverys y reservas aprobadas para ingreso desde SAC
  const enProceso = useMemo(() => {
    // Contar deliverys aprobados para ingreso desde SAC (status === "Aprobado")
    const deliverysAprobados = dispatchRows.filter((delivery) => {
      return delivery.status === "Aprobado";
    }).length;

    // Contar reservas aprobadas para ingreso desde SAC
    const reservasAprobadas = reservasRows.filter((reserva) => {
      // Verificar si tiene el campo aprobadoIngresoSAC o si el estado indica aprobación
      return reserva.aprobadoIngresoSAC === true || reserva.estado === "Confirmada";
    }).length;

    // Retornar el total de deliverys y reservas aprobadas
    return deliverysAprobados + reservasAprobadas;
  }, []);

  const kpis = useMemo(() => {
    // Calcular el total de deliverys activas desde la tabla
    const totalDeliverys = dispatchRows.length;
    
    // Crear la lista de KPIs
    const baseKpis = BASE_KPIS.map((kpi) => {
      if (kpi.title === "Delivery Totales") {
        // Usar el total real de deliverys de la tabla
        return { ...kpi, value: totalDeliverys };
      }
      if (kpi.title === "En Proceso") {
        // Usar el conteo real de deliverys y reservas aprobadas para ingreso SAC
        return { ...kpi, value: enProceso };
      }
      if (kpi.title === "Alertas") {
        const inverseFactor = Math.max(0.7, Math.min(1.4, 1.6 - factor));
        return { ...kpi, value: Math.max(1, Math.round(kpi.value * inverseFactor)) };
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
  }, [factor, reservasPendientes, enProceso]);

  const filteredStatusRows = useMemo(() => {
    // Usar el total real de deliverys de la tabla
    const total = dispatchRows.length;
    return STATUS_ROWS.map((row) => {
      const newValue = Math.max(1, Math.round(row.value * factor));
      return { ...row, value: newValue, total };
    });
  }, [factor]);

  const filteredDayData = useMemo(() => {
    // Obtener todas las fechas únicas de deliverys y reservas dentro del rango de fechas
    const fechaMap = new Map();
    const startDate = fromDate ? new Date(fromDate) : null;
    const endDate = toDate ? new Date(toDate) : null;

    // Procesar deliverys por scheduledDate o deliveryDate
    dispatchRows.forEach((delivery) => {
      const fechaStr = delivery.scheduledDate || delivery.deliveryDate;
      if (fechaStr) {
        const fecha = parseDeliveryDate(fechaStr);
        if (fecha && !isNaN(fecha.getTime())) {
          // Filtrar por rango de fechas si están definidas
          if (startDate && fecha < startDate) return;
          if (endDate && fecha > endDate) return;

          const fechaKey = fecha.toISOString().split("T")[0]; // YYYY-MM-DD
          if (!fechaMap.has(fechaKey)) {
            fechaMap.set(fechaKey, {
              fecha,
              fechaKey,
              deliverys: 0,
              reservas: 0,
              completed: 0,
            });
          }
          fechaMap.get(fechaKey).deliverys += 1;
          // Si el delivery está completado (status diferente de "No Recogido")
          if (delivery.status !== "No Recogido") {
            fechaMap.get(fechaKey).completed += 1;
          }
        }
      }
    });

    // Procesar reservas por fechaReserva
    reservasRows.forEach((reserva) => {
      if (reserva.fechaReserva) {
        const fecha = new Date(reserva.fechaReserva); // formato YYYY-MM-DD
        if (!isNaN(fecha.getTime())) {
          // Filtrar por rango de fechas si están definidas
          if (startDate && fecha < startDate) return;
          if (endDate && fecha > endDate) return;

          const fechaKey = fecha.toISOString().split("T")[0];
          if (!fechaMap.has(fechaKey)) {
            fechaMap.set(fechaKey, {
              fecha,
              fechaKey,
              deliverys: 0,
              reservas: 0,
              completed: 0,
            });
          }
          fechaMap.get(fechaKey).reservas += 1;
        }
      }
    });

    // Convertir a array y ordenar por fecha
    const datosPorFecha = Array.from(fechaMap.values())
      .sort((a, b) => a.fecha - b.fecha);

    // Si no hay datos en el rango, generar días de la semana actual
    if (datosPorFecha.length === 0 && startDate && endDate) {
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const fechaKey = currentDate.toISOString().split("T")[0];
        datosPorFecha.push({
          fecha: new Date(currentDate),
          fechaKey,
          deliverys: 0,
          reservas: 0,
          completed: 0,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Formatear para el gráfico
    return datosPorFecha.map((item) => ({
      day: formatDateShort(item.fecha),
      dayName: getDayName(item.fecha),
      fechaCompleta: item.fechaKey,
      planned: item.deliverys + item.reservas, // Suma de deliverys + reservas
      completed: item.completed,
    }));
  }, [fromDate, toDate]);

  const filteredDispatchesByLoadType = useMemo(() => {
    return DISPATCHES_BY_LOAD_TYPE.map((item) => ({
      ...item,
      orders: Math.max(1, Math.round(item.orders * factor)),
      kg: Math.max(1, Math.round(item.kg * factor)),
    }));
  }, [factor]);

  const handleExportKpi = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      filters: {
        fromDate: fromDate || null,
        toDate: toDate || null,
      },
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

  return (
    <Stack spacing={2.4}>
      <SummaryBanner />

      <FiltersBar
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
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
            action={
              <Tooltip title="Más opciones" arrow placement="top">
                <IconButton size="small">
                  <MoreVertOutlined fontSize="md" />
                </IconButton>
              </Tooltip>
            }
          >
            <br></br>
            <Stack spacing={1}>
              <DayBarChart data={filteredDayData} />
            </Stack>
          </ChartCard>
        </Grid>

        <Grid size={12}>
          <ReservasWithoutDeliveryCard
            reservas={useMemo(() => {
              // Reservas sin delivery asociado (sin deliveryId)
              const hoy = new Date();
              hoy.setHours(0, 0, 0, 0);
              
              return reservasRows.filter((reserva) => {
                return reserva.deliveryId === null || reserva.deliveryId === undefined || reserva.deliveryId === "";
              }).map((reserva) => {
                // Calcular días transcurridos desde la fecha de creación (fechaReserva) hasta hoy
                let diasTranscurridos = 0;
                if (reserva.fechaReserva) {
                  const fechaCreacion = new Date(reserva.fechaReserva);
                  fechaCreacion.setHours(0, 0, 0, 0);
                  const diferencia = hoy - fechaCreacion;
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
            onItemClick={() => navigate("/dashboard/reservas")}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

export default DashboardHomePage;
