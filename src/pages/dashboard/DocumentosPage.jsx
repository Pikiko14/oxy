import { useMemo, useState } from "react";
import {
  Box,
  Button,
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
import Search from "@mui/icons-material/Search";
import Download from "@mui/icons-material/Download";
import Send from "@mui/icons-material/Send";
import Visibility from "@mui/icons-material/Visibility";
import Description from "@mui/icons-material/Description";
import { brandColors } from "../../theme";

// Datos mock de documentos
export const documentosRows = [
  {
    id: "DOC-001",
    tipo: "Guía de despacho",
    numero: "GD-542187",
    deliveryId: "DEL-843295",
    reservaId: "RES-001",
    fecha: "2025-03-16",
    estado: "Enviado",
    destinatario: "TRANSPORTES OSORIO",
    categoria: "Comercial",
  },
  {
    id: "DOC-002",
    tipo: "Certificado",
    numero: "TP-98732",
    deliveryId: "DEL-843295",
    reservaId: "RES-001",
    fecha: "2025-03-16",
    estado: "Pendiente",
    destinatario: "TRANSPORTES OSORIO",
    categoria: "Operativo",
  },
  {
    id: "DOC-003",
    tipo: "Guía de despacho",
    numero: "GD-342156",
    deliveryId: "DEL-843298",
    reservaId: "RES-002",
    fecha: "2025-03-16",
    estado: "Enviado",
    destinatario: "MERCOTANK CHILE",
    categoria: "Comercial",
  },
  {
    id: "DOC-004",
    tipo: "Certificado",
    numero: "TP-76543",
    deliveryId: "DEL-843301",
    reservaId: "RES-003",
    fecha: "2025-03-16",
    estado: "Generado",
    destinatario: "LOGISTICA SUR",
    categoria: "Comercial",
  },
  {
    id: "DOC-005",
    tipo: "Guía de despacho",
    numero: "GD-123456",
    deliveryId: "DEL-843304",
    reservaId: "RES-004",
    fecha: "2025-03-16",
    estado: "Enviado",
    destinatario: "TRANSPORTE NORTE",
    categoria: "Comercial",
  },
];

function DocumentosPage() {
  const [tipoFilter, setTipoFilter] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const filteredRows = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    return documentosRows
      .filter((row) => {
        // Solo mostrar "Guía de despacho" y "Certificado"
        return row.tipo === "Guía de despacho" || row.tipo === "Certificado";
      })
      .filter((row) => {
        const rowTipo = row.tipo.toLowerCase();
        const matchTipo = tipoFilter.length === 0 || tipoFilter.includes(rowTipo);
        const matchSearch =
          !search ||
          row.id.toLowerCase().includes(search) ||
          row.numero.toLowerCase().includes(search) ||
          row.deliveryId.toLowerCase().includes(search) ||
          row.destinatario.toLowerCase().includes(search);

        return matchTipo && matchSearch;
      });
  }, [tipoFilter, searchValue]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Solo mostrar los dos tipos permitidos en el filtro
  const uniqueTipos = ["Guía de despacho", "Certificado"];

  return (
    <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
      <Stack spacing={1.4}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Documentos
          </Typography>
          <Button variant="outlined" color="primary" startIcon={<Send />} size="small">
            Enviar Documento
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
          <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 180 } }}>
            <InputLabel id="tipo-filter-label">Tipo</InputLabel>
            <Select
              labelId="tipo-filter-label"
              label="Tipo"
              multiple
              value={tipoFilter}
              onChange={(event) => setTipoFilter(event.target.value)}
              renderValue={(selected) => (selected.length === 0 ? "Todos" : `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}`)}
            >
              {uniqueTipos.map((tipo) => (
                <MenuItem key={tipo} value={tipo.toLowerCase()}>
                  {tipo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Buscar"
            placeholder="Buscar por ID, número, delivery..."
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
                <TableCell>ID</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Número</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Destinatario</TableCell>
                <TableCell align="center">Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron documentos
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>{row.id}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Description fontSize="small" sx={{ color: brandColors.oxyBlue }} />
                        <Typography>{row.tipo}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{row.numero}</TableCell>
                    <TableCell sx={{ fontFamily: "monospace" }}>{row.deliveryId}</TableCell>
                    <TableCell>{row.fecha}</TableCell>
                    <TableCell>{row.destinatario}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver documento" arrow placement="top">
                        <IconButton size="small" color="primary">
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Descargar" arrow placement="top">
                        <IconButton size="small" color="primary">
                          <Download fontSize="small" />
                        </IconButton>
                      </Tooltip>
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
      </Stack>
    </Paper>
  );
}

export default DocumentosPage;
