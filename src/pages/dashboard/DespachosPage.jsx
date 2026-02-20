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
import Tune from "@mui/icons-material/Tune";
import Search from "@mui/icons-material/Search";
import Visibility from "@mui/icons-material/Visibility";
import RestartAlt from "@mui/icons-material/RestartAlt";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import Timeline from "@mui/icons-material/Timeline";
import Create from "@mui/icons-material/Create";
import Assignment from "@mui/icons-material/Assignment";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import Description from "@mui/icons-material/Description";
import Warning from "@mui/icons-material/Warning";
import { brandColors } from "../../theme";
import { useNavigate } from "react-router-dom";
import { reservasRows } from "./ReservasPage";

export const dispatchRows = [
  { actNumber: "843295", company: "TRANSPORTES OSORIO", driver: "GEROLAMO GNETTI", movement: "CARGA", product: "SODA CAUSTICA", plate: "ABCD12", status: "Aprobado", arrival: "08:30", attention: "09:15", departure: "10:45", durationMin: 94, region: "Centro", deliveryDate: "16/02/2026", deliveryTime: "08:00", freightOrder: "6100047545", deliveryQuantity: "28,000 TO", openQuantity: "28,000 TO", mode: "Camión Cisterna", route: "Z000 No Transit Day", customerAddress: "OXIQUIM CORONEL CORONEL", carrierName: "INMOB E INVERS POLYKARPO S A", plantLocation: "1752", scheduledDate: "16/02/2026", material: "213874", hasReservation: false, aprobadoIngresoSAC: true },
  { actNumber: "843298", company: "MERCOTANK CHILE", driver: "JORGE OLMOS", movement: "DESCARGA", product: "HIPOCLORITO DE SODIO", plate: "IJKL56", status: "Aprobado", arrival: "14:20", attention: "14:35", departure: "14:55", durationMin: 20, region: "Norte", deliveryDate: "17/02/2026", deliveryTime: "14:00", freightOrder: "6100047546", deliveryQuantity: "15,500 TO", openQuantity: "0,000 TO", mode: "Camión Cisterna", route: "Z001 Norte Express", customerAddress: "QUIMICA DEL PACIFICO", carrierName: "MERCOTANK CHILE", plantLocation: "1752", scheduledDate: "17/02/2026", material: "213875", hasReservation: true, aprobadoIngresoSAC: true },
  { actNumber: "843301", company: "LOGISTICA SUR", driver: "CARLOS MENDOZA", movement: "CARGA", product: "A CLORHIDRICO", plate: "QRST90", status: "No Recogido", arrival: "11:00", attention: "11:30", departure: "-", durationMin: 45, region: "Sur", deliveryDate: "18/02/2026", deliveryTime: "11:00", freightOrder: "6100047547", deliveryQuantity: "22,000 TO", openQuantity: "22,000 TO", mode: "Camión Cisterna", route: "Z002 Sur Logistics", customerAddress: "INDUSTRIAS QUIMICAS SUR", carrierName: "LOGISTICA SUR", plantLocation: "1752", scheduledDate: "18/02/2026", material: "213876", hasReservation: false },
  { actNumber: "843304", company: "TRANSPORTE NORTE", driver: "ROBERTO DIAZ", movement: "DESCARGA", product: "CLORURO FERRICO", plate: "YZAB34", status: "Aprobado", arrival: "16:00", attention: "16:15", departure: "16:45", durationMin: 45, region: "Norte", deliveryDate: "19/02/2026", deliveryTime: "16:00", freightOrder: "6100047548", deliveryQuantity: "18,500 TO", openQuantity: "0,000 TO", mode: "Camión Cisterna", route: "Z003 Norte Direct", customerAddress: "MINERA DEL NORTE", carrierName: "TRANSPORTE NORTE", plantLocation: "1752", scheduledDate: "19/02/2026", material: "213877", hasReservation: true, aprobadoIngresoSAC: true },
  { actNumber: "843305", company: "LOGISTICA CENTRAL", driver: "MARIA GONZALEZ", movement: "CARGA", product: "CALCIO TUR", plate: "WXYZ78", status: "No Recogido", arrival: "09:30", attention: "09:45", departure: "-", durationMin: 75, region: "Centro", deliveryDate: "20/02/2026", deliveryTime: "09:30", freightOrder: "6100047549", deliveryQuantity: "12,000 TO", openQuantity: "12,000 TO", mode: "Camión Cisterna", route: "Z004 Centro Hub", customerAddress: "CONSTRUCCIONES CENTRAL", carrierName: "LOGISTICA CENTRAL", plantLocation: "1752", scheduledDate: "20/02/2026", material: "213878", hasReservation: false },
  { actNumber: "843306", company: "TRANSPORTES DEL SUR", driver: "PEDRO LOPEZ", movement: "DESCARGA", product: "CALCIO REFI", plate: "EFGH12", status: "No Recogido", arrival: "10:15", attention: "10:30", departure: "-", durationMin: 150, region: "Sur", deliveryDate: "21/02/2026", deliveryTime: "10:00", freightOrder: "6100047550", deliveryQuantity: "25,000 TO", openQuantity: "25,000 TO", mode: "Camión Cisterna", route: "Z005 Sur Express", customerAddress: "REFINERIA DEL SUR", carrierName: "TRANSPORTES DEL SUR", plantLocation: "1752", scheduledDate: "21/02/2026", material: "213879", hasReservation: false },
  { actNumber: "843307", company: "MERCANCIA EXPRESS", driver: "CARLOS RUIZ", movement: "CARGA", product: "A SULFURICO DILUIDO", plate: "MNOP56", status: "Aprobado", arrival: "12:00", attention: "12:20", departure: "-", durationMin: 225, region: "Centro", deliveryDate: "22/02/2026", deliveryTime: "12:00", freightOrder: "6100047551", deliveryQuantity: "30,000 TO", openQuantity: "30,000 TO", mode: "Camión Cisterna", route: "Z006 Centro Express", customerAddress: "INDUSTRIAS QUIMICAS CENTRO", carrierName: "MERCANCIA EXPRESS", plantLocation: "1752", scheduledDate: "22/02/2026", material: "213880", hasReservation: true },
  { actNumber: "843308", company: "FLOTA RAPIDA", driver: "JORGE MORALES", movement: "DESCARGA", product: "CLORO", plate: "UVWX90", status: "No Recogido", arrival: "13:45", attention: "14:00", departure: "-", durationMin: 80, region: "Centro", deliveryDate: "16/02/2026", deliveryTime: "13:30", freightOrder: "6100047552", deliveryQuantity: "8,500 TO", openQuantity: "8,500 TO", mode: "Camión Cisterna", route: "Z007 Centro Fast", customerAddress: "PLANTA TRATAMIENTO AGUA", carrierName: "FLOTA RAPIDA", plantLocation: "1752", scheduledDate: "16/02/2026", material: "213881", hasReservation: false },
  { actNumber: "843309", company: "DISTRIBUCION BIOBIO", driver: "ANGELICA REYES", movement: "CARGA", product: "SODA CAUSTICA", plate: "LMNO21", status: "No Recogido", arrival: "17:10", attention: "-", departure: "-", durationMin: 0, region: "Sur", deliveryDate: "17/02/2026", deliveryTime: "17:00", freightOrder: "6100047553", deliveryQuantity: "20,000 TO", openQuantity: "20,000 TO", mode: "Camión Cisterna", route: "Z008 Sur BioBio", customerAddress: "PAPELERAS BIOBIO", carrierName: "DISTRIBUCION BIOBIO", plantLocation: "1752", scheduledDate: "17/02/2026", material: "213874", hasReservation: false },
  { actNumber: "843310", company: "NORTE INDUSTRIAL", driver: "RENATO PIZARRO", movement: "DESCARGA", product: "HIPOCLORITO DE SODIO", plate: "QWER45", status: "Aprobado", arrival: "07:35", attention: "08:05", departure: "-", durationMin: 52, region: "Norte", deliveryDate: "18/02/2026", deliveryTime: "07:30", freightOrder: "6100047554", deliveryQuantity: "16,000 TO", openQuantity: "16,000 TO", mode: "Camión Cisterna", route: "Z009 Norte Industrial", customerAddress: "INDUSTRIAS DEL NORTE", carrierName: "NORTE INDUSTRIAL", plantLocation: "1752", scheduledDate: "18/02/2026", material: "213875", hasReservation: true },
  { actNumber: "843311", company: "TRANS QUIMICA LTDA", driver: "PABLO MORA", movement: "CARGA", product: "A CLORHIDRICO", plate: "ASDF89", status: "Aprobado", arrival: "05:50", attention: "06:10", departure: "06:40", durationMin: 30, region: "Centro", deliveryDate: "19/02/2026", deliveryTime: "05:45", freightOrder: "6100047555", deliveryQuantity: "14,500 TO", openQuantity: "0,000 TO", mode: "Camión Cisterna", route: "Z010 Centro Quimica", customerAddress: "QUIMICA INDUSTRIAL", carrierName: "TRANS QUIMICA LTDA", plantLocation: "1752", scheduledDate: "19/02/2026", material: "213876", hasReservation: true },
  { actNumber: "843312", company: "RUTA SEGURA SPA", driver: "VALERIA NUNEZ", movement: "DESCARGA", product: "CLORURO FERRICO", plate: "ZXCV34", status: "No Recogido", arrival: "15:05", attention: "15:20", departure: "-", durationMin: 68, region: "Norte", deliveryDate: "20/02/2026", deliveryTime: "15:00", freightOrder: "6100047556", deliveryQuantity: "19,000 TO", openQuantity: "19,000 TO", mode: "Camión Cisterna", route: "Z011 Norte Segura", customerAddress: "MINERIA SEGURA", carrierName: "RUTA SEGURA SPA", plantLocation: "1752", scheduledDate: "20/02/2026", material: "213877", hasReservation: false },
];

function DespachosPage() {
  const navigate = useNavigate();
  const [dispatchData, setDispatchData] = useState(dispatchRows);
  const [regionFilter, setRegionFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [productFilter, setProductFilter] = useState([]);
  const [reservationFilter, setReservationFilter] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [bitacoraModalOpen, setBitacoraModalOpen] = useState(false);
  const [selectedReservaId, setSelectedReservaId] = useState(null);
  const rowsPerPage = 8;

  // Función para obtener el ID de la reserva asociada a un delivery
  const getReservaId = (actNumber) => {
    if (!actNumber) return null;
    // Buscar la reserva cuyo deliveryId coincida con el actNumber del delivery
    // El formato es: reserva.deliveryId = "DEL-843295" y delivery.actNumber = "843295"
    const reserva = reservasRows.find((r) => {
      if (!r.deliveryId) return false;
      const deliveryNumber = r.deliveryId.replace(/^DEL-/, "");
      return deliveryNumber === actNumber;
    });
    return reserva ? reserva.id : null;
  };

  // Función para obtener la bitácora de una reserva
  const getBitacoraByReservaId = (reservaId) => {
    if (!reservaId) return [];
    // Datos mock de bitácora - en producción vendría del backend
    const bitacoraMock = [
      {
        id: "BIT-001",
        tipo: "creacion",
        titulo: "Reserva creada",
        descripcion: `Reserva ${reservaId} creada en el sistema`,
        usuario: "Operador OXY",
        fecha: "2025-03-15 10:30:25",
        icono: "create",
        color: brandColors.oxyBlue,
      },
      {
        id: "BIT-002",
        tipo: "asignacion",
        titulo: "Delivery asignado",
        descripcion: `Delivery asignado a la reserva ${reservaId}`,
        usuario: "Supervisor",
        fecha: "2025-03-15 11:15:42",
        icono: "assignment",
        color: brandColors.oceanAqua,
      },
      {
        id: "BIT-003",
        tipo: "aprobacion",
        titulo: "Aprobada para ingreso SAC",
        descripcion: `Reserva ${reservaId} aprobada para ingreso desde SAC`,
        usuario: "Admin Sistema",
        fecha: "2025-03-15 14:20:10",
        icono: "check",
        color: brandColors.forestGreen,
      },
      {
        id: "BIT-004",
        tipo: "estado",
        titulo: "Estado cambiado",
        descripcion: `Estado de la reserva ${reservaId} cambiado a 'Confirmada'`,
        usuario: "Operador OXY",
        fecha: "2025-03-15 15:45:33",
        icono: "info",
        color: brandColors.dayBlue,
      },
    ];
    return bitacoraMock;
  };

  const handleOpenBitacora = (actNumber) => {
    const reservaId = getReservaId(actNumber);
    if (reservaId) {
      setSelectedReservaId(reservaId);
      setBitacoraModalOpen(true);
    }
  };

  const statusStyle = {
    "No Recogido": { bg: "#FEE2E2", color: "#991B1B" },
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
      const matchReservation =
        reservationFilter.length === 0 ||
        (reservationFilter.includes("con reserva") && row.hasReservation) ||
        (reservationFilter.includes("sin reserva") && !row.hasReservation);
      const matchSearch =
        !search ||
        row.actNumber.toLowerCase().includes(search) ||
        row.driver.toLowerCase().includes(search) ||
        row.company.toLowerCase().includes(search) ||
        row.plate.toLowerCase().includes(search);

      return matchRegion && matchStatus && matchProduct && matchReservation && matchSearch;
    });
  }, [dispatchData, productFilter, regionFilter, reservationFilter, searchValue, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const activeFilters =
    regionFilter.length + statusFilter.length + productFilter.length + reservationFilter.length +
    (searchValue.trim().length > 0 ? 1 : 0);

  const handleResetFilters = () => {
    setRegionFilter([]);
    setStatusFilter([]);
    setProductFilter([]);
    setReservationFilter([]);
    setSearchValue("");
    setPage(1);
  };


  return (
    <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
      <Stack spacing={1.4}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Delivery
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              variant="contained"
              color="primary"
              size="small"
              disabled
              sx={{ fontWeight: 600 }}
            >
              Lista de chequeo consolidado
            </Button>
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
              <MenuItem value="no recogido">
                <Checkbox size="small" checked={statusFilter.includes("no recogido")} />
                No Recogido
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
              <MenuItem value="soda caustica">
                <Checkbox size="small" checked={productFilter.includes("soda caustica")} />
                SODA CAUSTICA
              </MenuItem>
              <MenuItem value="hipoclorito de sodio">
                <Checkbox size="small" checked={productFilter.includes("hipoclorito de sodio")} />
                HIPOCLORITO DE SODIO
              </MenuItem>
              <MenuItem value="a clorhidrico">
                <Checkbox size="small" checked={productFilter.includes("a clorhidrico")} />
                A CLORHIDRICO
              </MenuItem>
              <MenuItem value="cloruro ferrico">
                <Checkbox size="small" checked={productFilter.includes("cloruro ferrico")} />
                CLORURO FERRICO
              </MenuItem>
              <MenuItem value="calcio tur">
                <Checkbox size="small" checked={productFilter.includes("calcio tur")} />
                CALCIO TUR
              </MenuItem>
              <MenuItem value="calcio refi">
                <Checkbox size="small" checked={productFilter.includes("calcio refi")} />
                CALCIO REFI
              </MenuItem>
              <MenuItem value="a sulfurico diluido">
                <Checkbox size="small" checked={productFilter.includes("a sulfurico diluido")} />
                A SULFURICO DILUIDO
              </MenuItem>
              <MenuItem value="cloro">
                <Checkbox size="small" checked={productFilter.includes("cloro")} />
                CLORO
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 190 }}>
            <InputLabel id="reservation-filter-label">Reserva</InputLabel>
            <Select
              labelId="reservation-filter-label"
              label="Reserva"
              multiple
              value={reservationFilter}
              onChange={(event) => {
                const value = event.target.value;
                setReservationFilter(typeof value === "string" ? value.split(",") : value);
                setPage(1);
              }}
              renderValue={(selected) => (selected.length ? selected.join(", ") : "Todas las Reservas")}
            >
              <MenuItem value="con reserva">
                <Checkbox size="small" checked={reservationFilter.includes("con reserva")} />
                Con Reserva
              </MenuItem>
              <MenuItem value="sin reserva">
                <Checkbox size="small" checked={reservationFilter.includes("sin reserva")} />
                Sin Reserva
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
                <TableCell>Delivery</TableCell>
                <TableCell sx={{ minWidth: 140 }}># de Reserva</TableCell>
                <TableCell>Fecha Entrega</TableCell>
                <TableCell>Hora Entrega</TableCell>
                <TableCell>Orden Transporte</TableCell>
                <TableCell>Cliente/Dirección</TableCell>
                <TableCell>Transportista</TableCell>
                <TableCell>Modo</TableCell>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Pendiente</TableCell>
                <TableCell>Ruta</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Reserva</TableCell>
                <TableCell>Conductor</TableCell>
                <TableCell>Patente</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => {
                const reservaId = getReservaId(row.actNumber);
                return (
                  <TableRow key={row.actNumber} hover>
                    <TableCell sx={{ fontWeight: 700 }}>{row.actNumber}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace", fontSize: "0.875rem", minWidth: 140 }}>
                      {reservaId || "-"}
                    </TableCell>
                    <TableCell>{row.deliveryDate || "-"}</TableCell>
                    <TableCell>{row.deliveryTime || "-"}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{row.freightOrder || "-"}</TableCell>
                  <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row.customerAddress || row.company}>
                    {row.customerAddress || row.company}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row.carrierName}>
                    {row.carrierName || row.company}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.mode || row.movement}
                      sx={{
                        bgcolor: movementStyle[row.movement]?.bg || "#E5E7EB",
                        color: movementStyle[row.movement]?.color || "#4B5563",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: brandColors.midnightBlue }}>{row.deliveryQuantity || "-"}</TableCell>
                  <TableCell sx={{ fontWeight: row.openQuantity && row.openQuantity !== "0,000 TO" ? 600 : 400, color: row.openQuantity && row.openQuantity !== "0,000 TO" ? brandColors.oxyRed : "text.secondary" }}>
                    {row.openQuantity || "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", color: "text.secondary" }}>{row.route || "-"}</TableCell>
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
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.hasReservation ? "Con Reserva" : "Sin Reserva"}
                      sx={{
                        bgcolor: row.hasReservation ? "#BCE8D2" : "#FEE2E2",
                        color: row.hasReservation ? "#0E5E46" : "#991B1B",
                        fontWeight: 600,
                        minWidth: 110,
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.driver}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", letterSpacing: "0.04em" }}>{row.plate}</TableCell>
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
                    <Tooltip title="Generar reserva" arrow placement="top">
                      <IconButton
                        size="small"
                        color="primary"
                        aria-label="generar reserva"
                        onClick={() => {
                          setSelectedDelivery(row);
                          setReservationModalOpen(true);
                        }}
                      >
                        <BookmarkBorder fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {getReservaId(row.actNumber) && (
                      <Tooltip title="Ver bitácora de reserva" arrow placement="top">
                        <IconButton
                          size="small"
                          color="primary"
                          aria-label="ver bitácora"
                          onClick={() => handleOpenBitacora(row.actNumber)}
                        >
                          <Timeline fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
                );
              })}
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

      <Dialog open={reservationModalOpen} onClose={() => setReservationModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Confirmar Generación de Reserva</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              ¿Está seguro que desea generar una reserva para el siguiente delivery?
            </Typography>
            {selectedDelivery && (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: "grey.50",
                  borderColor: "divider",
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Delivery:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedDelivery.actNumber}
                    </Typography>
                  </Stack>
                  {selectedDelivery.deliveryDate && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Fecha Entrega:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedDelivery.deliveryDate} {selectedDelivery.deliveryTime && `- ${selectedDelivery.deliveryTime}`}
                      </Typography>
                    </Stack>
                  )}
                  {selectedDelivery.freightOrder && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Orden Transporte:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: "monospace" }}>
                        {selectedDelivery.freightOrder}
                      </Typography>
                    </Stack>
                  )}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Cliente:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedDelivery.customerAddress || selectedDelivery.company}
                    </Typography>
                  </Stack>
                  {selectedDelivery.carrierName && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Transportista:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedDelivery.carrierName}
                      </Typography>
                    </Stack>
                  )}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Producto:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedDelivery.product}
                    </Typography>
                  </Stack>
                  {selectedDelivery.deliveryQuantity && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Cantidad:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.midnightBlue }}>
                        {selectedDelivery.deliveryQuantity}
                      </Typography>
                    </Stack>
                  )}
                  {selectedDelivery.openQuantity && selectedDelivery.openQuantity !== "0,000 TO" && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Pendiente:
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: brandColors.oxyRed }}>
                        {selectedDelivery.openQuantity}
                      </Typography>
                    </Stack>
                  )}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Conductor:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedDelivery.driver}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5 }}>
          <Button onClick={() => setReservationModalOpen(false)} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              // TODO: Implementar lógica para generar la reserva
              console.log("Generar reserva para:", selectedDelivery);
              setReservationModalOpen(false);
              setSelectedDelivery(null);
              // Aquí puedes agregar la navegación o lógica adicional
            }}
            variant="contained"
            color="primary"
            startIcon={<BookmarkBorder />}
          >
            Generar Reserva
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Bitácora */}
      <Dialog open={bitacoraModalOpen} onClose={() => setBitacoraModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Timeline sx={{ color: brandColors.oxyBlue }} />
            <Typography variant="h6">Bitácora por Reserva {selectedReservaId}</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <BitacoraTimeline eventos={getBitacoraByReservaId(selectedReservaId)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBitacoraModalOpen(false)} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

// Componente BitacoraTimeline
function BitacoraTimeline({ eventos }) {
  const getIcon = (icono) => {
    switch (icono) {
      case "create":
        return <Create fontSize="small" />;
      case "assignment":
        return <Assignment fontSize="small" />;
      case "check":
        return <CheckCircleOutline fontSize="small" />;
      case "info":
        return <InfoOutlined fontSize="small" />;
      case "shipping":
        return <LocalShippingOutlined fontSize="small" />;
      case "warning":
        return <Warning fontSize="small" />;
      case "document":
        return <Description fontSize="small" />;
      default:
        return <InfoOutlined fontSize="small" />;
    }
  };

  const formatFecha = (fechaStr) => {
    if (!fechaStr) return "";
    try {
      const fecha = new Date(fechaStr.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/, "$1T$2"));
      const fechaFormateada = fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
      const horaFormateada = fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
      return `${fechaFormateada} ${horaFormateada}`;
    } catch {
      return fechaStr;
    }
  };

  if (!eventos || eventos.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body2" color="text.secondary">
          No hay actividades registradas
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", pl: 3, pt: 2 }}>
      {/* Línea vertical del timeline */}
      <Box
        sx={{
          position: "absolute",
          left: 15,
          top: 0,
          bottom: 0,
          width: 2,
          bgcolor: "divider",
        }}
      />
      <Stack spacing={3}>
        {eventos.map((evento) => (
          <Box key={evento.id} sx={{ position: "relative" }}>
            {/* Punto del timeline */}
            <Box
              sx={{
                position: "absolute",
                left: -21,
                top: 4,
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: evento.color,
                border: `3px solid white`,
                boxShadow: `0 0 0 2px ${evento.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                zIndex: 1,
              }}
            >
              {getIcon(evento.icono)}
            </Box>
            {/* Contenido del evento */}
            <Paper
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.paper",
                boxShadow: "0px 2px 8px rgba(0, 46, 77, 0.06)",
                transition: "all 200ms ease",
                "&:hover": {
                  boxShadow: "0px 4px 12px rgba(0, 46, 77, 0.12)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: brandColors.midnightBlue, mb: 0.5 }}>
                      {evento.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {evento.descripcion}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    label={evento.usuario}
                    size="small"
                    sx={{
                      bgcolor: `${evento.color}15`,
                      color: evento.color,
                      fontWeight: 600,
                      fontSize: "0.7rem",
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                    {formatFecha(evento.fecha)}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default DespachosPage;
