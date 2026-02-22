import { Box, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import CalendarToday from "@mui/icons-material/CalendarToday";
import { brandColors } from "../../../../theme";

/**
 * Componente reutilizable para contenedores de gráficos
 * @param {string} title - Título del gráfico
 * @param {string} subtitle - Subtítulo del gráfico (opcional)
 * @param {React.ReactNode} action - Acción adicional (opcional)
 * @param {React.ReactNode} children - Contenido del gráfico
 * @param {Function} onCalendarClick - Función a ejecutar al hacer clic en el calendario (opcional)
 */
export function ChartCard({ title, subtitle, action, children, onCalendarClick }) {
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