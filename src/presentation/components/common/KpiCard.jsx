import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";

/**
 * Componente reutilizable para mostrar tarjetas de KPI
 * @param {Object} item - Objeto con la información del KPI
 * @param {string} item.title - Título del KPI
 * @param {number} item.value - Valor del KPI
 * @param {string} item.delta - Descripción adicional
 * @param {string} item.color - Color del KPI
 * @param {React.Component} item.icon - Icono del KPI
 * @param {Function} onClick - Función a ejecutar al hacer clic (opcional)
 */
export function KpiCard({ item, onClick }) {
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