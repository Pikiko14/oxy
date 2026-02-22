import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import SignatureCanvas from "react-signature-canvas";
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
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Checklist from "@mui/icons-material/Checklist";
import Save from "@mui/icons-material/Save";
import { brandColors } from "../../theme";

// Componente Modal de Consolidación
function ConsolidacionModal({ open, onClose, reserva }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTab, setActiveTab] = useState(0);
  const firmaOperadorRef = useRef(null);
  
  // Estado inicial del formulario
  const getInitialFormData = () => ({
    // PASO 0 - Pendiente
    Id_Lista: "",
    
    // PASO I - SAC/SAP (solo lectura)
    Run_Conductor: reserva?.conductor || "",
    Destino: "",
    Rut_Empresa_Transporte: "",
    Fecha_llegada: reserva?.fechaReserva || "",
    Hora_Llegada: reserva?.horaReserva || "",
    Hora_Carga: "",
    Patente_Tracto: reserva?.vehiculo || "",
    Patente_Semi_Remolque: "",
    Id_Producto_Cargar: reserva?.producto || "",
    Id_Producto: reserva?.producto || "",
    Densidad_Producto: "",
    Bruto_Maximo: "",
    Tara: "",
    A_Cargar: "",
    Id_Entrega: reserva?.deliveryId?.replace("DEL-", "") || "",
    Turno: "",
    
    // PASO I - Manual
    Registro_Celular: "",
    Presenta_EPP: "",
    Proteccion_Personal: "",
    Estanque_Vacio: "",
    Sin_Sellos: "",
    Estanque_Sellos: "",
    Cantidad_Sellos: "",
    Firma_Conductor: "",
    Estado_Conductor: "",
    Estado_Tracto: "",
    Estado_Semi_Remolque: "",
    Observacion: "",
    Run_Operador_Romana: "",
    Firma_Operador_Romana: "",
    Run_Operador_LLenado: "",
    Turno_Llenado: "",
    
    // PASO II - Manual
    Inspeccion_Previa_1: "",
    Inspeccion_Previa_2: "",
    Inspeccion_Previa_3: "",
    Inspeccion_Previa_4: "",
    Inspeccion_Previa_5: "",
    Inspeccion_Previa_6: "",
    Inspeccion_Previa_7: "",
    Carga_solicita_1: "",
    Carga_solicita_2: "",
    Carga_solicita_3: "",
    Carga_Real_1: "",
    Carga_Real_2: "",
    Carga_Real_3: "",
    Sello_1: "",
    Sello_2: "",
    Sello_3: "",
    Sello_4: "",
    Sello_5: "",
    Inspeccion_Posterior_1: "",
    Inspeccion_Posterior_2: "",
    Inspeccion_Posterior_3: "",
    Inspeccion_Posterior_4: "",
    Inspeccion_Posterior_5: "",
    Observacion_3: "",
    Hora_Inicio_carguio: "",
    Hora_Termino_cargio: "",
    Entrega_Guia: "",
    Certificado_Calidad: "",
    Pesaje_Por_Eje: "",
    HDS: "",
    Contra_Muestra: "",
    
    // PASO III - Manual
    Inspeccion_Cloro_1: "",
    Inspeccion_Cloro_2: "",
    Inspeccion_Cloro_3: "",
    Inspeccion_Cloro_4: "",
    Inspeccion_Cloro_5: "",
    Inspeccion_Cloro_6: "",
    Observacion_4: "",
    Cisternas_Isotank: "",
    Fecha_llenado: "",
    
    // PASO IV - Manual
    Firma_Operador: "",
    Run_Operador: "",
    Firma_Transportista: "",
    Firma_Supervisor: "",
    Run_Supervisor: "",
    
    // DetalleDistribucion
    DetalleDistribucion: [
      { Id_Lista: "", Lugar_Destino: "", Detalle_Envases: "", Comentarios: "" }
    ],
  });

  const [formData, setFormData] = useState(() => getInitialFormData());

  // Resetear el formulario cuando se abre el modal o cambia la reserva
  useEffect(() => {
    if (open) {
      setFormData(getInitialFormData());
      setActiveTab(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reserva?.id]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDistribucionChange = (index, field, value) => {
    setFormData((prev) => {
      const newDistribucion = [...prev.DetalleDistribucion];
      newDistribucion[index] = { ...newDistribucion[index], [field]: value };
      return { ...prev, DetalleDistribucion: newDistribucion };
    });
  };

  const addDistribucionRow = () => {
    setFormData((prev) => ({
      ...prev,
      DetalleDistribucion: [...prev.DetalleDistribucion, { Id_Lista: "", Lugar_Destino: "", Detalle_Envases: "", Comentarios: "" }],
    }));
  };

  const removeDistribucionRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      DetalleDistribucion: prev.DetalleDistribucion.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    console.log("Guardar chequeo consolidado:", formData);
    toast.success(`Chequeo consolidado guardado para reserva ${reserva?.id}`);
    onClose();
  };

  // Componente para campos de solo lectura
  const ReadOnlyField = ({ label, value, helperText }) => (
    <TextField
      size="small"
      label={label}
      helperText={helperText || "\u00A0"}
      value={value || "-"}
      fullWidth
      disabled
      sx={{
        width: "100%",
        "& .MuiInputBase-input": {
          bgcolor: "grey.100",
          color: "text.secondary",
        },
        "& .MuiFormHelperText-root": {
          margin: 0,
          marginTop: "3px",
        },
      }}
    />
  );

  // Componente para campos Boolean (Si/No/NA)
  const BooleanField = ({ label, value, onChange, editable = true, helperText }) => (
    <Box>
      <FormControl fullWidth size="small" disabled={!editable}>
        <FormLabel sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, mb: 0.5, color: editable ? "text.primary" : "text.secondary" }}>
          {label}
        </FormLabel>
        <RadioGroup
          row={!isMobile}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          sx={{ mt: 0.5, flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0.5, sm: 0 } }}
        >
          <FormControlLabel 
            value="SI" 
            control={<Radio size="small" />} 
            label="Sí" 
            disabled={!editable}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          />
          <FormControlLabel 
            value="NO" 
            control={<Radio size="small" />} 
            label="No" 
            disabled={!editable}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          />
          <FormControlLabel 
            value="NA" 
            control={<Radio size="small" />} 
            label="N/A" 
            disabled={!editable}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          />
        </RadioGroup>
      </FormControl>
      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, ml: { xs: 0, sm: 1.75 }, fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );

  // Componente para firma
  const SignatureField = ({ label, value, onChange, helperText }) => {
    const sigPadRef = useRef(null);

    const handleClear = () => {
      if (sigPadRef.current) {
        sigPadRef.current.clear();
        onChange("");
      }
    };

    const handleEnd = () => {
      if (sigPadRef.current && !sigPadRef.current.isEmpty()) {
        const dataURL = sigPadRef.current.toDataURL();
        onChange(dataURL);
      }
    };

    useEffect(() => {
      if (value && sigPadRef.current && sigPadRef.current.isEmpty()) {
        sigPadRef.current.fromDataURL(value);
      }
    }, [value]);

    return (
      <Box>
        <Typography variant="caption" sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, mb: 0.5, display: "block", fontWeight: 500 }}>
          {label}
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "white",
          }}
        >
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
              bgcolor: "white",
            }}
          >
            <SignatureCanvas
              ref={sigPadRef}
              canvasProps={{
                width: 500,
                height: 200,
                className: "signature-canvas",
                style: { width: "100%", height: "200px", touchAction: "none" },
              }}
              onEnd={handleEnd}
              backgroundColor="white"
              penColor="black"
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1, gap: 1 }}>
            <Button size="small" variant="outlined" onClick={handleClear}>
              Limpiar
            </Button>
          </Box>
        </Paper>
        {helperText && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
            {helperText}
          </Typography>
        )}
      </Box>
    );
  };

  // Componente para campos Boolean simples (Si/No)
  const SimpleBooleanField = ({ label, value, onChange, editable = true, helperText }) => (
    <Box>
      <FormControl fullWidth size="small" disabled={!editable}>
        <FormLabel sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" }, mb: 0.5, color: editable ? "text.primary" : "text.secondary" }}>
          {label}
        </FormLabel>
        <RadioGroup
          row={!isMobile}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          sx={{ mt: 0.5, flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0.5, sm: 0 } }}
        >
          <FormControlLabel 
            value="SI" 
            control={<Radio size="small" />} 
            label="Sí" 
            disabled={!editable}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          />
          <FormControlLabel 
            value="NO" 
            control={<Radio size="small" />} 
            label="No" 
            disabled={!editable}
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
          />
        </RadioGroup>
      </FormControl>
      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5, ml: { xs: 0, sm: 1.75 }, fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          m: { xs: 0, sm: 2 },
          maxHeight: { xs: "100vh", sm: "90vh" },
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
        Chequeo Consolidado - {reserva?.id}
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        {reserva && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Información de la Reserva */}
            <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                Información de la Reserva
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                    Cliente
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                    {reserva.cliente || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                    Producto
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                    {reserva.producto || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                    Cantidad
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                    {reserva.cantidad || "-"}
                  </Typography>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5, fontSize: { xs: "0.7rem", sm: "0.75rem" } }}>
                    Fecha y Hora
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                    {reserva.fechaReserva} {reserva.horaReserva}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            <Divider />

            {/* Tabs para los diferentes pasos */}
            <Paper variant="outlined">
              <Tabs 
                value={activeTab} 
                onChange={(_, newValue) => setActiveTab(newValue)} 
                sx={{ borderBottom: 1, borderColor: "divider" }}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab label="PASO I - Información Transporte" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, minWidth: { xs: 120, sm: 160 } }} />
                <Tab label="PASO II - Carga" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, minWidth: { xs: 120, sm: 160 } }} />
                <Tab label="PASO III - Inspecciones" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, minWidth: { xs: 120, sm: 160 } }} />
                <Tab label="PASO IV - Operador" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, minWidth: { xs: 120, sm: 160 } }} />
                <Tab label="PASO V - Detalle Distribución" sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, minWidth: { xs: 120, sm: 160 } }} />
              </Tabs>

              <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                {/* PASO I */}
                {activeTab === 0 && (
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.midnightBlue, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                      PASO I - Información Transporte
                    </Typography>

                    {/* Sección: Identificación */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                        Identificación
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            size="small"
                            label="Id Lista"
                            helperText="Número identificador de la lista de chequeo"
                            type="number"
                            value={formData.Id_Lista}
                            onChange={(e) => handleChange("Id_Lista", e.target.value)}
                            fullWidth
                            sx={{ width: "100%" }}
                            placeholder="-"
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider />

                    {/* Sección: Información del Conductor y Vehículo */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                        Información del Conductor y Vehículo
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <ReadOnlyField label="Run Conductor" helperText="DNI del conductor" value={formData.Run_Conductor} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <ReadOnlyField label="Destino" helperText="Destino de la mercancía" value={formData.Destino} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <ReadOnlyField label="RUT Empresa Transporte" helperText="" value={formData.Rut_Empresa_Transporte} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <ReadOnlyField label="Fecha Llegada" helperText="Fecha de inicio" value={formData.Fecha_llegada} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <ReadOnlyField label="Hora Llegada" helperText="Hora presentación del conductor" value={formData.Hora_Llegada} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            size="small"
                            label="Hora Carga"
                            helperText="Hr Entrega"
                            type="datetime-local"
                            value={formData.Hora_Carga}
                            onChange={(e) => handleChange("Hora_Carga", e.target.value)}
                            fullWidth
                            sx={{ width: "100%" }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <ReadOnlyField label="Patente Tracto" helperText="Patente del vehículo" value={formData.Patente_Tracto} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <ReadOnlyField label="Patente Semi Remolque" helperText="" value={formData.Patente_Semi_Remolque} />
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                )}

                {/* PASO II */}
                {activeTab === 1 && (
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.midnightBlue, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                      PASO II - Carga
                    </Typography>

                    {/* Sección: Inspecciones Previas */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                        Inspecciones Previas
                      </Typography>
                      <Grid container spacing={2}>
                        {/* Campo de solo lectura (SAC) */}
                        <Grid item xs={12} sm={6} md={4}>
                          <SimpleBooleanField
                            label="Registro Celular"
                            helperText="Conductor tiene registrado en su celular N° de contacto ante emergencia en carretera"
                            value={formData.Registro_Celular}
                            onChange={(value) => handleChange("Registro_Celular", value)}
                            editable={false}
                          />
                        </Grid>

                        {/* Campos manuales editables */}
                        <Grid item xs={12} sm={6} md={4}>
                          <BooleanField
                            label="Presenta EPP"
                            helperText="Presenta EPP básico para ingresar a planta"
                            value={formData.Presenta_EPP}
                            onChange={(value) => handleChange("Presenta_EPP", value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <BooleanField
                            label="Protección Personal"
                            helperText="Dispone de elementos de protección personal específicos que se requieren en la zona de carguío"
                            value={formData.Proteccion_Personal}
                            onChange={(value) => handleChange("Proteccion_Personal", value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <BooleanField
                            label="Estanque Vacío"
                            helperText="Estanque vacío y sin producto anterior"
                            value={formData.Estanque_Vacio}
                            onChange={(value) => handleChange("Estanque_Vacio", value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <BooleanField
                            label="Sin Sellos"
                            helperText="Sin sellos plásticos en zona superior del estanque (escotillas) y en válvulas inferiores de descarga"
                            value={formData.Sin_Sellos}
                            onChange={(value) => handleChange("Sin_Sellos", value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <BooleanField
                            label="Estanque Sellos"
                            helperText="Estanque cuenta con argollas y/o sistema que permite instalar en forma correcta los sellos de seguridad"
                            value={formData.Estanque_Sellos}
                            onChange={(value) => handleChange("Estanque_Sellos", value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            size="small"
                            label="Cantidad Sellos"
                            helperText="Cantidad sellos a utilizar en semirremolque"
                            type="number"
                            value={formData.Cantidad_Sellos}
                            onChange={(e) => handleChange("Cantidad_Sellos", e.target.value)}
                            fullWidth
                            sx={{ width: "100%" }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <SignatureField
                            label="Firma Conductor"
                            helperText="Firme con el mouse o dedo en el área de arriba"
                            value={formData.Firma_Conductor}
                            onChange={(value) => handleChange("Firma_Conductor", value)}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider />

                    {/* Sección: Estados y Turnos */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                        Estados y Turnos
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          flexWrap: "wrap",
                          gap: 2,
                          width: "100%",
                        }}
                      >
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                          <FormControl fullWidth size="small">
                            <InputLabel id="estado-conductor-label" shrink>Estado Conductor</InputLabel>
                            <Select
                              labelId="estado-conductor-label"
                              value={formData.Estado_Conductor || ""}
                              onChange={(e) => handleChange("Estado_Conductor", e.target.value)}
                              label="Estado Conductor"
                              displayEmpty
                            >
                              <MenuItem value="">
                                <em>Seleccionar</em>
                              </MenuItem>
                              <MenuItem value="APROBADO">Aprobado</MenuItem>
                              <MenuItem value="conREPAROS">Con Reparos</MenuItem>
                              <MenuItem value="RECHAZADO">Rechazado</MenuItem>
                              <MenuItem value="NA">N/A</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                          <FormControl fullWidth size="small">
                            <InputLabel id="estado-tracto-label" shrink>Estado Tracto</InputLabel>
                            <Select
                              labelId="estado-tracto-label"
                              value={formData.Estado_Tracto || ""}
                              onChange={(e) => handleChange("Estado_Tracto", e.target.value)}
                              label="Estado Tracto"
                              displayEmpty
                            >
                              <MenuItem value="">
                                <em>Seleccionar</em>
                              </MenuItem>
                              <MenuItem value="APROBADO">Aprobado</MenuItem>
                              <MenuItem value="conREPAROS">Con Reparos</MenuItem>
                              <MenuItem value="RECHAZADO">Rechazado</MenuItem>
                              <MenuItem value="NA">N/A</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                          <FormControl fullWidth size="small">
                            <InputLabel id="estado-semi-label" shrink>Estado Semi Remolque</InputLabel>
                            <Select
                              labelId="estado-semi-label"
                              value={formData.Estado_Semi_Remolque || ""}
                              onChange={(e) => handleChange("Estado_Semi_Remolque", e.target.value)}
                              label="Estado Semi Remolque"
                              displayEmpty
                            >
                              <MenuItem value="">
                                <em>Seleccionar</em>
                              </MenuItem>
                              <MenuItem value="APROBADO">Aprobado</MenuItem>
                              <MenuItem value="conREPAROS">Con Reparos</MenuItem>
                              <MenuItem value="RECHAZADO">Rechazado</MenuItem>
                              <MenuItem value="NA">N/A</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                          <FormControl fullWidth size="small">
                            <InputLabel id="turno-label" shrink>Turno</InputLabel>
                            <Select
                              labelId="turno-label"
                              value={formData.Turno || ""}
                              onChange={(e) => handleChange("Turno", e.target.value)}
                              label="Turno"
                              displayEmpty
                            >
                              <MenuItem value="">
                                <em>Seleccionar</em>
                              </MenuItem>
                              <MenuItem value="DIA">Día</MenuItem>
                              <MenuItem value="TARDE">Tarde</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </Box>
                    </Box>

                    <Divider />

                      {/* Sección: Información de Producto y Pesaje */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Información de Producto y Pesaje
                        </Typography>
                        {/* Primera fila: 4 campos */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <ReadOnlyField 
                              label="Id Producto" 
                              helperText="Podría ser lo mismo que Id_Producto_Cargar" 
                              value={formData.Id_Producto} 
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <ReadOnlyField 
                              label="Densidad Producto" 
                              helperText="Densidad del producto" 
                              value={formData.Densidad_Producto || ""} 
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <ReadOnlyField 
                              label="Bruto Máximo" 
                              helperText="Pesaje equipo transporte (Kilos)" 
                              value={formData.Bruto_Maximo || ""} 
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <ReadOnlyField 
                              label="Tara" 
                              helperText="Pesaje equipo transporte (Kilos)" 
                              value={formData.Tara || ""} 
                            />
                          </Box>
                        </Box>
                        {/* Segunda fila: 2 campos */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(50% - 8px)" }, minWidth: 0 }}>
                            <ReadOnlyField 
                              label="A Cargar" 
                              helperText="Pesaje equipo transporte (Kilos)" 
                              value={formData.A_Cargar || ""} 
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(50% - 8px)" }, minWidth: 0 }}>
                            <ReadOnlyField 
                              label="Id Entrega" 
                              helperText="N° Delivery. Valor único asociado a la orden. Cada orden puede tener varias entregas" 
                              value={formData.Id_Entrega || ""} 
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Documentación */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Documentación
                        </Typography>
                        {/* Primera fila: 3 campos */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <SimpleBooleanField
                              label="Entrega Guía"
                              helperText="Entrega de documentación. Se completa al momento del despacho. Guía de despacho"
                              value={formData.Entrega_Guia}
                              onChange={(value) => handleChange("Entrega_Guia", value)}
                              editable={true}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <SimpleBooleanField
                              label="Certificado Calidad"
                              helperText="Entrega de documentación. Se completa al momento del despacho. Certificado de calidad"
                              value={formData.Certificado_Calidad}
                              onChange={(value) => handleChange("Certificado_Calidad", value)}
                              editable={true}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <SimpleBooleanField
                              label="Pesaje Por Eje"
                              helperText="Entrega de documentación. Se completa al momento del despacho. Pesaje por Eje"
                              value={formData.Pesaje_Por_Eje}
                              onChange={(value) => handleChange("Pesaje_Por_Eje", value)}
                              editable={true}
                            />
                          </Box>
                        </Box>
                        {/* Segunda fila: 2 campos */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(50% - 8px)" }, minWidth: 0 }}>
                            <SimpleBooleanField
                              label="HDS"
                              helperText="Entrega de documentación. Se completa al momento del despacho. Hoja Dato Seguridad"
                              value={formData.HDS}
                              onChange={(value) => handleChange("HDS", value)}
                              editable={true}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(50% - 8px)" }, minWidth: 0 }}>
                            <SimpleBooleanField
                              label="Contra Muestra"
                              helperText="Entrega de documentación. Se completa al momento del despacho. Contra muestra"
                              value={formData.Contra_Muestra}
                              onChange={(value) => handleChange("Contra_Muestra", value)}
                              editable={true}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Operadores */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Operadores
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <ReadOnlyField 
                              label="Run Operador Romana" 
                              helperText="Run del operador de Romana" 
                              value={formData.Run_Operador_Romana || ""} 
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Firma Operador Romana (URL)"
                              helperText="Imagen firma del operador para corroborar datos PASO II"
                              value={formData.Firma_Operador_Romana}
                              onChange={(e) => handleChange("Firma_Operador_Romana", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="URL de la imagen de la firma"
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <ReadOnlyField 
                              label="Run Operador Llenado" 
                              helperText="Run del operador de llenado" 
                              value={formData.Run_Operador_LLenado || ""} 
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <FormControl fullWidth size="small">
                              <InputLabel id="turno-llenado-label" shrink>Turno Llenado</InputLabel>
                              <Select
                                labelId="turno-llenado-label"
                                value={formData.Turno_Llenado || ""}
                                onChange={(e) => handleChange("Turno_Llenado", e.target.value)}
                                label="Turno Llenado"
                                displayEmpty
                              >
                                <MenuItem value="">
                                  <em>Seleccionar</em>
                                </MenuItem>
                                <MenuItem value="DIA">Día</MenuItem>
                                <MenuItem value="TARDE">Tarde</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Inspecciones Previas */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Inspecciones Previas
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Previa 1"
                              helperText="Se encuentra cisterna centrada al telescópico de carga"
                              value={formData.Inspeccion_Previa_1}
                              onChange={(value) => handleChange("Inspeccion_Previa_1", value)}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Previa 2"
                              helperText="Conductor se presenta con tienda de tela antiácida"
                              value={formData.Inspeccion_Previa_2}
                              onChange={(value) => handleChange("Inspeccion_Previa_2", value)}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Observaciones */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Observaciones
                        </Typography>
                        <TextField
                          size="small"
                          label="Observación"
                          helperText="Observaciones generales"
                          multiline
                          rows={3}
                          value={formData.Observacion}
                          onChange={(e) => handleChange("Observacion", e.target.value)}
                          fullWidth
                          sx={{ width: "100%" }}
                          placeholder="Ingrese observaciones..."
                        />
                      </Box>
                  </Stack>
                )}

                {/* PASO III */}
                {activeTab === 2 && (
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.midnightBlue, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                      PASO III - Inspecciones
                    </Typography>

                    {/* Sección: Inspecciones Previas */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                        Inspecciones Previas
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          flexWrap: "wrap",
                          gap: 2,
                          width: "100%",
                        }}
                      >
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                          <BooleanField
                            label="Inspección Previa 3"
                            helperText="Cuñas para inmovilización del camión"
                            value={formData.Inspeccion_Previa_3}
                            onChange={(value) => handleChange("Inspeccion_Previa_3", value)}
                          />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                          <BooleanField
                            label="Inspección Previa 4"
                            helperText="Verifique que camión cisterna está libre de residuos"
                            value={formData.Inspeccion_Previa_4}
                            onChange={(value) => handleChange("Inspeccion_Previa_4", value)}
                          />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                          <BooleanField
                            label="Inspección Previa 5"
                            helperText="Letrero de carga cumple"
                            value={formData.Inspeccion_Previa_5}
                            onChange={(value) => handleChange("Inspeccion_Previa_5", value)}
                          />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                          <BooleanField
                            label="Inspección Previa 6"
                            helperText="Inspección visual del camión"
                            value={formData.Inspeccion_Previa_6}
                            onChange={(value) => handleChange("Inspeccion_Previa_6", value)}
                          />
                        </Box>
                        <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                          <BooleanField
                            label="Inspección Previa 7"
                            helperText="Chequear cierres válvulas estanque de camión"
                            value={formData.Inspeccion_Previa_7}
                            onChange={(value) => handleChange("Inspeccion_Previa_7", value)}
                          />
                        </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Carga Solicitada */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Carga Solicitada
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Carga Solicitada 1"
                              helperText="Conductor debe indicar cantidad de kilos a cargar por compartimento"
                              type="number"
                              value={formData.Carga_solicita_1}
                              onChange={(e) => handleChange("Carga_solicita_1", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Kilos"
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Carga Solicitada 2"
                              helperText="Conductor debe indicar cantidad de kilos a cargar por compartimento"
                              type="number"
                              value={formData.Carga_solicita_2}
                              onChange={(e) => handleChange("Carga_solicita_2", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Kilos"
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Carga Solicitada 3"
                              helperText="Conductor debe indicar cantidad de kilos a cargar por compartimento"
                              type="number"
                              value={formData.Carga_solicita_3}
                              onChange={(e) => handleChange("Carga_solicita_3", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Kilos"
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Carga Real */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Carga Real
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Carga Real 1"
                              helperText="Cantidad real de kilos cargados por compartimento"
                              type="number"
                              value={formData.Carga_Real_1}
                              onChange={(e) => handleChange("Carga_Real_1", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Kilos"
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Carga Real 2"
                              helperText="Cantidad real de kilos cargados por compartimento"
                              type="number"
                              value={formData.Carga_Real_2}
                              onChange={(e) => handleChange("Carga_Real_2", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Kilos"
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Carga Real 3"
                              helperText="Cantidad real de kilos cargados por compartimento"
                              type="number"
                              value={formData.Carga_Real_3}
                              onChange={(e) => handleChange("Carga_Real_3", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Kilos"
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Sellos */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Sellos
                        </Typography>
                        {/* Primera fila: 3 campos */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Sello 1"
                              helperText="Operador de llenado camiones debe registrar N° de sellos en esquema del camión (últimos tres dígitos del sello)"
                              type="number"
                              value={formData.Sello_1}
                              onChange={(e) => handleChange("Sello_1", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Últimos 3 dígitos"
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Sello 2"
                              helperText="Operador de llenado camiones debe registrar N° de sellos en esquema del camión (últimos tres dígitos del sello)"
                              type="number"
                              value={formData.Sello_2}
                              onChange={(e) => handleChange("Sello_2", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Últimos 3 dígitos"
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Sello 3"
                              helperText="Operador de llenado camiones debe registrar N° de sellos en esquema del camión (últimos tres dígitos del sello)"
                              type="number"
                              value={formData.Sello_3}
                              onChange={(e) => handleChange("Sello_3", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Últimos 3 dígitos"
                            />
                          </Box>
                        </Box>
                        {/* Segunda fila: 2 campos */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(50% - 8px)" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Sello 4"
                              helperText="Operador de llenado camiones debe registrar N° de sellos en esquema del camión (últimos tres dígitos del sello)"
                              type="number"
                              value={formData.Sello_4}
                              onChange={(e) => handleChange("Sello_4", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Últimos 3 dígitos"
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(50% - 8px)" }, minWidth: 0 }}>
                            <TextField
                              size="small"
                              label="Sello 5"
                              helperText="Operador de llenado camiones debe registrar N° de sellos en esquema del camión (últimos tres dígitos del sello)"
                              type="number"
                              value={formData.Sello_5}
                              onChange={(e) => handleChange("Sello_5", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Últimos 3 dígitos"
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Inspecciones Posteriores */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Inspecciones Posteriores
                        </Typography>
                        {/* Primera fila: 3 campos */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Posterior 1"
                              helperText="Enpaquetaduras bien instaladas"
                              value={formData.Inspeccion_Posterior_1}
                              onChange={(value) => handleChange("Inspeccion_Posterior_1", value)}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Posterior 2"
                              helperText="Escotillas y válvulas herméticamente cerradas"
                              value={formData.Inspeccion_Posterior_2}
                              onChange={(value) => handleChange("Inspeccion_Posterior_2", value)}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Posterior 3"
                              helperText="El estanque cuenta con argollas y/o sistema que permiten instalar en forma correcta los sellos"
                              value={formData.Inspeccion_Posterior_3}
                              onChange={(value) => handleChange("Inspeccion_Posterior_3", value)}
                            />
                          </Box>
                        </Box>
                        {/* Segunda fila: 2 campos */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(50% - 8px)" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Posterior 4"
                              helperText="Se instalan sellos de seguridad en todas las válvulas e identificadas en esquema del estanque"
                              value={formData.Inspeccion_Posterior_4}
                              onChange={(value) => handleChange("Inspeccion_Posterior_4", value)}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 calc(50% - 8px)" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Posterior 5"
                              helperText="Luego de la carga se observa sin presencia de goteo y/o fuga de producto"
                              value={formData.Inspeccion_Posterior_5}
                              onChange={(value) => handleChange("Inspeccion_Posterior_5", value)}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Observaciones */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Observaciones
                        </Typography>
                        <TextField
                          size="small"
                          label="Observación"
                          helperText="Observaciones adicionales"
                          multiline
                          rows={3}
                          value={formData.Observacion_3}
                          onChange={(e) => handleChange("Observacion_3", e.target.value)}
                          fullWidth
                          sx={{ width: "100%" }}
                          placeholder="Ingrese observaciones..."
                        />
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Horas */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Horas
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              size="small"
                              label="Hora Inicio Carguío"
                              helperText="Hora de inicio del proceso de carguío"
                              type="datetime-local"
                              value={formData.Hora_Inicio_carguio}
                              onChange={(e) => handleChange("Hora_Inicio_carguio", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              size="small"
                              label="Hora Término Carguío"
                              helperText="Hora de término del proceso de carguío"
                              type="datetime-local"
                              value={formData.Hora_Termino_cargio}
                              onChange={(e) => handleChange("Hora_Termino_cargio", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Inspección Cloro */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Inspección Cloro
                        </Typography>
                        {/* Primera fila: 3 campos */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Cloro 1"
                              helperText="Cuñas para inmovilización del camión"
                              value={formData.Inspeccion_Cloro_1}
                              onChange={(value) => handleChange("Inspeccion_Cloro_1", value)}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Cloro 2"
                              helperText="Chequear con gas amoniaco"
                              value={formData.Inspeccion_Cloro_2}
                              onChange={(value) => handleChange("Inspeccion_Cloro_2", value)}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Cloro 3"
                              helperText="Realizar inspección visual"
                              value={formData.Inspeccion_Cloro_3}
                              onChange={(value) => handleChange("Inspeccion_Cloro_3", value)}
                            />
                          </Box>
                        </Box>
                        {/* Segunda fila: 3 campos */}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 2,
                            width: "100%",
                          }}
                        >
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Cloro 4"
                              helperText="Envase cuenta con tapa gorro"
                              value={formData.Inspeccion_Cloro_4}
                              onChange={(value) => handleChange("Inspeccion_Cloro_4", value)}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Cloro 5"
                              helperText="Todos los envases se encuentran bien amarrados y bien estibados"
                              value={formData.Inspeccion_Cloro_5}
                              onChange={(value) => handleChange("Inspeccion_Cloro_5", value)}
                            />
                          </Box>
                          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 8px)", md: "1 1 0" }, minWidth: 0 }}>
                            <BooleanField
                              label="Inspección Cloro 6"
                              helperText="Camión cuenta con KIT de emergencia según tipo de envase"
                              value={formData.Inspeccion_Cloro_6}
                              onChange={(value) => handleChange("Inspeccion_Cloro_6", value)}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Observaciones */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Observaciones
                        </Typography>
                        <TextField
                          size="small"
                          label="Observación 4"
                          helperText="Observaciones adicionales"
                          multiline
                          rows={3}
                          value={formData.Observacion_4}
                          onChange={(e) => handleChange("Observacion_4", e.target.value)}
                          fullWidth
                          sx={{ width: "100%" }}
                          placeholder="Ingrese observaciones..."
                        />
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      {/* Sección: Información Final */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: brandColors.midnightBlue, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                          Información Final
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              size="small"
                              label="Cisternas Isotank"
                              helperText="Número de cisternas isotank a despachar"
                              type="number"
                              value={formData.Cisternas_Isotank}
                              onChange={(e) => handleChange("Cisternas_Isotank", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              placeholder="Cantidad"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              size="small"
                              label="Fecha Llenado"
                              helperText="Fecha llenado equipo"
                              type="datetime-local"
                              value={formData.Fecha_llenado}
                              onChange={(e) => handleChange("Fecha_llenado", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <SignatureField
                              label="Firma Operador"
                              helperText="Firme con el mouse o dedo en el área de arriba"
                              value={formData.Firma_Operador}
                              onChange={(value) => handleChange("Firma_Operador", value)}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                  </Stack>
                )}

                {/* PASO IV */}
                {activeTab === 3 && (
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.midnightBlue, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                      PASO IV - Operador
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <SignatureField
                          label="Firma Transportista"
                          helperText="Firme con el mouse o dedo en el área de arriba"
                          value={formData.Firma_Transportista}
                          onChange={(value) => handleChange("Firma_Transportista", value)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <SignatureField
                          label="Firma Supervisor"
                          helperText="Firme con el mouse o dedo en el área de arriba"
                          value={formData.Firma_Supervisor}
                          onChange={(value) => handleChange("Firma_Supervisor", value)}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          size="small"
                          label="Run Supervisor"
                          helperText="Run del supervisor"
                          value={formData.Run_Supervisor}
                          onChange={(e) => handleChange("Run_Supervisor", e.target.value)}
                          fullWidth
                          sx={{ width: "100%" }}
                          placeholder="Ingrese RUN"
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                )}

                {/* PASO V - Detalle Distribución */}
                {activeTab === 4 && (
                  <Stack spacing={3}>
                    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: brandColors.midnightBlue, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                        PASO V - Detalle Distribución
                      </Typography>
                      <Button variant="outlined" size="small" onClick={addDistribucionRow} sx={{ width: { xs: "100%", sm: "auto" } }}>
                        Agregar Fila
                      </Button>
                    </Box>

                    <Stack spacing={2}>
                      {formData.DetalleDistribucion.map((item, index) => (
                        <Paper key={index} variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
                          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, mb: 2, gap: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
                              Distribución {index + 1}
                            </Typography>
                            {formData.DetalleDistribucion.length > 1 && (
                              <Button
                                variant="text"
                                color="error"
                                size="small"
                                onClick={() => removeDistribucionRow(index)}
                                sx={{ width: { xs: "100%", sm: "auto" } }}
                              >
                                Eliminar
                              </Button>
                            )}
                          </Box>
                          {/* Primera fila: 3 campos */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              flexWrap: "wrap",
                              gap: 2,
                              width: "100%",
                              mb: 2,
                            }}
                          >
                            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(33.333% - 11px)", md: "1 1 0" }, minWidth: 0 }}>
                              <ReadOnlyField
                                label="Id Lista"
                                helperText="Número identificador de la lista de chequeo"
                                value={item.Id_Lista || formData.Id_Lista || ""}
                              />
                            </Box>
                            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(33.333% - 11px)", md: "1 1 0" }, minWidth: 0 }}>
                              <TextField
                                size="small"
                                label="Lugar Destino"
                                helperText="Lugar destino según cliente"
                                value={item.Lugar_Destino}
                                onChange={(e) => handleDistribucionChange(index, "Lugar_Destino", e.target.value)}
                                fullWidth
                                sx={{ width: "100%" }}
                                placeholder="Ingrese lugar destino"
                              />
                            </Box>
                            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 calc(33.333% - 11px)", md: "1 1 0" }, minWidth: 0 }}>
                              <TextField
                                size="small"
                                label="Detalle Envases"
                                helperText="Detalle envases por lugar destino"
                                value={item.Detalle_Envases}
                                onChange={(e) => handleDistribucionChange(index, "Detalle_Envases", e.target.value)}
                                fullWidth
                                sx={{ width: "100%" }}
                                placeholder="Ingrese detalle de envases"
                              />
                            </Box>
                          </Box>
                          {/* Segunda fila: Comentarios a todo el ancho */}
                          <Box sx={{ width: "100%" }}>
                            <TextField
                              size="small"
                              label="Comentarios"
                              helperText="Comentarios adicionales"
                              value={item.Comentarios}
                              onChange={(e) => handleDistribucionChange(index, "Comentarios", e.target.value)}
                              fullWidth
                              sx={{ width: "100%" }}
                              multiline
                              rows={3}
                              placeholder="Ingrese comentarios"
                            />
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  </Stack>
                )}
              </Box>
            </Paper>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: { xs: 1, sm: 2, md: 3 }, pb: 2, flexDirection: { xs: "column-reverse", sm: "row" }, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="text" 
          size="small"
          fullWidth={isMobile}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Save />}
          fullWidth={isMobile}
        >
          Guardar Chequeo Consolidado
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConsolidacionModal;
