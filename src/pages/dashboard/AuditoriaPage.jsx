import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Tune from "@mui/icons-material/Tune";
import Search from "@mui/icons-material/Search";
import RestartAlt from "@mui/icons-material/RestartAlt";
import Download from "@mui/icons-material/Download";
import { brandColors } from "../../theme";

// Datos mock de auditoría
const auditRows = [
  {
    id: "AUD-001",
    timestamp: "2025-03-16 14:30:25",
    user: "Operador OXY",
    action: "Crear Despacho",
    entity: "Despacho #843295",
    details: "Nuevo despacho creado para TRANSPORTES OSORIO",
    ip: "192.168.1.100",
    status: "Exitoso",
  },
  {
    id: "AUD-002",
    timestamp: "2025-03-16 14:25:10",
    user: "Admin Sistema",
    action: "Editar Despacho",
    entity: "Despacho #843298",
    details: "Estado cambiado de 'En Atención' a 'Finalizado'",
    ip: "192.168.1.105",
    status: "Exitoso",
  },
  {
    id: "AUD-003",
    timestamp: "2025-03-16 14:20:45",
    user: "Operador OXY",
    action: "Eliminar Despacho",
    entity: "Despacho #843301",
    details: "Despacho cancelado por solicitud del cliente",
    ip: "192.168.1.100",
    status: "Exitoso",
  },
  {
    id: "AUD-004",
    timestamp: "2025-03-16 14:15:30",
    user: "Supervisor",
    action: "Exportar KPI",
    entity: "Dashboard",
    details: "Exportación de datos KPI del período 01/03/2025 - 15/03/2025",
    ip: "192.168.1.110",
    status: "Exitoso",
  },
  {
    id: "AUD-005",
    timestamp: "2025-03-16 14:10:15",
    user: "Operador OXY",
    action: "Actualizar Estado",
    entity: "Despacho #843304",
    details: "Intento de actualización fallido: permisos insuficientes",
    ip: "192.168.1.100",
    status: "Error",
  },
  {
    id: "AUD-006",
    timestamp: "2025-03-16 14:05:00",
    user: "Admin Sistema",
    action: "Iniciar Sesión",
    entity: "Sistema",
    details: "Sesión iniciada correctamente",
    ip: "192.168.1.105",
    status: "Exitoso",
  },
  {
    id: "AUD-007",
    timestamp: "2025-03-16 13:55:20",
    user: "Operador OXY",
    action: "Ver Detalle",
    entity: "Despacho #843305",
    details: "Consulta de información de despacho",
    ip: "192.168.1.100",
    status: "Exitoso",
  },
  {
    id: "AUD-008",
    timestamp: "2025-03-16 13:50:10",
    user: "Supervisor",
    action: "Filtrar Despachos",
    entity: "Panel de Despachos",
    details: "Filtros aplicados: Región=Centro, Estado=En Atención",
    ip: "192.168.1.110",
    status: "Exitoso",
  },
  {
    id: "AUD-009",
    timestamp: "2025-03-16 13:45:35",
    user: "Admin Sistema",
    action: "Cerrar Sesión",
    entity: "Sistema",
    details: "Sesión cerrada por inactividad",
    ip: "192.168.1.105",
    status: "Exitoso",
  },
  {
    id: "AUD-010",
    timestamp: "2025-03-16 13:40:00",
    user: "Operador OXY",
    action: "Imprimir Documento",
    entity: "Despacho #843306",
    details: "Impresión de guía de despacho",
    ip: "192.168.1.100",
    status: "Exitoso",
  },
  {
    id: "AUD-011",
    timestamp: "2025-03-16 13:35:25",
    user: "Supervisor",
    action: "Actualizar Estado",
    entity: "Despacho #843307",
    details: "Estado actualizado a 'En Ruta'",
    ip: "192.168.1.110",
    status: "Exitoso",
  },
  {
    id: "AUD-012",
    timestamp: "2025-03-16 13:30:15",
    user: "Operador OXY",
    action: "Crear Despacho",
    entity: "Despacho #843308",
    details: "Nuevo despacho creado para LOGISTICA CENTRAL",
    ip: "192.168.1.100",
    status: "Exitoso",
  },
];

function AuditoriaPage() {
  const [userFilter, setUserFilter] = useState([]);
  const [actionFilter, setActionFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const statusStyle = {
    Exitoso: { bg: "#BCE8D2", color: "#0E5E46" },
    Error: { bg: "#FEE2E2", color: "#991B1B" },
  };

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    return auditRows.filter((row) => {
      const rowUser = row.user.toLowerCase();
      const rowAction = row.action.toLowerCase();
      const rowStatus = row.status.toLowerCase();
      const matchUser = userFilter.length === 0 || userFilter.includes(rowUser);
      const matchAction = actionFilter.length === 0 || actionFilter.includes(rowAction);
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(rowStatus);
      const matchSearch =
        !search ||
        row.id.toLowerCase().includes(search) ||
        row.user.toLowerCase().includes(search) ||
        row.action.toLowerCase().includes(search) ||
        row.entity.toLowerCase().includes(search) ||
        row.details.toLowerCase().includes(search) ||
        row.ip.toLowerCase().includes(search);

      return matchUser && matchAction && matchStatus && matchSearch;
    });
  }, [userFilter, actionFilter, statusFilter, searchValue]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const activeFilters = userFilter.length + actionFilter.length + statusFilter.length + (searchValue.trim().length > 0 ? 1 : 0);

  const handleResetFilters = () => {
    setUserFilter([]);
    setActionFilter([]);
    setStatusFilter([]);
    setSearchValue("");
    setPage(1);
  };

  const uniqueUsers = [...new Set(auditRows.map((row) => row.user))];
  const uniqueActions = [...new Set(auditRows.map((row) => row.action))];
  const uniqueStatuses = [...new Set(auditRows.map((row) => row.status))];

  const handleExport = () => {
    const data = {
      generatedAt: new Date().toISOString(),
      filters: {
        user: userFilter,
        action: actionFilter,
        status: statusFilter,
        search: searchValue || null,
      },
      records: filteredRows,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
      <Stack spacing={1.4}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Auditoría del Sistema
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {activeFilters > 0 && (
              <Chip
                label={`Filtros activos (${activeFilters})`}
                icon={<Tune fontSize="small" />}
                deleteIcon={activeFilters > 0 ? <RestartAlt fontSize="small" /> : undefined}
                onDelete={activeFilters > 0 ? handleResetFilters : undefined}
                onClick={activeFilters > 0 ? handleResetFilters : undefined}
                size="small"
                sx={{
                  bgcolor: `${brandColors.dayBlue}15`,
                  color: brandColors.dayBlue,
                  fontWeight: 600,
                  "& .MuiChip-icon": { color: brandColors.dayBlue },
                  "& .MuiChip-deleteIcon": { color: brandColors.dayBlue },
                  cursor: activeFilters > 0 ? "pointer" : "default",
                }}
              />
            )}
            <Button variant="outlined" color="primary" startIcon={<Download />} size="small" onClick={handleExport}>
              Exportar
            </Button>
          </Stack>
        </Stack>

        {/* Filtros */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
          <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 180 } }}>
            <InputLabel id="user-filter-label">Usuario</InputLabel>
            <Select
              labelId="user-filter-label"
              label="Usuario"
              multiple
              value={userFilter}
              onChange={(event) => setUserFilter(event.target.value)}
              renderValue={(selected) => (selected.length === 0 ? "Todos" : `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}`)}
            >
              {uniqueUsers.map((user) => (
                <MenuItem key={user} value={user.toLowerCase()}>
                  <Checkbox checked={userFilter.includes(user.toLowerCase())} />
                  {user}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 180 } }}>
            <InputLabel id="action-filter-label">Acción</InputLabel>
            <Select
              labelId="action-filter-label"
              label="Acción"
              multiple
              value={actionFilter}
              onChange={(event) => setActionFilter(event.target.value)}
              renderValue={(selected) => (selected.length === 0 ? "Todas" : `${selected.length} seleccionada${selected.length > 1 ? "s" : ""}`)}
            >
              {uniqueActions.map((action) => (
                <MenuItem key={action} value={action.toLowerCase()}>
                  <Checkbox checked={actionFilter.includes(action.toLowerCase())} />
                  {action}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 180 } }}>
            <InputLabel id="status-filter-label">Estado</InputLabel>
            <Select
              labelId="status-filter-label"
              label="Estado"
              multiple
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              renderValue={(selected) => (selected.length === 0 ? "Todos" : `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}`)}
            >
              {uniqueStatuses.map((status) => (
                <MenuItem key={status} value={status.toLowerCase()}>
                  <Checkbox checked={statusFilter.includes(status.toLowerCase())} />
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            placeholder="Buscar por ID, usuario, acción, entidad..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: brandColors.dayBlue }} />
                </InputAdornment>
              ),
            }}
            sx={{ flex: 1, minWidth: { xs: "100%", md: 300 } }}
          />
        </Stack>

        <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha y Hora</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Acción</TableCell>
                <TableCell>Entidad</TableCell>
                <TableCell>Detalles</TableCell>
                <TableCell>IP</TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron registros de auditoría
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>{row.id}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{row.timestamp}</TableCell>
                    <TableCell>{row.user}</TableCell>
                    <TableCell>{row.action}</TableCell>
                    <TableCell>{row.entity}</TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row.details}>
                      {row.details}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{row.ip}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          bgcolor: statusStyle[row.status]?.bg || "#E5E7EB",
                          color: statusStyle[row.status]?.color || "#4B5563",
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Mostrando {(currentPage - 1) * rowsPerPage + (paginatedRows.length > 0 ? 1 : 0)}-{(currentPage - 1) * rowsPerPage + paginatedRows.length} de {filteredRows.length} registros
          </Typography>
          <Pagination page={currentPage} count={pageCount} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" size="small" />
        </Stack>
      </Stack>
    </Paper>
  );
}

export default AuditoriaPage;
