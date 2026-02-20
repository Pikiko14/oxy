import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import Save from "@mui/icons-material/Save";
import { brandColors } from "../../theme";

const checklistCamion = [
  { id: "c1", item: "Revisión de neumáticos", checked: false },
  { id: "c2", item: "Estado de frenos", checked: false },
  { id: "c3", item: "Nivel de combustible", checked: false },
  { id: "c4", item: "Luces y señalización", checked: false },
  { id: "c5", item: "Estado de la cabina", checked: false },
  { id: "c6", item: "Documentación del vehículo", checked: false },
];

const checklistCarro = [
  { id: "r1", item: "Estado del chasis", checked: false },
  { id: "r2", item: "Sistema de acople", checked: false },
  { id: "r3", item: "Luces y reflectores", checked: false },
  { id: "r4", item: "Estado de las ruedas", checked: false },
  { id: "r5", item: "Sistema de frenos", checked: false },
  { id: "r6", item: "Documentación del remolque", checked: false },
];

function ChecklistPage() {
  const [tabValue, setTabValue] = useState(0);
  const [camionChecklist, setCamionChecklist] = useState(checklistCamion);
  const [carroChecklist, setCarroChecklist] = useState(checklistCarro);
  const [observaciones, setObservaciones] = useState("");

  const handleCamionChange = (id) => {
    setCamionChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const handleCarroChange = (id) => {
    setCarroChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const handleSave = () => {
    const data = {
      tipo: tabValue === 0 ? "camion" : "carro",
      checklist: tabValue === 0 ? camionChecklist : carroChecklist,
      observaciones,
      fecha: new Date().toISOString(),
    };
    console.log("Guardar checklist:", data);
  };

  const currentChecklist = tabValue === 0 ? camionChecklist : carroChecklist;
  const handleChange = tabValue === 0 ? handleCamionChange : handleCarroChange;

  return (
    <Paper sx={{ p: 2, border: "1px solid", borderColor: "divider", boxShadow: "0px 12px 24px rgba(0, 46, 77, 0.08)" }}>
      <Stack spacing={2.4}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Checklist de Vehículos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ingreso y actualización de checklist para camiones y carros
          </Typography>
        </Box>

        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tab label="Checklist Camión" />
            <Tab label="Checklist Carro" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            <Stack spacing={2}>
              {currentChecklist.map((item) => (
                <FormControlLabel
                  key={item.id}
                  control={<Checkbox checked={item.checked} onChange={() => handleChange(item.id)} color="primary" />}
                  label={item.item}
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontWeight: item.checked ? 600 : 400,
                      color: item.checked ? brandColors.midnightBlue : "text.primary",
                    },
                  }}
                />
              ))}

              <TextField
                size="small"
                label="Observaciones"
                multiline
                rows={4}
                value={observaciones}
                onChange={(event) => setObservaciones(event.target.value)}
                placeholder="Ingrese observaciones adicionales..."
                fullWidth
              />

              <Button variant="contained" color="primary" startIcon={<Save />} onClick={handleSave} size="small" sx={{ alignSelf: "flex-start" }}>
                Guardar Checklist
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Paper>
  );
}

export default ChecklistPage;
