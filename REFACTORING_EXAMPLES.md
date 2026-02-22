# Ejemplos de Componentes Reutilizables Creados

## Componentes Creados

### 1. `KpiCard` - `src/presentation/components/common/KpiCard.jsx`
Componente reutilizable para mostrar tarjetas de KPI.

**Uso:**
```jsx
import { KpiCard } from "../../presentation/components/common/KpiCard";

<KpiCard 
  item={{
    title: "Delivery Totales",
    value: 248,
    delta: "Deliverys activas de SAP",
    color: brandColors.oxyBlue,
    icon: LocalShippingOutlined,
  }}
  onClick={() => navigate("/dashboard/despachos")}
/>
```

### 2. `ChartCard` - `src/presentation/components/common/ChartCard.jsx`
Componente reutilizable para contenedores de gráficos.

**Uso:**
```jsx
import { ChartCard } from "../../presentation/components/common/ChartCard";

<ChartCard
  title="Delivery por Día"
  subtitle="Comparativo planificados vs completados"
  onCalendarClick={() => handleOpenCalendarModal('day')}
>
  <DayBarChart data={filteredDayData} />
</ChartCard>
```

### 3. `StatusChip` - `src/presentation/components/common/StatusChip.jsx`
Componente reutilizable para mostrar chips de estado con colores configurables.

**Uso:**
```jsx
import { StatusChip } from "../../presentation/components/common/StatusChip";
import { DELIVERY_STATUS_STYLES } from "../../shared/constants/deliveryStatuses";

<StatusChip
  label="Completado"
  status="COMPLETADO"
  statusConfig={DELIVERY_STATUS_STYLES}
/>
```

## Constantes Creadas

### 1. `deliveryStatuses.js` - `src/shared/constants/deliveryStatuses.js`
Constantes y configuraciones para estados de delivery.

**Uso:**
```jsx
import { 
  DELIVERY_STATUSES, 
  DELIVERY_STATUS_STYLES, 
  DELIVERY_STATUS_LABELS 
} from "../../shared/constants/deliveryStatuses";

// Usar constantes
const status = DELIVERY_STATUSES.COMPLETADO;

// Usar estilos
const style = DELIVERY_STATUS_STYLES[status];

// Usar etiquetas
const label = DELIVERY_STATUS_LABELS[status];
```

## Utilidades Creadas

### 1. `dateUtils.js` - `src/shared/utils/dateUtils.js`
Utilidades para manejo de fechas.

**Uso:**
```jsx
import { 
  getStartOfWeek, 
  getEndOfWeek, 
  getTodayKey,
  formatDateShort,
  formatDateToKey,
  getDayName
} from "../../shared/utils/dateUtils";

const startWeek = getStartOfWeek();
const today = getTodayKey();
const formatted = formatDateShort(new Date());
```

## Próximos Pasos

1. **Migrar componentes existentes** a usar los nuevos componentes reutilizables
2. **Crear más componentes comunes:**
   - `DataTable` - Tabla genérica con paginación
   - `FiltersBar` - Barra de filtros reutilizable
   - `SearchInput` - Input de búsqueda con icono
   - `DateRangePicker` - Selector de rango de fechas

3. **Extraer más constantes:**
   - Estados de reservas
   - Tipos de documentos
   - Configuraciones de colores

4. **Crear hooks personalizados:**
   - `useDeliveries` - Hook para manejar deliveries
   - `useReservas` - Hook para manejar reservas
   - `useDocuments` - Hook para manejar documentos

## Migración Gradual

Para migrar gradualmente sin romper el código existente:

1. Importar los nuevos componentes en los archivos existentes
2. Reemplazar los componentes locales con los nuevos
3. Eliminar los componentes locales una vez migrados
4. Actualizar imports cuando todos los archivos estén migrados