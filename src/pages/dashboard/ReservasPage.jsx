import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
  Tooltip,
  Typography,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Tune from "@mui/icons-material/Tune";
import Search from "@mui/icons-material/Search";
import Visibility from "@mui/icons-material/Visibility";
import Edit from "@mui/icons-material/Edit";
import RestartAlt from "@mui/icons-material/RestartAlt";
import Cancel from "@mui/icons-material/Cancel";
import { brandColors } from "../../theme";
import { useNavigate } from "react-router-dom";

// Datos mock de reservas
export const reservasRows = [
  {
    id: "RES-001",
    deliveryId: "DEL-843295",
    cliente: "TRANSPORTES OSORIO",
    producto: "SODA CAUSTICA",
    cantidad: "5,000 kg",
    fechaReserva: "2026-02-16",
    horaReserva: "08:30",
    estado: "Confirmada",
    tipo: "Carga",
    conductor: "GEROLAMO GNETTI",
    vehiculo: "ABCD12",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-002",
    deliveryId: "DEL-843298",
    cliente: "MERCOTANK CHILE",
    producto: "HIPOCLORITO DE SODIO",
    cantidad: "8,500 kg",
    fechaReserva: "2026-02-17",
    horaReserva: "14:20",
    estado: "Pendiente",
    tipo: "Descarga",
    conductor: "JORGE OLMOS",
    vehiculo: "IJKL56",
  },
  {
    id: "RES-003",
    deliveryId: "DEL-843301",
    cliente: "LOGISTICA SUR",
    producto: "A CLORHIDRICO",
    cantidad: "3,200 kg",
    fechaReserva: "2026-02-18",
    horaReserva: "11:00",
    estado: "Anulada",
    tipo: "Carga",
    conductor: "CARLOS MENDOZA",
    vehiculo: "QRST90",
  },
  {
    id: "RES-004",
    deliveryId: "DEL-843304",
    cliente: "TRANSPORTE NORTE",
    producto: "CLORURO FERRICO",
    cantidad: "6,800 kg",
    fechaReserva: "2026-02-19",
    horaReserva: "16:00",
    estado: "Confirmada",
    tipo: "Descarga",
    conductor: "ROBERTO DIAZ",
    vehiculo: "YZAB34",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-005",
    deliveryId: "DEL-843305",
    cliente: "LOGISTICA CENTRAL",
    producto: "CALCIO TUR",
    cantidad: "4,500 kg",
    fechaReserva: "2026-02-20",
    horaReserva: "09:30",
    estado: "Pendiente",
    tipo: "Carga",
    conductor: "MARIA GONZALEZ",
    vehiculo: "WXYZ78",
  },
  {
    id: "RES-006",
    deliveryId: null,
    cliente: "TRANSPORTES NUEVOS",
    producto: "SODA CAUSTICA",
    cantidad: "10,000 kg",
    fechaReserva: "2026-02-21",
    horaReserva: "10:00",
    estado: "Pendiente",
    tipo: "Carga",
    conductor: "JUAN PEREZ",
    vehiculo: "NEW123",
  },
  {
    id: "RES-007",
    deliveryId: "DEL-999999",
    cliente: "EMPRESA TEST",
    producto: "HIPOCLORITO DE SODIO",
    cantidad: "7,500 kg",
    fechaReserva: "2026-02-22",
    horaReserva: "14:00",
    estado: "Pendiente",
    tipo: "Descarga",
    conductor: "CARLOS TEST",
    vehiculo: "TEST99",
  },
];

function ReservasPage() {
  const navigate = useNavigate();
  const [estadoFilter, setEstadoFilter] = useState([]);
  const [tipoFilter, setTipoFilter] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [editFechaReserva, setEditFechaReserva] = useState("");
  const [editHoraReserva, setEditHoraReserva] = useState("");
  const rowsPerPage = 8;

  // Función para calcular días sin delivery
  const calcularDiasSinDelivery = (reserva) => {
    // Solo calcular si no tiene delivery
    if (reserva.deliveryId !== null && reserva.deliveryId !== undefined && reserva.deliveryId !== "") {
      return null;
    }
    
    if (!reserva.fechaReserva) return null;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaCreacion = new Date(reserva.fechaReserva);
    fechaCreacion.setHours(0, 0, 0, 0);
    
    const diferencia = hoy - fechaCreacion;
    const diasTranscurridos = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diasTranscurridos);
  };

  const estadoStyle = {
    Confirmada: { bg: "#BCE8D2", color: "#0E5E46" },
    Pendiente: { bg: "#FEE2E2", color: "#991B1B" },
    Anulada: { bg: "#E5E7EB", color: "#4B5563" },
  };

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    return reservasRows.filter((row) => {
      const rowEstado = row.estado.toLowerCase();
      const rowTipo = row.tipo.toLowerCase();
      const matchEstado = estadoFilter.length === 0 || estadoFilter.includes(rowEstado);
      const matchTipo = tipoFilter.length === 0 || tipoFilter.includes(rowTipo);
      const matchSearch =
        !search ||
        row.id.toLowerCase().includes(search) ||
        row.deliveryId.toLowerCase().includes(search) ||
        row.cliente.toLowerCase().includes(search) ||
        row.producto.toLowerCase().includes(search) ||
        row.conductor.toLowerCase().includes(search);

      return matchEstado && matchTipo && matchSearch;
    });
  }, [estadoFilter, tipoFilter, searchValue]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const activeFilters = estadoFilter.length + tipoFilter.length + (searchValue.trim().length > 0 ? 1 : 0);

  const handleResetFilters = () => {
    setEstadoFilter([]);
    setTipoFilter([]);
    setSearchValue("");
    setPage(1);
  };

  const handleOpenEditModal = (reserva) => {
    setSelectedReserva(reserva);
    setEditFechaReserva(reserva.fechaReserva || "");
    setEditHoraReserva(reserva.horaReserva || "");
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedReserva(null);
    setEditFechaReserva("");
    setEditHoraReserva("");
  };

  const handleSaveReserva = () => {
    if (selectedReserva) {
      // Aquí se guardaría en el backend
      console.log("Guardando reserva:", {
        id: selectedReserva.id,
        fechaReserva: editFechaReserva,
        horaReserva: editHoraReserva,
      });
      // Actualizar el array local (en producción vendría del backend)
      const index = reservasRows.findIndex((r) => r.id === selectedReserva.id);
      if (index !== -1) {
        reservasRows[index].fechaReserva = editFechaReserva;
        reservasRows[index].horaReserva = editHoraReserva;
      }
      handleCloseEditModal();
    }
  };

  const uniqueEstados = [...new Set(reservasRows.map((row) => row.estado))];
  const uniqueTipos = [...new Set(reservasRows.map((row) => row.tipo))];

  return (
    <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
      <Stack spacing={1.4}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Reservas
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
            <Button variant="contained" color="primary" startIcon={<Add />} size="small">
              Nueva Reserva
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
          <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 180 } }}>
            <InputLabel id="estado-filter-label">Estado</InputLabel>
            <Select
              labelId="estado-filter-label"
              label="Estado"
              multiple
              value={estadoFilter}
              onChange={(event) => setEstadoFilter(event.target.value)}
              renderValue={(selected) => (selected.length === 0 ? "Todos" : `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}`)}
            >
              {uniqueEstados.map((estado) => (
                <MenuItem key={estado} value={estado.toLowerCase()}>
                  <Checkbox checked={estadoFilter.includes(estado.toLowerCase())} />
                  {estado}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 180 } }}>
            <InputLabel id="tipo-filter-label">Modo</InputLabel>
            <Select
              labelId="tipo-filter-label"
              label="Modo"
              multiple
              value={tipoFilter}
              onChange={(event) => setTipoFilter(event.target.value)}
              renderValue={(selected) => (selected.length === 0 ? "Todos" : `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}`)}
            >
              {uniqueTipos.map((tipo) => (
                <MenuItem key={tipo} value={tipo.toLowerCase()}>
                  <Checkbox checked={tipoFilter.includes(tipo.toLowerCase())} />
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Buscar"
            placeholder="Buscar por ID, delivery, cliente, producto..."
            sx={{ flex: 1, minWidth: { xs: "100%", md: 300 } }}
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: brandColors.dayBlue }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID Reserva</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Modo</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora</TableCell>
                <TableCell>Días sin Delivery</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron reservas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>{row.id}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{row.deliveryId}</TableCell>
                    <TableCell>{row.cliente}</TableCell>
                    <TableCell>{row.producto}</TableCell>
                    <TableCell>{row.cantidad}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.tipo}
                        sx={{
                          bgcolor: row.tipo === "Carga" ? "#F1E8BD" : "#F3D4A6",
                          color: row.tipo === "Carga" ? "#9E4500" : "#9E3F14",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.fechaReserva}</TableCell>
                    <TableCell>{row.horaReserva}</TableCell>
                    <TableCell>
                      {(() => {
                        const diasSinDelivery = calcularDiasSinDelivery(row);
                        if (diasSinDelivery === null) {
                          return <Typography variant="body2" color="text.secondary">-</Typography>;
                        }
                        return (
                          <Chip
                            label={`${diasSinDelivery} día${diasSinDelivery !== 1 ? 's' : ''}`}
                            size="small"
                            sx={{
                              bgcolor: diasSinDelivery >= 7 ? brandColors.oxyRed : diasSinDelivery >= 3 ? brandColors.sunriseOrange : `${brandColors.sunriseOrange}40`,
                              color: diasSinDelivery >= 7 ? "white" : diasSinDelivery >= 3 ? "white" : brandColors.midnightBlue,
                              fontWeight: 700,
                              fontSize: "0.75rem",
                            }}
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.estado}
                        sx={{
                          bgcolor: estadoStyle[row.estado]?.bg || "#E5E7EB",
                          color: estadoStyle[row.estado]?.color || "#4B5563",
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalle" arrow placement="top">
                        <IconButton size="small" color="primary" onClick={() => navigate(`/dashboard/reservas/${row.id}`)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar reserva" arrow placement="top">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(row)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {row.estado !== "Anulada" && (
                        <Tooltip title="Anular reserva" arrow placement="top">
                          <IconButton size="small" color="error">
                            <Cancel fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Mostrando {(currentPage - 1) * rowsPerPage + (paginatedRows.length > 0 ? 1 : 0)}-{(currentPage - 1) * rowsPerPage + paginatedRows.length} de {filteredRows.length} registros
          </Typography>
          <Pagination page={currentPage} count={pageCount} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" size="small" />
        </Stack>

        {/* Modal de Edición de Reserva */}
        <Dialog open={editModalOpen} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            Editar Reserva {selectedReserva?.id}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Solo se pueden editar la fecha y hora de reserva
              </Typography>

              {/* Campos de solo lectura */}
              <TextField
                label="ID Reserva"
                value={selectedReserva?.id || ""}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />
              <TextField
                label="Delivery"
                value={selectedReserva?.deliveryId || "Sin delivery"} 
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />
              <TextField
                label="Cliente"
                value={selectedReserva?.cliente || ""}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />
              <TextField
                label="Producto"
                value={selectedReserva?.producto || ""}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />
              <TextField
                label="Cantidad"
                value={selectedReserva?.cantidad || ""}
                InputProps={{ readOnly: true }}
                size="small"
                fullWidth
                sx={{ "& .MuiInputBase-input": { bgcolor: "grey.50" } }}
              />
              <TextField
                label="Estado"
                value={selectedReserva?.estado || ""}
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
            <Button onClick={handleCloseEditModal} variant="text" size="small">
              Cancelar
            </Button>
            <Button onClick={handleSaveReserva} variant="contained" color="primary" size="small" startIcon={<Edit />}>
              Guardar Cambios
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Paper>
  );
}

export default ReservasPage;
