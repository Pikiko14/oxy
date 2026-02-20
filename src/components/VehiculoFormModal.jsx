import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";

const emptyVehicle = {
  id: "",
  categoria: "camion",
  patente: "",
  tipo: "",
  modelo: "",
  año: "",
  capacidad: "",
  estado: "Disponible",
  estadoTecnico: "Óptimo",
  kilometraje: "",
  acople: "",
  ultimoMantenimiento: "",
  proximoMantenimiento: "",
};

function VehiculoFormModal({ open, onClose, initialData = null, onSave }) {
  const [formData, setFormData] = useState(emptyVehicle);
  const isEditing = !!initialData?.id;

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          ...emptyVehicle,
          ...initialData,
        });
      } else {
        setFormData(emptyVehicle);
      }
    }
  }, [open, initialData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setFormData(emptyVehicle);
    onClose();
  };

  const handleSave = () => {
    if (!formData.patente || !formData.tipo || !formData.modelo || !formData.año) {
      return;
    }

    const categoria = formData.categoria === "carro" ? "carro" : "camion";
    const normalized = {
      ...formData,
      categoria,
      patente: formData.patente.toUpperCase(),
      id:
        formData.id ||
        `${categoria === "camion" ? "CAM" : "CAR"}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    };

    onSave(normalized);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ px: { xs: 2.8, sm: 3 }, pt: 2.2, pb: 1.1 }}>
        {isEditing ? "Editar Vehículo" : "Agregar Vehículo"}
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 2.8, sm: 3 }, pt: 1.5, pb: 2.4 }}>
        <Stack spacing={2.4}>
          <Box>
            <Box sx={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, mb: 1, color: "text.secondary" }}>
              Datos del vehículo
            </Box>
            <Stack spacing={1.6}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="vehiculo-categoria-label">Tipo de registro</InputLabel>
                  <Select
                    labelId="vehiculo-categoria-label"
                    label="Tipo de registro"
                    value={formData.categoria}
                    onChange={(event) => handleChange("categoria", event.target.value)}
                  >
                    <MenuItem value="camion">Camión</MenuItem>
                    <MenuItem value="carro">Carro / Remolque</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Patente"
                  value={formData.patente}
                  onChange={(event) => handleChange("patente", event.target.value)}
                  size="small"
                  fullWidth
                  required
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
                <TextField
                  label="Tipo de Vehículo"
                  placeholder="Ej: Camión Cisterna / Remolque Cisterna"
                  value={formData.tipo}
                  onChange={(event) => handleChange("tipo", event.target.value)}
                  size="small"
                  fullWidth
                  required
                />
                <TextField
                  label="Modelo"
                  value={formData.modelo}
                  onChange={(event) => handleChange("modelo", event.target.value)}
                  size="small"
                  fullWidth
                  required
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
                <TextField
                  label="Año"
                  type="number"
                  value={formData.año}
                  onChange={(event) => handleChange("año", event.target.value)}
                  size="small"
                  fullWidth
                  required
                />
                <TextField
                  label="Capacidad"
                  placeholder="Ej: 12,000 kg"
                  value={formData.capacidad}
                  onChange={(event) => handleChange("capacidad", event.target.value)}
                  size="small"
                  fullWidth
                />
              </Stack>
            </Stack>
          </Box>

          <Box>
            <Box sx={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, mb: 1, color: "text.secondary" }}>
              Estado y operación
            </Box>
            <Stack spacing={1.6}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="vehiculo-estado-label">Estado</InputLabel>
                  <Select
                    labelId="vehiculo-estado-label"
                    label="Estado"
                    value={formData.estado}
                    onChange={(event) => handleChange("estado", event.target.value)}
                  >
                    <MenuItem value="Disponible">Disponible</MenuItem>
                    <MenuItem value="En Uso">En Uso</MenuItem>
                    <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Estado Técnico"
                  value={formData.estadoTecnico}
                  onChange={(event) => handleChange("estadoTecnico", event.target.value)}
                  size="small"
                  fullWidth
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
                <TextField
                  label="Kilometraje"
                  placeholder="Solo para camiones"
                  value={formData.kilometraje}
                  onChange={(event) => handleChange("kilometraje", event.target.value)}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Estado Acople"
                  placeholder="Solo para carros / remolques"
                  value={formData.acople}
                  onChange={(event) => handleChange("acople", event.target.value)}
                  size="small"
                  fullWidth
                />
              </Stack>
            </Stack>
          </Box>

          <Box>
            <Box sx={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4, mb: 1, color: "text.secondary" }}>
              Mantenimiento
            </Box>
            <Stack spacing={1.6}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.6}>
                <TextField
                  label="Último Mantenimiento"
                  type="date"
                  value={formData.ultimoMantenimiento || ""}
                  onChange={(event) => handleChange("ultimoMantenimiento", event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
                <TextField
                  label="Próximo Mantenimiento"
                  type="date"
                  value={formData.proximoMantenimiento || ""}
                  onChange={(event) => handleChange("proximoMantenimiento", event.target.value)}
                  InputLabelProps={{ shrink: true }}
                  size="small"
                  fullWidth
                />
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ fontSize: 12, color: "text.secondary" }}>
            Los campos marcados son orientativos para operación. Este formulario es solo de ejemplo, sin integración a backend.
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: { xs: 2.8, sm: 3 }, pb: 2.2, pt: 1 }}>
        <Button onClick={handleClose} variant="text" size="small">
          Cancelar
        </Button>
        <Box sx={{ flex: "1 1 auto" }} />
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          startIcon={isEditing ? <Edit /> : <Add />}
          size="small"
        >
          {isEditing ? "Guardar Cambios" : "Agregar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default VehiculoFormModal;

