import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Stepper,
  Step,
  StepLabel,
  TextField,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ArrowForward from "@mui/icons-material/ArrowForward";

const steps = [
  "Información Básica",
  "Información del Envío",
  "Información del Conductor",
  "Información del Vehículo",
  "Información de Carga",
  "Horarios",
];

const initialFormData = {
  // Paso 1: Información básica
  company: "",
  driver: "",
  movement: "CARGA",
  product: "",
  plate: "",
  status: "En Atención",
  region: "Centro",
  // Paso 2: Información del envío
  origin: "",
  originAddress: "",
  destination: "",
  destinationAddress: "",
  distance: "",
  departureDate: "",
  departureTime: "",
  eta: "",
  etaTime: "",
  // Paso 3: Información del conductor
  driverCode: "",
  driverPhone: "",
  driverExperience: "",
  driverLicense: "",
  driverRest: "",
  // Paso 4: Información del vehículo
  vehicleType: "",
  vehicleModel: "",
  vehicleYear: "",
  vehicleCapacity: "",
  vehicleMaintenance: "",
  vehicleTechnicalStatus: "",
  // Paso 5: Información de carga
  loadQuantity: "",
  loadUnit: "kg",
  loadLot: "",
  loadProductionDate: "",
  // Paso 6: Horarios
  arrival: "",
  attention: "",
  departure: "",
  durationMin: "",
};

function DespachoFormModal({ open, onClose, initialData = null, onSave }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  // Verificar si realmente hay datos para editar (tiene actNumber o algún campo clave)
  const isEditing = !!(initialData && (initialData.actNumber || initialData.company || initialData.driver));

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Modo edición: precargar datos
        setFormData({
          company: initialData.company || "",
          driver: initialData.driver || "",
          movement: initialData.movement || "CARGA",
          product: initialData.product || "",
          plate: initialData.plate || "",
          status: initialData.status || "En Atención",
          region: initialData.region || "Centro",
          origin: initialData.origin || "",
          originAddress: initialData.originAddress || "",
          destination: initialData.destination || "",
          destinationAddress: initialData.destinationAddress || "",
          distance: initialData.distance || "",
          departureDate: initialData.departureDate || "",
          departureTime: initialData.departureTime || "",
          eta: initialData.eta || "",
          etaTime: initialData.etaTime || "",
          driverCode: initialData.driverCode || "",
          driverPhone: initialData.driverPhone || "",
          driverExperience: initialData.driverExperience || "",
          driverLicense: initialData.driverLicense || "",
          driverRest: initialData.driverRest || "",
          vehicleType: initialData.vehicleType || "",
          vehicleModel: initialData.vehicleModel || "",
          vehicleYear: initialData.vehicleYear || "",
          vehicleCapacity: initialData.vehicleCapacity || "",
          vehicleMaintenance: initialData.vehicleMaintenance || "",
          vehicleTechnicalStatus: initialData.vehicleTechnicalStatus || "",
          loadQuantity: initialData.loadQuantity || "",
          loadUnit: initialData.loadUnit || "kg",
          loadLot: initialData.loadLot || "",
          loadProductionDate: initialData.loadProductionDate || "",
          arrival: initialData.arrival || "",
          attention: initialData.attention || "",
          departure: initialData.departure || "",
          durationMin: initialData.durationMin || "",
        });
      } else {
        // Modo creación: resetear
        setFormData(initialFormData);
      }
      setActiveStep(0);
    }
  }, [open, initialData]);

  const handleClose = () => {
    setFormData(initialFormData);
    setActiveStep(0);
    onClose();
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.company || !formData.driver || !formData.product || !formData.plate || !formData.arrival) {
      return;
    }

    const dispatchData = {
      ...formData,
      company: formData.company.toUpperCase(),
      driver: formData.driver.toUpperCase(),
      product: formData.product.toUpperCase(),
      plate: formData.plate.toUpperCase(),
      attention: formData.attention || "-",
      departure: formData.departure || "-",
      durationMin: Number.parseInt(formData.durationMin, 10) || 0,
    };

    onSave(dispatchData, initialData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ px: { xs: 2.8, sm: 3.2 }, pt: 2.2, pb: 1.1 }}>
        {isEditing ? "Editar Delivery" : "Agregar Delivery"}
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2.8, sm: 3.2 }, pt: 1.2, pb: 2.4 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3, mt: 1 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Divider sx={{ mb: 2.4 }} />

        {activeStep === 0 && (
          <Stack spacing={1.8}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
              <TextField
                label="Empresa"
                value={formData.company}
                onChange={(event) => handleChange("company", event.target.value)}
                size="small"
                fullWidth
                required
              />
              <TextField
                label="Conductor"
                value={formData.driver}
                onChange={(event) => handleChange("driver", event.target.value)}
                size="small"
                fullWidth
                required
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
              <FormControl fullWidth size="small">
                <InputLabel id="movement-label">Movimiento</InputLabel>
                <Select
                  labelId="movement-label"
                  label="Movimiento"
                  value={formData.movement}
                  onChange={(event) => handleChange("movement", event.target.value)}
                >
                  <MenuItem value="CARGA">CARGA</MenuItem>
                  <MenuItem value="DESCARGA">DESCARGA</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" required>
                <InputLabel id="product-label">Producto</InputLabel>
                <Select
                  labelId="product-label"
                  label="Producto"
                  value={formData.product}
                  onChange={(event) => handleChange("product", event.target.value)}
                >
                  <MenuItem value="SODA CAUSTICA">SODA CAUSTICA</MenuItem>
                  <MenuItem value="HIPOCLORITO DE SODIO">HIPOCLORITO DE SODIO</MenuItem>
                  <MenuItem value="A CLORHIDRICO">A CLORHIDRICO</MenuItem>
                  <MenuItem value="CLORURO FERRICO">CLORURO FERRICO</MenuItem>
                  <MenuItem value="CALCIO TUR">CALCIO TUR</MenuItem>
                  <MenuItem value="CALCIO REFI">CALCIO REFI</MenuItem>
                  <MenuItem value="A SULFURICO DILUIDO">A SULFURICO DILUIDO</MenuItem>
                  <MenuItem value="CLORO">CLORO</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Patente"
                value={formData.plate}
                onChange={(event) => handleChange("plate", event.target.value)}
                size="small"
                fullWidth
                required
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-label">Estado</InputLabel>
                <Select
                  labelId="status-label"
                  label="Estado"
                  value={formData.status}
                  onChange={(event) => handleChange("status", event.target.value)}
                >
                  <MenuItem value="En Atención">En Atención</MenuItem>
                  <MenuItem value="Finalizado">Finalizado</MenuItem>
                  <MenuItem value="Pendiente">Pendiente</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="region-label">Región</InputLabel>
                <Select
                  labelId="region-label"
                  label="Región"
                  value={formData.region}
                  onChange={(event) => handleChange("region", event.target.value)}
                >
                  <MenuItem value="Norte">Norte</MenuItem>
                  <MenuItem value="Centro">Centro</MenuItem>
                  <MenuItem value="Sur">Sur</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={1.8}>
            <TextField
              label="Origen"
              value={formData.origin}
              onChange={(event) => handleChange("origin", event.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Dirección de Origen"
              value={formData.originAddress}
              onChange={(event) => handleChange("originAddress", event.target.value)}
              size="small"
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Destino"
              value={formData.destination}
              onChange={(event) => handleChange("destination", event.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Dirección de Destino"
              value={formData.destinationAddress}
              onChange={(event) => handleChange("destinationAddress", event.target.value)}
              size="small"
              fullWidth
              multiline
              rows={2}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
              <TextField
                label="Distancia"
                value={formData.distance}
                onChange={(event) => handleChange("distance", event.target.value)}
                size="small"
                fullWidth
                placeholder="Ej: 18.5 km"
              />
              <TextField
                label="Fecha de Salida"
                type="date"
                value={formData.departureDate}
                onChange={(event) => handleChange("departureDate", event.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
              <TextField
                label="Hora de Salida"
                type="time"
                value={formData.departureTime}
                onChange={(event) => handleChange("departureTime", event.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
              <TextField
                label="Fecha ETA"
                type="date"
                value={formData.eta}
                onChange={(event) => handleChange("eta", event.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
              <TextField
                label="Hora ETA"
                type="time"
                value={formData.etaTime}
                onChange={(event) => handleChange("etaTime", event.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
            </Stack>
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={1.8}>
            <TextField
              label="Código del Conductor"
              value={formData.driverCode}
              onChange={(event) => handleChange("driverCode", event.target.value)}
              size="small"
              fullWidth
              placeholder="Ej: DRV-2023-0087"
            />
            <TextField
              label="Teléfono del Conductor"
              value={formData.driverPhone}
              onChange={(event) => handleChange("driverPhone", event.target.value)}
              size="small"
              fullWidth
              placeholder="Ej: +56 9 8765 4321"
            />
            <TextField
              label="Experiencia"
              value={formData.driverExperience}
              onChange={(event) => handleChange("driverExperience", event.target.value)}
              size="small"
              fullWidth
              placeholder="Ej: 5 años"
            />
            <TextField
              label="Licencia"
              value={formData.driverLicense}
              onChange={(event) => handleChange("driverLicense", event.target.value)}
              size="small"
              fullWidth
              placeholder="Ej: Clase A4 - Vigente"
            />
            <TextField
              label="Último Descanso"
              value={formData.driverRest}
              onChange={(event) => handleChange("driverRest", event.target.value)}
              size="small"
              fullWidth
              placeholder="Ej: Hoy, 06:00 AM (2 horas)"
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack spacing={1.8}>
            <TextField
              label="Tipo de Vehículo"
              value={formData.vehicleType}
              onChange={(event) => handleChange("vehicleType", event.target.value)}
              size="small"
              fullWidth
              placeholder="Ej: Camión Cisterna"
            />
            <TextField
              label="Modelo"
              value={formData.vehicleModel}
              onChange={(event) => handleChange("vehicleModel", event.target.value)}
              size="small"
              fullWidth
              placeholder="Ej: Volvo FH 500"
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
              <TextField
                label="Año"
                value={formData.vehicleYear}
                onChange={(event) => handleChange("vehicleYear", event.target.value)}
                size="small"
                fullWidth
                type="number"
              />
              <TextField
                label="Capacidad"
                value={formData.vehicleCapacity}
                onChange={(event) => handleChange("vehicleCapacity", event.target.value)}
                size="small"
                fullWidth
                placeholder="Ej: 12,000 kg"
              />
            </Stack>
            <TextField
              label="Último Mantenimiento"
              type="date"
              value={formData.vehicleMaintenance}
              onChange={(event) => handleChange("vehicleMaintenance", event.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
            <TextField
              label="Estado Técnico"
              value={formData.vehicleTechnicalStatus}
              onChange={(event) => handleChange("vehicleTechnicalStatus", event.target.value)}
              size="small"
              fullWidth
              placeholder="Ej: Óptimo"
            />
          </Stack>
        )}

        {activeStep === 4 && (
          <Stack spacing={1.8}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
              <TextField
                label="Cantidad"
                value={formData.loadQuantity}
                onChange={(event) => handleChange("loadQuantity", event.target.value)}
                size="small"
                fullWidth
                type="number"
                placeholder="Ej: 5000"
              />
              <FormControl fullWidth size="small">
                <InputLabel id="load-unit-label">Unidad</InputLabel>
                <Select
                  labelId="load-unit-label"
                  label="Unidad"
                  value={formData.loadUnit}
                  onChange={(event) => handleChange("loadUnit", event.target.value)}
                >
                  <MenuItem value="kg">kg</MenuItem>
                  <MenuItem value="L">L</MenuItem>
                  <MenuItem value="m³">m³</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <TextField
              label="Lote"
              value={formData.loadLot}
              onChange={(event) => handleChange("loadLot", event.target.value)}
              size="small"
              fullWidth
              placeholder="Ej: LOT-2025-04-23-A"
            />
            <TextField
              label="Fecha de Producción"
              type="date"
              value={formData.loadProductionDate}
              onChange={(event) => handleChange("loadProductionDate", event.target.value)}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
            />
          </Stack>
        )}

        {activeStep === 5 && (
          <Stack spacing={1.8}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
              <TextField
                label="Llegada"
                type="time"
                value={formData.arrival}
                onChange={(event) => handleChange("arrival", event.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
                required
              />
              <TextField
                label="Atención"
                type="time"
                value={formData.attention}
                onChange={(event) => handleChange("attention", event.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
              <TextField
                label="Salida"
                type="time"
                value={formData.departure}
                onChange={(event) => handleChange("departure", event.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                fullWidth
              />
              <TextField
                label="Duración (minutos)"
                type="number"
                value={formData.durationMin}
                onChange={(event) => handleChange("durationMin", event.target.value)}
                size="small"
                fullWidth
              />
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2.8, sm: 3.2 }, pb: 2.4, pt: 1 }}>
        <Button onClick={handleClose} variant="text" size="small">
          Cancelar
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        {activeStep > 0 && (
          <Button onClick={handleBack} startIcon={<ArrowBack />} size="small">
            Anterior
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained" color="primary" endIcon={<ArrowForward />} size="small">
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={isEditing ? <Edit /> : <Add />}
            size="small"
          >
            {isEditing ? "Guardar Cambios" : "Agregar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DespachoFormModal;
