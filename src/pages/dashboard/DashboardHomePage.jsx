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
import { brandColors } from "../../theme";

// ============================================
// CONSTANTES Y DATOS MOCK
// ============================================

const BASE_KPIS = [
  {
    title: "Despachos Totales",
    value: 248,
    delta: "+12% vs mes anterior",
    color: brandColors.oxyBlue,
    icon: LocalShippingOutlined,
  },
  {
    title: "En Ruta",
    value: 42,
    delta: "17% del total",
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
    title: "Incidentes",
    value: 5,
    delta: "-3% vs mes anterior",
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

const DAY_DATA = [
  { day: "Lun", planned: 34, completed: 32 },
  { day: "Mar", planned: 30, completed: 28 },
  { day: "Mie", planned: 33, completed: 31 },
  { day: "Jue", planned: 36, completed: 35 },
  { day: "Vie", planned: 40, completed: 38 },
  { day: "Sab", planned: 29, completed: 27 },
  { day: "Dom", planned: 22, completed: 21 },
];

const TRUCK_BY_LOAD_TYPE = [
  { label: "Oxígeno medicinal", value: 34, color: brandColors.dayBlue },
  { label: "Combustible", value: 28, color: brandColors.oxyBlue },
  { label: "Alimentos", value: 21, color: brandColors.oceanAqua },
  { label: "Químicos", value: 15, color: brandColors.sunriseOrange },
  { label: "General", value: 10, color: brandColors.aluminumGray },
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
        Resumen ejecutivo de operación: visualiza rendimiento, entregas y estado de despachos.
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

function KpiCard({ item }) {
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
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0px 12px 28px rgba(0, 46, 77, 0.1)",
        },
      }}
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
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ minHeight: 180, pt: 1.5 }}>
        {data.map((item) => (
          <Stack key={item.day} alignItems="center" spacing={0.6}>
            <Stack direction="row" spacing={0.5} alignItems="flex-end">
              <Box
                sx={{
                  width: 16,
                  height: item.planned * 3.5,
                  borderRadius: "12px 12px 4px 4px",
                  bgcolor: brandColors.dayBlue,
                  boxShadow: "inset 0 -2px 0 rgba(255,255,255,0.25)",
                  transition: "height 300ms ease",
                }}
              />
              <Box
                sx={{
                  width: 16,
                  height: item.completed * 3.5,
                  borderRadius: "12px 12px 4px 4px",
                  bgcolor: brandColors.oceanAqua,
                  boxShadow: "inset 0 -2px 0 rgba(255,255,255,0.25)",
                  transition: "height 300ms ease",
                }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {item.day}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

function TruckByLoadTypeChart({ data }) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <Stack spacing={1.6}>
      {data.map((item) => {
        const percent = Math.round((item.value / total) * 100);
        return (
          <Box key={item.label}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.8 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.label}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {item.value} camiones ({percent}%)
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
                  bgcolor: item.color,
                  transition: "width 300ms ease",
                }}
              />
            </Box>
          </Box>
        );
      })}
      <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}>
        <Chip
          size="small"
          label={`Total camiones: ${total}`}
          sx={{
            bgcolor: `${brandColors.morningBlue}AA`,
            color: brandColors.midnightBlue,
            fontWeight: 600,
          }}
        />
      </Stack>
    </Stack>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function DashboardHomePage() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const factor = useMemo(() => {
    if (!fromDate || !toDate) return 1;
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diff = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (Number.isNaN(diff) || diff <= 0) return 1;
    return Math.max(0.65, Math.min(1.35, diff / 30));
  }, [fromDate, toDate]);

  const kpis = useMemo(() => {
    return BASE_KPIS.map((kpi) => {
      if (kpi.title === "Incidentes") {
        const inverseFactor = Math.max(0.7, Math.min(1.4, 1.6 - factor));
        return { ...kpi, value: Math.max(1, Math.round(kpi.value * inverseFactor)) };
      }
      return { ...kpi, value: Math.max(1, Math.round(kpi.value * factor)) };
    });
  }, [factor]);

  const filteredStatusRows = useMemo(() => {
    const total = Math.max(1, Math.round(248 * factor));
    return STATUS_ROWS.map((row) => {
      const newValue = Math.max(1, Math.round(row.value * factor));
      return { ...row, value: newValue, total };
    });
  }, [factor]);

  const filteredDayData = useMemo(() => {
    return DAY_DATA.map((item) => ({
      ...item,
      planned: Math.max(1, Math.round(item.planned * factor)),
      completed: Math.max(1, Math.round(item.completed * factor)),
    }));
  }, [factor]);

  const filteredTruckByLoadType = useMemo(() => {
    return TRUCK_BY_LOAD_TYPE.map((item) => ({
      ...item,
      value: Math.max(1, Math.round(item.value * factor)),
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
          <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard item={item} />
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 5 }}>
          <ChartCard
            title="Despachos por Estado"
            subtitle="Distribución actual del total"
            action={<TimelineOutlined color="action" fontSize="small" />}
          >
            <Stack spacing={1.8}>
              {filteredStatusRows.map((row) => (
                <StatusBar key={row.label} row={row} />
              ))}
            </Stack>
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <ChartCard
            title="Despachos por Día"
            subtitle="Comparativo planificados vs completados"
            action={
              <Tooltip title="Más opciones" arrow placement="top">
                <IconButton size="small">
                  <MoreVertOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
            }
          >
            <DayBarChart data={filteredDayData} />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ChartCard
            title="Camiones por Tipo de Carga"
            subtitle="Distribución operativa actual por categoría"
            action={<Chip size="small" label="KPI operativo" sx={{ fontWeight: 600 }} />}
          >
            <TruckByLoadTypeChart data={filteredTruckByLoadType} />
          </ChartCard>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default DashboardHomePage;
