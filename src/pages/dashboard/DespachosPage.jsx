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
  Tooltip,
  Typography,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Tune from "@mui/icons-material/Tune";
import Search from "@mui/icons-material/Search";
import Visibility from "@mui/icons-material/Visibility";
import Edit from "@mui/icons-material/Edit";
import RestartAlt from "@mui/icons-material/RestartAlt";
import { brandColors } from "../../theme";
import { useNavigate } from "react-router-dom";
import DespachoFormModal from "../../components/DespachoFormModal";

const dispatchRows = [
  { actNumber: "843295", company: "TRANSPORTES OSORIO", driver: "GEROLAMO GNETTI", movement: "CARGA", product: "ISOPROPANOL", plate: "ABCD12", status: "En Atención", arrival: "08:30", attention: "09:15", departure: "10:45", durationMin: 94, region: "Centro" },
  { actNumber: "843298", company: "MERCOTANK CHILE", driver: "JORGE OLMOS", movement: "DESCARGA", product: "ACIDO SULFURICO", plate: "IJKL56", status: "Finalizado", arrival: "14:20", attention: "14:35", departure: "14:55", durationMin: 20, region: "Norte" },
  { actNumber: "843301", company: "LOGISTICA SUR", driver: "CARLOS MENDOZA", movement: "CARGA", product: "ETANOL", plate: "QRST90", status: "En Atención", arrival: "11:00", attention: "11:30", departure: "-", durationMin: 45, region: "Sur" },
  { actNumber: "843304", company: "TRANSPORTE NORTE", driver: "ROBERTO DIAZ", movement: "DESCARGA", product: "METANOL", plate: "YZAB34", status: "Finalizado", arrival: "16:00", attention: "16:15", departure: "16:45", durationMin: 45, region: "Norte" },
  { actNumber: "843305", company: "LOGISTICA CENTRAL", driver: "MARIA GONZALEZ", movement: "CARGA", product: "ACETONA", plate: "WXYZ78", status: "En Atención", arrival: "09:30", attention: "09:45", departure: "-", durationMin: 75, region: "Centro" },
  { actNumber: "843306", company: "TRANSPORTES DEL SUR", driver: "PEDRO LOPEZ", movement: "DESCARGA", product: "TOLUENO", plate: "EFGH12", status: "En Atención", arrival: "10:15", attention: "10:30", departure: "-", durationMin: 150, region: "Sur" },
  { actNumber: "843307", company: "MERCANCIA EXPRESS", driver: "CARLOS RUIZ", movement: "CARGA", product: "BENCENO", plate: "MNOP56", status: "En Atención", arrival: "12:00", attention: "12:20", departure: "-", durationMin: 225, region: "Centro" },
  { actNumber: "843308", company: "FLOTA RAPIDA", driver: "JORGE MORALES", movement: "DESCARGA", product: "XILENO", plate: "UVWX90", status: "En Atención", arrival: "13:45", attention: "14:00", departure: "-", durationMin: 80, region: "Centro" },
  { actNumber: "843309", company: "DISTRIBUCION BIOBIO", driver: "ANGELICA REYES", movement: "CARGA", product: "GLICERINA", plate: "LMNO21", status: "Pendiente", arrival: "17:10", attention: "-", departure: "-", durationMin: 0, region: "Sur" },
  { actNumber: "843310", company: "NORTE INDUSTRIAL", driver: "RENATO PIZARRO", movement: "DESCARGA", product: "AMONIACO", plate: "QWER45", status: "En Atención", arrival: "07:35", attention: "08:05", departure: "-", durationMin: 52, region: "Norte" },
  { actNumber: "843311", company: "TRANS QUIMICA LTDA", driver: "PABLO MORA", movement: "CARGA", product: "ISOPROPANOL", plate: "ASDF89", status: "Finalizado", arrival: "05:50", attention: "06:10", departure: "06:40", durationMin: 30, region: "Centro" },
  { actNumber: "843312", company: "RUTA SEGURA SPA", driver: "VALERIA NUNEZ", movement: "DESCARGA", product: "ACIDO SULFURICO", plate: "ZXCV34", status: "En Atención", arrival: "15:05", attention: "15:20", departure: "-", durationMin: 68, region: "Norte" },
];

function DespachosPage() {
  const navigate = useNavigate();
  const [dispatchData, setDispatchData] = useState(dispatchRows);
  const [regionFilter, setRegionFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDispatch, setEditingDispatch] = useState(null);
  const rowsPerPage = 8;

  const statusStyle = {
    "En Atención": { bg: "#BCE8D2", color: "#0E5E46" },
    Finalizado: { bg: "#C7D6EB", color: "#1D4AB8" },
    Pendiente: { bg: "#E5E7EB", color: "#4B5563" },
  };
  const movementStyle = {
    CARGA: { bg: "#F1E8BD", color: "#9E4500" },
    DESCARGA: { bg: "#F3D4A6", color: "#9E3F14" },
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes <= 0) return "-";
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    return dispatchData.filter((row) => {
      const rowRegion = row.region.toLowerCase();
      const rowStatus = row.status.toLowerCase();
      const rowProduct = row.product.toLowerCase();
      const matchRegion = regionFilter.length === 0 || regionFilter.includes(rowRegion);
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(rowStatus);
      const matchProduct = productFilter.length === 0 || productFilter.some((value) => rowProduct.includes(value));
      const matchSearch =
        !search ||
        row.actNumber.toLowerCase().includes(search) ||
        row.driver.toLowerCase().includes(search) ||
        row.company.toLowerCase().includes(search) ||
        row.plate.toLowerCase().includes(search);

      return matchRegion && matchStatus && matchProduct && matchSearch;
    });
  }, [dispatchData, productFilter, regionFilter, searchValue, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const activeFilters =
    regionFilter.length + statusFilter.length + productFilter.length +
    (searchValue.trim().length > 0 ? 1 : 0);

  const handleResetFilters = () => {
    setRegionFilter([]);
    setStatusFilter([]);
    setProductFilter([]);
    setSearchValue("");
    setPage(1);
  };

  const handleOpenDialog = (dispatch = null) => {
    setEditingDispatch(dispatch);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingDispatch(null);
  };

  const getNextActNumber = () => {
    const currentMax = dispatchData.reduce((max, row) => Math.max(max, Number.parseInt(row.actNumber, 10) || 0), 0);
    return String(currentMax + 1);
  };

  const handleSaveDispatch = (formData, initialData) => {
    const dispatchRow = {
      actNumber: initialData ? initialData.actNumber : getNextActNumber(),
      ...formData,
    };

    if (initialData) {
      setDispatchData((prev) => prev.map((row) => (row.actNumber === initialData.actNumber ? dispatchRow : row)));
    } else {
      setDispatchData((prev) => [dispatchRow, ...prev]);
    }
    setPage(1);
  };

  return (
    <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
      <Stack spacing={1.4}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Despachos en Progreso
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              icon={<Tune fontSize="small" />}
              label={`Filtros activos (${activeFilters})`}
              size="small"
              onDelete={activeFilters > 0 ? handleResetFilters : undefined}
              deleteIcon={activeFilters > 0 ? <RestartAlt fontSize="small" /> : undefined}
              sx={{
                height: 38,
                borderRadius: "10px",
                bgcolor: `${brandColors.morningBlue}4A`,
                color: brandColors.midnightBlue,
                border: `1px solid ${brandColors.morningBlue}`,
                fontWeight: 700,
                "& .MuiChip-icon": { color: brandColors.dayBlue },
                "& .MuiChip-deleteIcon": { color: brandColors.dayBlue },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              size="small"
              onClick={handleOpenDialog}
              sx={{
                minHeight: 38,
                borderRadius: "10px",
                px: 1.8,
              }}
            >
              Nuevo Despacho
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <FormControl size="small" sx={{ minWidth: 190 }}>
            <InputLabel id="region-filter-label">Región</InputLabel>
            <Select
              labelId="region-filter-label"
              label="Región"
              multiple
              value={regionFilter}
              onChange={(event) => {
                const value = event.target.value;
                setRegionFilter(typeof value === "string" ? value.split(",") : value);
                setPage(1);
              }}
              renderValue={(selected) => (selected.length ? selected.join(", ") : "Todas las Regiones")}
            >
              <MenuItem value="norte">
                <Checkbox size="small" checked={regionFilter.includes("norte")} />
                Zona Norte
              </MenuItem>
              <MenuItem value="centro">
                <Checkbox size="small" checked={regionFilter.includes("centro")} />
                Zona Centro
              </MenuItem>
              <MenuItem value="sur">
                <Checkbox size="small" checked={regionFilter.includes("sur")} />
                Zona Sur
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 190 }}>
            <InputLabel id="status-filter-label">Estado</InputLabel>
            <Select
              labelId="status-filter-label"
              label="Estado"
              multiple
              value={statusFilter}
              onChange={(event) => {
                const value = event.target.value;
                setStatusFilter(typeof value === "string" ? value.split(",") : value);
                setPage(1);
              }}
              renderValue={(selected) => (selected.length ? selected.join(", ") : "Todos los Estados")}
            >
              <MenuItem value="en atención">
                <Checkbox size="small" checked={statusFilter.includes("en atención")} />
                En Atención
              </MenuItem>
              <MenuItem value="finalizado">
                <Checkbox size="small" checked={statusFilter.includes("finalizado")} />
                Finalizado
              </MenuItem>
              <MenuItem value="pendiente">
                <Checkbox size="small" checked={statusFilter.includes("pendiente")} />
                Pendiente
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 190 }}>
            <InputLabel id="product-filter-label">Producto</InputLabel>
            <Select
              labelId="product-filter-label"
              label="Producto"
              multiple
              value={productFilter}
              onChange={(event) => {
                const value = event.target.value;
                setProductFilter(typeof value === "string" ? value.split(",") : value);
                setPage(1);
              }}
              renderValue={(selected) => (selected.length ? selected.join(", ") : "Todos los Productos")}
            >
              <MenuItem value="isopropanol">
                <Checkbox size="small" checked={productFilter.includes("isopropanol")} />
                Isopropanol
              </MenuItem>
              <MenuItem value="acido">
                <Checkbox size="small" checked={productFilter.includes("acido")} />
                Acido Sulfurico
              </MenuItem>
              <MenuItem value="etanol">
                <Checkbox size="small" checked={productFilter.includes("etanol")} />
                Etanol
              </MenuItem>
              <MenuItem value="metanol">
                <Checkbox size="small" checked={productFilter.includes("metanol")} />
                Metanol
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Buscar"
            placeholder="Buscar por ID o conductor"
            sx={{ minWidth: 220, flexGrow: 1 }}
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>N° Act</TableCell>
                <TableCell>Empresa</TableCell>
                <TableCell>Conductor</TableCell>
                <TableCell>Movimiento</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Patente</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Llegada</TableCell>
                <TableCell>Atención</TableCell>
                <TableCell>Salida</TableCell>
                <TableCell>Duración</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.actNumber} hover>
                  <TableCell sx={{ fontWeight: 700 }}>{row.actNumber}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.driver}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.movement}
                      sx={{
                        bgcolor: movementStyle[row.movement]?.bg || "#E5E7EB",
                        color: movementStyle[row.movement]?.color || "#4B5563",
                        fontWeight: 700,
                        minWidth: 98,
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", letterSpacing: "0.04em" }}>{row.plate}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.status}
                      sx={{
                        bgcolor: statusStyle[row.status]?.bg || "#E5E7EB",
                        color: statusStyle[row.status]?.color || "#4B5563",
                        fontWeight: 700,
                        minWidth: 132,
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.arrival}</TableCell>
                  <TableCell>{row.attention}</TableCell>
                  <TableCell>{row.departure}</TableCell>
                  <TableCell>
                    <Chip size="small" label={formatDuration(row.durationMin)} sx={{ bgcolor: "#E5E7EB", color: "#374151" }} />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Ver detalle" arrow placement="top">
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label="ver detalle"
                        onClick={() => navigate(`/dashboard/despachos/${row.actNumber}`)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar despacho" arrow placement="top">
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label="editar despacho"
                        onClick={() => handleOpenDialog(row)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
          <Typography variant="caption" color="text.secondary">
            Mostrando {(currentPage - 1) * rowsPerPage + (paginatedRows.length > 0 ? 1 : 0)}-
            {(currentPage - 1) * rowsPerPage + paginatedRows.length} de {filteredRows.length} registros
          </Typography>
          <Pagination
            page={currentPage}
            count={pageCount}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            size="small"
          />
        </Stack>
      </Stack>

      <DespachoFormModal
        open={dialogOpen}
        onClose={handleCloseDialog}
        initialData={editingDispatch}
        onSave={handleSaveDispatch}
      />
    </Paper>
  );
}

export default DespachosPage;
