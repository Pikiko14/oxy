import { Chip } from "@mui/material";

/**
 * Componente reutilizable para mostrar chips de estado con colores configurables
 * @param {string} label - Texto del chip
 * @param {string} status - Estado (para determinar colores)
 * @param {Object} statusConfig - Configuración de colores por estado
 * @param {string} size - Tamaño del chip ('small' | 'medium')
 */
export function StatusChip({ label, status, statusConfig, size = "small" }) {
  const config = statusConfig?.[status] || { bg: "#E5E7EB", color: "#4B5563" };

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontWeight: 700,
        ...(config.sx || {}),
      }}
    />
  );
}