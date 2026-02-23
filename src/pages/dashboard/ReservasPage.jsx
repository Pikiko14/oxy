import React, { useMemo, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es.js";
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
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Tab,
  Tabs,
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
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Description from "@mui/icons-material/Description";
import Download from "@mui/icons-material/Download";
import Send from "@mui/icons-material/Send";
import Checklist from "@mui/icons-material/Checklist";
import Timeline from "@mui/icons-material/Timeline";
import { brandColors } from "../../theme";
import { useNavigate } from "react-router-dom";
import { dispatchRows, BitacoraTimeline } from "./DespachosPage";
import { documentosRows } from "./DocumentosPage";
import ConsolidacionModal from "./ConsolidacionModal";

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
    // Permitir más de un producto en el expandible
    items: [
      { producto: "SODA CAUSTICA", cantidad: "5,000 kg" },
      { producto: "HIPOCLORITO DE SODIO", cantidad: "2,000 kg" },
    ],
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
    fechaReserva: "2026-02-19",
    horaReserva: "10:00",
    estado: "Pendiente",
    tipo: "Carga",
    conductor: "JUAN PEREZ",
    vehiculo: "NEW123",
  },
  {
    id: "RES-007",
    deliveryId: "DEL-843320",
    cliente: "TRANSPORTES FEBRERO",
    producto: "HIPOCLORITO DE SODIO",
    cantidad: "26,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "08:30",
    estado: "Confirmada",
    tipo: "Carga",
    conductor: "MARTIN FERNANDEZ",
    vehiculo: "FEB789",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-023",
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
  // Reservas adicionales para el 23/02/2026
  {
    id: "RES-008",
    deliveryId: "DEL-843321",
    cliente: "LOGISTICA ANDES",
    producto: "SODA CAUSTICA",
    cantidad: "20,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "07:45",
    estado: "Confirmada",
    tipo: "Carga",
    conductor: "RAUL SEPULVEDA",
    vehiculo: "AND321",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-009",
    deliveryId: "DEL-843322",
    cliente: "TRANSPORTE LITORAL",
    producto: "HIPOCLORITO DE SODIO",
    cantidad: "18,500 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "09:15",
    estado: "Pendiente",
    tipo: "Descarga",
    conductor: "CARLA ROJAS",
    vehiculo: "LIT456",
  },
  {
    id: "RES-010",
    deliveryId: "DEL-843323",
    cliente: "NORTE EXPRESS",
    producto: "A CLORHIDRICO",
    cantidad: "22,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "10:00",
    estado: "Confirmada",
    tipo: "Carga",
    conductor: "JORGE QUISPE",
    vehiculo: "NOR789",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-011",
    deliveryId: "DEL-843324",
    cliente: "SUR LOGISTICS",
    producto: "CLORURO FERRICO",
    cantidad: "16,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "10:30",
    estado: "Pendiente",
    tipo: "Descarga",
    conductor: "MARIO PEREZ",
    vehiculo: "SUR111",
  },
  {
    id: "RES-012",
    deliveryId: "DEL-843325",
    cliente: "RUTA METROPOLITANA",
    producto: "SODA CAUSTICA",
    cantidad: "24,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "11:15",
    estado: "Confirmada",
    tipo: "Carga",
    conductor: "VERONICA DIAZ",
    vehiculo: "MET222",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-013",
    deliveryId: "DEL-843326",
    cliente: "ANDINA CARGAS",
    producto: "HIPOCLORITO DE SODIO",
    cantidad: "19,500 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "12:00",
    estado: "Confirmada",
    tipo: "Descarga",
    conductor: "PABLO GARCIA",
    vehiculo: "AND654",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-014",
    deliveryId: "DEL-843327",
    cliente: "PACIFICO TRANSPORTES",
    producto: "A SULFURICO DILUIDO",
    cantidad: "21,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "12:30",
    estado: "Confirmada",
    tipo: "Carga",
    conductor: "RODRIGO LARA",
    vehiculo: "PAC777",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-015",
    deliveryId: "DEL-843328",
    cliente: "LOGISTICA AUSTRAL",
    producto: "CLORO",
    cantidad: "9,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "13:00",
    estado: "Pendiente",
    tipo: "Descarga",
    conductor: "NICOLAS OYARZO",
    vehiculo: "AUS888",
  },
  {
    id: "RES-016",
    deliveryId: "DEL-843329",
    cliente: "CORDILLERA LOGISTICS",
    producto: "SODA CAUSTICA",
    cantidad: "23,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "13:30",
    estado: "Confirmada",
    tipo: "Carga",
    conductor: "ALEJANDRA MESA",
    vehiculo: "COR999",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-017",
    deliveryId: "DEL-843330",
    cliente: "RUTA CENTRAL",
    producto: "HIPOCLORITO DE SODIO",
    cantidad: "17,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "14:00",
    estado: "Pendiente",
    tipo: "Descarga",
    conductor: "SERGIO PAVEZ",
    vehiculo: "RUT123",
  },
  {
    id: "RES-018",
    deliveryId: "DEL-843331",
    cliente: "LOGISTICA INDUSTRIAL",
    producto: "A CLORHIDRICO",
    cantidad: "20,500 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "14:30",
    estado: "Confirmada",
    tipo: "Carga",
    conductor: "SOFIA CARRASCO",
    vehiculo: "IND456",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-019",
    deliveryId: "DEL-843332",
    cliente: "TRANSPORTE MINERO",
    producto: "CLORURO FERRICO",
    cantidad: "18,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "15:00",
    estado: "Confirmada",
    tipo: "Descarga",
    conductor: "DANIEL ROJAS",
    vehiculo: "MIN741",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-020",
    deliveryId: "DEL-843333",
    cliente: "LOGISTICA BIOBIO",
    producto: "SODA CAUSTICA",
    cantidad: "19,000 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "15:30",
    estado: "Confirmada",
    tipo: "Carga",
    conductor: "PATRICIA ALVEAR",
    vehiculo: "BIO258",
    aprobadoIngresoSAC: true,
  },
  {
    id: "RES-021",
    deliveryId: "DEL-843334",
    cliente: "RUTA COSTERA",
    producto: "HIPOCLORITO DE SODIO",
    cantidad: "16,800 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "16:00",
    estado: "Pendiente",
    tipo: "Descarga",
    conductor: "IGNACIO SOTO",
    vehiculo: "COS369",
  },
  {
    id: "RES-022",
    deliveryId: "DEL-843335",
    cliente: "TRANSPORTES ANDINOS",
    producto: "A SULFURICO DILUIDO",
    cantidad: "23,500 kg",
    fechaReserva: "2026-02-23",
    horaReserva: "16:30",
    estado: "Confirmada",
    tipo: "Carga",
    conductor: "MIGUEL HERRERA",
    vehiculo: "AND852",
    aprobadoIngresoSAC: true,
  },
];

function ReservasPage() {
  const navigate = useNavigate();
  const [estadoFilter, setEstadoFilter] = useState([]);
  const [tipoFilter, setTipoFilter] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [page, setPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [editFechaReserva, setEditFechaReserva] = useState("");
  const [editHoraReserva, setEditHoraReserva] = useState("");
  const [newReservaModalOpen, setNewReservaModalOpen] = useState(false);
  const [newFechaReserva, setNewFechaReserva] = useState("");
  const [newHoraReserva, setNewHoraReserva] = useState("");
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [isEditingReserva, setIsEditingReserva] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [refreshKey, setRefreshKey] = useState(0); // Para forzar actualización de la tabla
  const [documentosModalOpen, setDocumentosModalOpen] = useState(false);
  const [selectedReservaForDocumentos, setSelectedReservaForDocumentos] = useState(null);
  const [consolidacionModalOpen, setConsolidacionModalOpen] = useState(false);
  const [selectedReservaForConsolidacion, setSelectedReservaForConsolidacion] = useState(null);
  const [bitacoraModalOpen, setBitacoraModalOpen] = useState(false);
  const [selectedReservaId, setSelectedReservaId] = useState(null);
  const rowsPerPage = 8;
  const calendarRef = useRef(null);

  // Convertir reservas a eventos de FullCalendar
  const calendarEvents = useMemo(() => {
    return reservasRows
      .filter((reserva) => reserva.fechaReserva && reserva.horaReserva)
      .map((reserva) => {
        // Parsear fecha en formato YYYY-MM-DD
        const [year, month, day] = reserva.fechaReserva.split("-").map(Number);
        const [hora, minuto] = reserva.horaReserva.split(":").map(Number);
        
        // Crear fecha en zona horaria local
        const fecha = new Date(year, month - 1, day, hora, minuto, 0);
        
        // Determinar color según el estado de la reserva
        let backgroundColor = brandColors.sunriseOrange; // Pendiente - Amarillo/Naranja
        let borderColor = brandColors.sunriseOrange;
        
        if (reserva.estado === "Confirmada" || reserva.estado === "Completada") {
          backgroundColor = brandColors.forestGreen; // Confirmada/Completada - Verde
          borderColor = brandColors.forestGreen;
        } else if (reserva.estado === "Anulada") {
          backgroundColor = brandColors.aluminumGray; // Anulada - Gris
          borderColor = brandColors.aluminumGray;
        } else if (reserva.estado === "Pendiente") {
          backgroundColor = brandColors.sunriseOrange; // Pendiente - Amarillo/Naranja
          borderColor = brandColors.sunriseOrange;
        } else if (reserva.aprobadoIngresoSAC) {
          backgroundColor = brandColors.dayBlue; // Aprobado SAC - Azul
          borderColor = brandColors.dayBlue;
        }
        
        return {
          id: reserva.id,
          title: reserva.id,
          start: fecha,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          textColor: "white",
          extendedProps: {
            reserva: reserva,
          },
        };
      });
  }, [reservasRows, refreshKey]);

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

  const handleToggleRow = (reservaId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(reservaId)) {
      newExpanded.delete(reservaId);
    } else {
      newExpanded.add(reservaId);
    }
    setExpandedRows(newExpanded);
  };

  const handleOpenBitacora = (reservaId) => {
    if (reservaId) {
      setSelectedReservaId(reservaId);
      setBitacoraModalOpen(true);
    }
  };

  // Función para calcular días sin delivery
  const calcularDiasSinDelivery = (reserva) => {
    // Solo calcular si no tiene delivery
    if (reserva.deliveryId !== null && reserva.deliveryId !== undefined && reserva.deliveryId !== "") {
      return null;
    }
    
    if (!reserva.fechaReserva) return null;
    
    // Obtener fecha de hoy en formato local (sin hora)
    const hoy = new Date();
    const hoyLocal = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    
    // Parsear fecha de reserva (formato YYYY-MM-DD)
    const [year, month, day] = reserva.fechaReserva.split('-').map(Number);
    const fechaCreacion = new Date(year, month - 1, day);
    
    // Calcular diferencia en días
    const diferencia = hoyLocal - fechaCreacion;
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
      const rowEstado = (row.estado || "").toLowerCase();
      const rowTipo = (row.tipo || "").toLowerCase();
      const matchEstado = estadoFilter.length === 0 || estadoFilter.includes(rowEstado);
      const matchTipo = tipoFilter.length === 0 || tipoFilter.includes(rowTipo);
      const matchSearch =
        !search ||
        (row.id || "").toLowerCase().includes(search) ||
        (row.deliveryId || "").toLowerCase().includes(search) ||
        (row.cliente || "").toLowerCase().includes(search) ||
        (row.producto || "").toLowerCase().includes(search) ||
        (row.conductor || "").toLowerCase().includes(search);

      // Filtro por fecha
      let matchFecha = true;
      if (fechaDesde || fechaHasta) {
        if (!row.fechaReserva) {
          matchFecha = false;
        } else {
          const fechaReserva = row.fechaReserva; // Formato YYYY-MM-DD
          if (fechaDesde && fechaReserva < fechaDesde) {
            matchFecha = false;
          }
          if (fechaHasta && fechaReserva > fechaHasta) {
            matchFecha = false;
          }
        }
      }

      return matchEstado && matchTipo && matchSearch && matchFecha;
    });
  }, [estadoFilter, tipoFilter, searchValue, fechaDesde, fechaHasta, refreshKey]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const paginatedRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const activeFilters = estadoFilter.length + tipoFilter.length + (searchValue.trim().length > 0 ? 1 : 0) + (fechaDesde ? 1 : 0) + (fechaHasta ? 1 : 0);

  const handleResetFilters = () => {
    setEstadoFilter([]);
    setTipoFilter([]);
    setSearchValue("");
    setFechaDesde("");
    setFechaHasta("");
    setPage(1);
  };

  const handleOpenEditModal = (reserva) => {
    setSelectedReserva(reserva);
    setIsEditingReserva(true);
    
    // Pre-llenar los campos del formulario de reserva
    setNewFechaReserva(reserva.fechaReserva || "");
    setNewHoraReserva(reserva.horaReserva || "");
    
    // Si tiene delivery, extraer el número del deliveryId (ej: "DEL-843295" -> "843295")
    if (reserva.deliveryId) {
      const deliveryNumber = reserva.deliveryId.replace(/^DEL-/, "");
      setSelectedDelivery(deliveryNumber);
    } else {
      setSelectedDelivery("");
    }
    
    // Abrir el modal de nueva reserva (que ahora será de edición)
    setNewReservaModalOpen(true);
    
    // Cambiar la vista del calendario a la fecha de la reserva si existe
    if (reserva.fechaReserva && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const fecha = new Date(reserva.fechaReserva);
      calendarApi.gotoDate(fecha);
      calendarApi.changeView("timeGridDay", reserva.fechaReserva);
    }
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

  const uniqueEstados = useMemo(() => [...new Set(reservasRows.map((row) => row.estado))], [refreshKey]);
  const uniqueTipos = useMemo(() => [...new Set(reservasRows.map((row) => row.tipo))], [refreshKey]);

  // Obtener deliveries que no tienen reserva asociada (o el delivery actual si se está editando)
  const deliveriesSinReserva = useMemo(() => {
    const deliveryIdsConReserva = new Set(
      reservasRows
        .filter((r) => {
          // Si estamos editando, excluir la reserva actual del filtro
          if (isEditingReserva && selectedReserva && r.id === selectedReserva.id) {
            return false;
          }
          return r.deliveryId && r.deliveryId !== null && r.deliveryId !== undefined && r.deliveryId !== "";
        })
        .map((r) => {
          // Extraer el número del delivery (ej: "DEL-843295" -> "843295")
          const match = r.deliveryId.match(/DEL-(\d+)/);
          return match ? match[1] : null;
        })
        .filter((id) => id !== null)
    );

    const deliveriesDisponibles = dispatchRows
      .filter((delivery) => {
        // Verificar si el delivery tiene una reserva asociada (excepto la actual si se está editando)
        return !deliveryIdsConReserva.has(delivery.actNumber);
      })
      .map((delivery) => ({
        value: delivery.actNumber,
        label: `DEL-${delivery.actNumber} - ${delivery.product} - ${delivery.customerAddress?.substring(0, 30) || delivery.company}`,
        delivery: delivery,
      }));

    // Si estamos editando y la reserva tiene un delivery, agregarlo a la lista
    if (isEditingReserva && selectedReserva && selectedReserva.deliveryId) {
      const deliveryNumber = selectedReserva.deliveryId.replace(/^DEL-/, "");
      const deliveryActual = dispatchRows.find((d) => d.actNumber === deliveryNumber);
      if (deliveryActual) {
        const deliveryActualOption = {
          value: deliveryActual.actNumber,
          label: `DEL-${deliveryActual.actNumber} - ${deliveryActual.product} - ${deliveryActual.customerAddress?.substring(0, 30) || deliveryActual.company}`,
          delivery: deliveryActual,
        };
        // Agregar al inicio de la lista si no está ya incluido
        if (!deliveriesDisponibles.find((d) => d.value === deliveryActual.actNumber)) {
          deliveriesDisponibles.unshift(deliveryActualOption);
        }
      }
    }

    return deliveriesDisponibles;
  }, [refreshKey, isEditingReserva, selectedReserva]);

  // Función para obtener reservas por fecha
  const getReservasByDate = (fechaKey) => {
    return reservasRows.filter((reserva) => {
      if (!reserva.fechaReserva) return false;
      return reserva.fechaReserva === fechaKey;
    });
  };

  // Función para obtener horarios ocupados en una fecha
  const getHorariosOcupados = (fechaKey) => {
    const reservas = getReservasByDate(fechaKey);
    return reservas.map((r) => r.horaReserva).filter((h) => h);
  };

  // Función para generar horarios disponibles (6am - 5pm)
  const generarHorariosDisponibles = (fechaSeleccionada) => {
    const horarios = [];
    const horariosOcupados = fechaSeleccionada ? getHorariosOcupados(fechaSeleccionada) : [];
    
    for (let hora = 6; hora <= 17; hora++) {
      for (let minuto = 0; minuto < 60; minuto += 30) {
        const horaStr = `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
        const disponible = !horariosOcupados.includes(horaStr);
        horarios.push({ hora: horaStr, disponible });
      }
    }
    return horarios;
  };


  const handleOpenNewReservaModal = () => {
    setIsEditingReserva(false);
    setSelectedReserva(null);
    setSelectedDelivery("");
    setNewReservaModalOpen(true);
    // Establecer fecha por defecto como hoy
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    setNewFechaReserva(`${year}-${month}-${day}`);
    setNewHoraReserva("");
    setSelectedDelivery("");
  };

  // Manejar selección de slot (fecha/hora) en FullCalendar
  const handleSelectSlot = (selectInfo) => {
    const fechaInicio = selectInfo.start;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaSeleccionada = new Date(fechaInicio);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    
    // Solo permitir fechas futuras o hoy
    if (fechaSeleccionada < hoy) {
      if (calendarRef.current) {
        calendarRef.current.getApi().unselect();
      }
      return;
    }
    
    const year = fechaInicio.getFullYear();
    const month = String(fechaInicio.getMonth() + 1).padStart(2, "0");
    const day = String(fechaInicio.getDate()).padStart(2, "0");
    const fechaKey = `${year}-${month}-${day}`;
    
    setNewFechaReserva(fechaKey);
    
    // Obtener la hora de inicio de la selección
    const hora = fechaInicio.getHours();
    const minuto = fechaInicio.getMinutes();
    
    // Validar que esté entre 6am y 5pm
    if (hora >= 6 && hora <= 17) {
      // Redondear a intervalos de 30 minutos
      const minutoRedondeado = minuto < 30 ? 0 : 30;
      const horaStr = `${String(hora).padStart(2, "0")}:${String(minutoRedondeado).padStart(2, "0")}`;
      const horariosOcupados = getHorariosOcupados(fechaKey);
      
      // Solo establecer si no está ocupado
      if (!horariosOcupados.includes(horaStr)) {
        setNewHoraReserva(horaStr);
      } else {
        // Si está ocupado, buscar el siguiente horario disponible
        const horariosDisponibles = generarHorariosDisponibles(fechaKey);
        const siguienteDisponible = horariosDisponibles.find(h => h.disponible && h.hora > horaStr);
        if (siguienteDisponible) {
          setNewHoraReserva(siguienteDisponible.hora);
        }
      }
    } else {
      // Si está fuera del rango, establecer la hora mínima disponible
      const horariosDisponibles = generarHorariosDisponibles(fechaKey);
      const primerDisponible = horariosDisponibles.find(h => h.disponible);
      if (primerDisponible) {
        setNewHoraReserva(primerDisponible.hora);
      }
    }
    
    // NO cerrar la selección - dejar que se mantenga visible
    // La selección se mantendrá hasta que se seleccione otro slot o se cierre el modal
  };

  // Manejar clic en día (para vista de mes)
  const handleDateClick = (dateClickInfo) => {
    // Si estamos en la vista de mes, cambiar a la vista de día para permitir seleccionar hora
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentView = calendarApi.view.type;
      
      if (currentView === "dayGridMonth") {
        // Cambiar a la vista de día para el día seleccionado
        calendarApi.changeView("timeGridDay", dateClickInfo.dateStr);
        
        // Establecer la fecha seleccionada
        const fecha = new Date(dateClickInfo.date);
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, "0");
        const day = String(fecha.getDate()).padStart(2, "0");
        const fechaKey = `${year}-${month}-${day}`;
        setNewFechaReserva(fechaKey);
        
        // Establecer la primera hora disponible del día
        const horariosDisponibles = generarHorariosDisponibles(fechaKey);
        const primerDisponible = horariosDisponibles.find(h => h.disponible);
        if (primerDisponible) {
          setNewHoraReserva(primerDisponible.hora);
        }
      }
    }
  };

  // Manejar clic en evento (reserva) del calendario
  const handleEventClick = (clickInfo) => {
    const reserva = clickInfo.event.extendedProps.reserva;
    if (reserva) {
      navigate(`/dashboard/reservas/${reserva.id}`);
    }
  };

  const handleCloseNewReservaModal = () => {
    setNewReservaModalOpen(false);
    setNewFechaReserva("");
    setNewHoraReserva("");
    setSelectedDelivery("");
    setIsEditingReserva(false);
    setSelectedReserva(null);
  };

  const handleSaveNewReserva = () => {
    if (!newFechaReserva || !newHoraReserva) {
      toast.warning("Por favor seleccione fecha y hora de la reserva");
      return;
    }

    // Si estamos editando una reserva existente
    if (isEditingReserva && selectedReserva) {
      // Actualizar la reserva existente
      const index = reservasRows.findIndex((r) => r.id === selectedReserva.id);
      if (index !== -1) {
        // Actualizar solo fecha y hora (y delivery si cambió)
        reservasRows[index].fechaReserva = newFechaReserva;
        reservasRows[index].horaReserva = newHoraReserva;
        
        // Si cambió el delivery
        if (selectedDelivery) {
          const deliverySeleccionado = dispatchRows.find((d) => d.actNumber === selectedDelivery);
          if (deliverySeleccionado) {
            reservasRows[index].deliveryId = `DEL-${selectedDelivery}`;
            reservasRows[index].cliente = deliverySeleccionado.company || deliverySeleccionado.carrierName || reservasRows[index].cliente;
            reservasRows[index].producto = deliverySeleccionado.product || reservasRows[index].producto;
            reservasRows[index].cantidad = deliverySeleccionado.deliveryQuantity || reservasRows[index].cantidad;
            reservasRows[index].tipo = deliverySeleccionado.movement === "CARGA" ? "Carga" : "Descarga";
            reservasRows[index].conductor = deliverySeleccionado.driver || reservasRows[index].conductor;
            reservasRows[index].vehiculo = deliverySeleccionado.plate || reservasRows[index].vehiculo;
          }
        } else {
          // Si se quitó el delivery
          reservasRows[index].deliveryId = null;
        }

        // Forzar actualización de la tabla
        setRefreshKey(prev => prev + 1);

        // Actualizar el calendario
        if (calendarRef.current) {
          calendarRef.current.getApi().refetchEvents();
        }

        handleCloseNewReservaModal();
        toast.success(`Reserva ${selectedReserva.id} actualizada exitosamente`);
        return;
      }
    }

    // Si no estamos editando, crear una nueva reserva
    // Generar nuevo ID de reserva
    const nuevoId = `RES-${String(reservasRows.length + 1).padStart(3, "0")}`;

    // Si hay delivery seleccionado, usar sus datos
    let nuevaReserva;
    if (selectedDelivery) {
      const deliverySeleccionado = dispatchRows.find((d) => d.actNumber === selectedDelivery);
      if (!deliverySeleccionado) {
        toast.error("Delivery no encontrado");
        return;
      }

      nuevaReserva = {
        id: nuevoId,
        deliveryId: `DEL-${selectedDelivery}`,
        cliente: deliverySeleccionado.company || deliverySeleccionado.carrierName || "",
        producto: deliverySeleccionado.product || "",
        cantidad: deliverySeleccionado.deliveryQuantity || "0 TO",
        fechaReserva: newFechaReserva,
        horaReserva: newHoraReserva,
        estado: "Pendiente",
        tipo: deliverySeleccionado.movement === "CARGA" ? "Carga" : "Descarga",
        conductor: deliverySeleccionado.driver || "",
        vehiculo: deliverySeleccionado.plate || "",
      };
    } else {
      // Crear reserva sin delivery
      nuevaReserva = {
        id: nuevoId,
        deliveryId: null,
        cliente: "",
        producto: "",
        cantidad: "",
        fechaReserva: newFechaReserva,
        horaReserva: newHoraReserva,
        estado: "Pendiente",
        tipo: "Carga",
        conductor: "",
        vehiculo: "",
      };
    }

    // Aquí se guardaría en el backend
    console.log("Creando nueva reserva:", nuevaReserva);
    
    // Agregar a la lista local (en producción vendría del backend)
    reservasRows.push(nuevaReserva);

    // Forzar actualización de la tabla
    setRefreshKey(prev => prev + 1);

    // Actualizar el calendario para mostrar la nueva reserva
    if (calendarRef.current) {
      calendarRef.current.getApi().refetchEvents();
    }

    handleCloseNewReservaModal();
    
    // Mostrar mensaje de éxito
    toast.success(`Reserva ${nuevoId} creada exitosamente`);
  };

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
            <Button variant="contained" color="primary" startIcon={<Add />} size="small" onClick={handleOpenNewReservaModal}>
              Nueva Reserva
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: "stretch", md: "center" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} flexWrap="wrap">
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
              type="date"
              label="Fecha Desde"
              value={fechaDesde}
              onChange={(e) => {
                setFechaDesde(e.target.value);
                setPage(1);
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: "100%", md: 180 } }}
            />

            <TextField
              size="small"
              type="date"
              label="Fecha Hasta"
              value={fechaHasta}
              onChange={(e) => {
                setFechaHasta(e.target.value);
                setPage(1);
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: { xs: "100%", md: 180 } }}
            />
          </Stack>

          <TextField
            size="small"
            label="Buscar"
            placeholder="Buscar por ID, delivery, cliente, producto..."
            sx={{ minWidth: { xs: "100%", md: 180 }, maxWidth: { xs: "100%", md: 220 } }}
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
                <TableCell padding="checkbox" sx={{ width: 48 }}></TableCell>
                <TableCell>ID Reserva</TableCell>
                <TableCell>Delivery</TableCell>
                <TableCell>Cliente</TableCell>
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
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No se encontraron reservas
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => {
                  const isExpanded = expandedRows.has(row.id);
                  return (
                    <React.Fragment key={row.id}>
                      <TableRow hover>
                        <TableCell padding="checkbox" sx={{ width: 48 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleRow(row.id)}
                            sx={{ p: 0.5 }}
                          >
                            {isExpanded ? (
                              <ExpandMore fontSize="small" />
                            ) : (
                              <ChevronRight fontSize="small" />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>{row.id}</TableCell>
                        <TableCell sx={{ fontFamily: "monospace" }}>{row.deliveryId || "-"}</TableCell>
                        <TableCell>{row.cliente}</TableCell>
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
                          <Tooltip title="Documentos" arrow placement="top">
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={() => {
                                setSelectedReservaForDocumentos(row);
                                setDocumentosModalOpen(true);
                              }}
                            >
                              <Description fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chequeo Consolidado" arrow placement="top">
                            <IconButton 
                              size="small" 
                              color="primary" 
                              onClick={() => {
                                setSelectedReservaForConsolidacion(row);
                                setConsolidacionModalOpen(true);
                              }}
                            >
                              <Checklist fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Ver bitácora de reserva" arrow placement="top">
                            <IconButton
                              size="small"
                              color="primary"
                              aria-label="ver bitácora"
                              onClick={() => handleOpenBitacora(row.id)}
                            >
                              <Timeline fontSize="small" />
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
                      {isExpanded && (
                        <TableRow>
                          <TableCell colSpan={10} sx={{ py: 2, bgcolor: "grey.50" }}>
                            <Box sx={{ pl: 4 }}>
                              {Array.isArray(row.items) && row.items.length > 0 ? (
                                <Box>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
                                  >
                                    Ítems de la reserva
                                  </Typography>
                                  <Stack spacing={0.5}>
                                    {row.items.map((item, index) => (
                                      <Stack key={index} direction="row" spacing={2}>
                                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                          {item.producto}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                          {item.cantidad}
                                        </Typography>
                                      </Stack>
                                    ))}
                                  </Stack>
                                </Box>
                              ) : (
                                <Stack direction="row" spacing={4} alignItems="flex-start">
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
                                    >
                                      Producto
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {row.producto || "-"}
                                    </Typography>
                                  </Box>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
                                    >
                                      Cantidad
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {row.cantidad || "-"}
                                    </Typography>
                                  </Box>
                                </Stack>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })
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

        {/* Modal de Nueva Reserva con Calendario */}
        <Dialog open={newReservaModalOpen} onClose={handleCloseNewReservaModal} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            {isEditingReserva ? "Editar Reserva" : "Nueva Reserva"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="delivery-select-label">Delivery (Opcional)</InputLabel>
                <Select
                  labelId="delivery-select-label"
                  label="Delivery (Opcional)"
                  value={selectedDelivery}
                  onChange={(event) => setSelectedDelivery(event.target.value)}
                >
                  <MenuItem value="">
                    <em>Sin delivery</em>
                  </MenuItem>
                  {deliveriesSinReserva.length === 0 ? (
                    <MenuItem disabled>No hay deliveries disponibles sin reserva</MenuItem>
                  ) : (
                    deliveriesSinReserva.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {/* Calendario FullCalendar */}
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box
                  sx={{
                    "& .fc": {
                      fontFamily: "inherit",
                      "& .fc-button-primary": {
                        backgroundColor: brandColors.dayBlue,
                        borderColor: brandColors.dayBlue,
                        color: "white",
                        "&:hover": {
                          backgroundColor: brandColors.oxyBlue,
                          borderColor: brandColors.oxyBlue,
                        },
                        "&:focus": {
                          boxShadow: `0 0 0 0.2rem ${brandColors.dayBlue}40`,
                        },
                      },
                      "& .fc-button-active": {
                        backgroundColor: brandColors.oxyBlue,
                        borderColor: brandColors.oxyBlue,
                      },
                      "& .fc-today-button": {
                        backgroundColor: brandColors.dayBlue,
                        borderColor: brandColors.dayBlue,
                        "&:hover": {
                          backgroundColor: brandColors.oxyBlue,
                          borderColor: brandColors.oxyBlue,
                        },
                      },
                      "& .fc-day-today": {
                        backgroundColor: `${brandColors.dayBlue}15 !important`,
                        "& .fc-daygrid-day-number": {
                          color: brandColors.dayBlue,
                          fontWeight: 700,
                        },
                      },
                      "& .fc-col-header-cell": {
                        backgroundColor: `${brandColors.midnightBlue}08`,
                        color: brandColors.midnightBlue,
                        fontWeight: 600,
                        borderColor: `${brandColors.midnightBlue}16`,
                      },
                      "& .fc-daygrid-day-number": {
                        color: brandColors.midnightBlue,
                        fontWeight: 500,
                      },
                      "& .fc-event": {
                        color: "white",
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        borderWidth: "2px",
                        cursor: "pointer",
                        "& .fc-event-title": {
                          fontWeight: 600,
                        },
                      },
                      "& .fc-event:hover": {
                        opacity: 0.9,
                        transform: "scale(1.02)",
                        transition: "all 0.2s ease",
                      },
                      "& .fc-highlight": {
                        backgroundColor: `${brandColors.dayBlue}20`,
                        borderColor: brandColors.dayBlue,
                        borderWidth: "2px",
                      },
                      "& .fc-timegrid-slot": {
                        "&.fc-timegrid-slot-label": {
                          color: brandColors.slateGray,
                        },
                      },
                      "& .fc-timegrid-col.fc-day-today": {
                        backgroundColor: `${brandColors.dayBlue}08`,
                      },
                    },
                  }}
                >
                  <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    locale={esLocale}
                    selectable={true}
                    selectMirror={true}
                    unselectAuto={false}
                    unselectCancel=""
                    dayMaxEvents={true}
                    weekends={true}
                    selectConstraint={{
                      startTime: "06:00:00",
                      endTime: "17:00:00",
                    }}
                    businessHours={{
                      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                      startTime: "06:00",
                      endTime: "17:00",
                      color: `${brandColors.oceanAqua}20`,
                    }}
                    slotMinTime="06:00:00"
                    slotMaxTime="17:00:00"
                    slotDuration="00:30:00"
                    events={calendarEvents}
                    select={handleSelectSlot}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    height="auto"
                    dayCellContent={(arg) => {
                      // Contar reservas para este día
                      const fechaKey = `${arg.date.getFullYear()}-${String(arg.date.getMonth() + 1).padStart(2, "0")}-${String(arg.date.getDate()).padStart(2, "0")}`;
                      const reservasDelDia = getReservasByDate(fechaKey);
                      const numReservas = reservasDelDia.length;
                      
                      // Verificar si es hoy
                      const hoy = new Date();
                      const hoyKey = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
                      const isToday = fechaKey === hoyKey;
                      
                      if (numReservas > 0) {
                        return {
                          html: `<div style="display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 2px;">
                            <span style="font-weight: ${isToday ? '700' : '500'}; color: ${isToday ? brandColors.dayBlue : brandColors.midnightBlue};">${arg.dayNumberText}</span>
                            <span style="background-color: ${brandColors.sunriseOrange}; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 700; margin-left: 4px;">${numReservas}</span>
                          </div>`
                        };
                      }
                      return {
                        html: `<span style="font-weight: ${isToday ? '700' : '500'}; color: ${isToday ? brandColors.dayBlue : brandColors.midnightBlue};">${arg.dayNumberText}</span>`
                      };
                    }}
                  />
                </Box>
              </Paper>


              {selectedDelivery && (
                <Box sx={{ mt: 1, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                    Información del Delivery seleccionado:
                  </Typography>
                  {(() => {
                    const delivery = deliveriesSinReserva.find((d) => d.value === selectedDelivery)?.delivery;
                    if (!delivery) return null;
                    return (
                      <Stack spacing={0.5}>
                        <Typography variant="body2">
                          <strong>Cliente:</strong> {delivery.customerAddress || delivery.company || "-"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Producto:</strong> {delivery.product || "-"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Cantidad:</strong> {delivery.deliveryQuantity || "-"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Conductor:</strong> {delivery.driver || "-"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Vehículo:</strong> {delivery.plate || "-"}
                        </Typography>
                      </Stack>
                    );
                  })()}
                </Box>
              )}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseNewReservaModal} variant="text" size="small">
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveNewReserva} 
              variant="contained" 
              color="primary" 
              size="small" 
              startIcon={isEditingReserva ? <Edit /> : <Add />}
              disabled={!newFechaReserva || !newHoraReserva}
            >
              {isEditingReserva ? "Editar Reserva" : "Crear Reserva"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Documentos */}
        <Dialog open={documentosModalOpen} onClose={() => setDocumentosModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
            Documentos - {selectedReservaForDocumentos?.id}
          </DialogTitle>
          <DialogContent>
            {selectedReservaForDocumentos && (() => {
              const documentosReserva = documentosRows.filter(
                (doc) => doc.reservaId === selectedReservaForDocumentos.id
              );

              return (
                <Stack spacing={2} sx={{ mt: 1 }}>
                  {documentosReserva.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        No hay documentos asociados a esta reserva
                      </Typography>
                    </Box>
                  ) : (
                    <TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Número</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Destinatario</TableCell>
                            <TableCell align="center">Acción</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {documentosReserva.map((doc) => (
                            <TableRow key={doc.id} hover>
                              <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                                {doc.id}
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Description fontSize="small" sx={{ color: brandColors.oxyBlue }} />
                                  <Typography>{doc.tipo}</Typography>
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ fontFamily: "monospace" }}>{doc.numero}</TableCell>
                              <TableCell>{doc.fecha}</TableCell>
                              <TableCell>{doc.destinatario}</TableCell>
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
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Stack>
              );
            })()}
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDocumentosModalOpen(false)} variant="text" size="small">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal de Chequeo Consolidado */}
        <ConsolidacionModal
          open={consolidacionModalOpen}
          onClose={() => {
            setConsolidacionModalOpen(false);
            setSelectedReservaForConsolidacion(null);
          }}
          reserva={selectedReservaForConsolidacion}
        />

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
      </Stack>
    </Paper>
  );
}

export default ReservasPage;
