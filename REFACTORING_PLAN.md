# Plan de Refactorización - Clean Architecture

## Estructura Propuesta

```
src/
├── domain/                    # Capa de Dominio (Lógica de negocio)
│   ├── entities/              # Entidades del dominio
│   │   ├── Delivery.js
│   │   ├── Reserva.js
│   │   ├── Documento.js
│   │   └── ...
│   ├── repositories/          # Interfaces de repositorios
│   │   ├── IDeliveryRepository.js
│   │   ├── IReservaRepository.js
│   │   └── ...
│   └── useCases/              # Casos de uso
│       ├── delivery/
│       ├── reserva/
│       └── ...
│
├── infrastructure/            # Capa de Infraestructura
│   ├── api/                   # Servicios API
│   │   ├── deliveryService.js
│   │   ├── reservaService.js
│   │   └── ...
│   ├── repositories/          # Implementaciones de repositorios
│   │   ├── DeliveryRepository.js
│   │   ├── ReservaRepository.js
│   │   └── ...
│   └── mocks/                 # Datos mock (temporal)
│       ├── deliveryMock.js
│       ├── reservaMock.js
│       └── ...
│
├── presentation/              # Capa de Presentación
│   ├── components/             # Componentes reutilizables
│   │   ├── common/             # Componentes comunes
│   │   │   ├── KpiCard/
│   │   │   ├── ChartCard/
│   │   │   ├── DataTable/
│   │   │   ├── FiltersBar/
│   │   │   ├── StatusChip/
│   │   │   └── ...
│   │   ├── forms/             # Componentes de formularios
│   │   │   ├── DeliveryForm/
│   │   │   ├── ReservaForm/
│   │   │   └── ...
│   │   ├── charts/            # Componentes de gráficos
│   │   │   ├── DayBarChart/
│   │   │   ├── LoadTypeChart/
│   │   │   └── ...
│   │   ├── modals/            # Modales reutilizables
│   │   │   ├── DocumentosModal/
│   │   │   ├── EditReservaModal/
│   │   │   └── ...
│   │   └── layout/            # Componentes de layout
│   │       ├── DashboardLayout/
│   │       ├── Sidebar/
│   │       └── ...
│   │
│   ├── pages/                 # Páginas
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── ...
│   │   └── dashboard/
│   │       ├── DashboardHomePage.jsx
│   │       ├── ReservasPage.jsx
│   │       └── ...
│   │
│   └── hooks/                 # Custom hooks
│       ├── useDeliveries.js
│       ├── useReservas.js
│       ├── useDocuments.js
│       └── ...
│
├── shared/                    # Código compartido
│   ├── constants/             # Constantes
│   │   ├── deliveryStatuses.js
│   │   ├── reservaEstados.js
│   │   └── ...
│   ├── utils/                 # Utilidades
│   │   ├── dateUtils.js
│   │   ├── formatUtils.js
│   │   └── ...
│   ├── types/                 # Tipos TypeScript (si se migra)
│   └── theme/                 # Tema y estilos
│       ├── theme.js
│       └── brandColors.js
│
└── App.jsx
```

## Componentes Reutilizables Identificados

### 1. Componentes Comunes
- **KpiCard**: Tarjeta de KPI (ya existe, mover a components/common)
- **ChartCard**: Contenedor de gráficos (ya existe, mover a components/common)
- **DataTable**: Tabla de datos genérica con paginación y filtros
- **FiltersBar**: Barra de filtros reutilizable
- **StatusChip**: Chip de estado con colores configurables
- **SearchInput**: Input de búsqueda con icono
- **DateRangePicker**: Selector de rango de fechas

### 2. Componentes de Formularios
- **DeliveryForm**: Formulario de delivery (extraer de DespachoFormModal)
- **ReservaForm**: Formulario de reserva con calendario
- **FormField**: Campo de formulario genérico

### 3. Componentes de Gráficos
- **DayBarChart**: Gráfico de barras por día
- **LoadTypeChart**: Gráfico de tipo de carga
- **PieChart**: Gráfico circular (si se necesita)

### 4. Modales
- **DocumentosModal**: Modal de documentos (ya existe, mover)
- **EditReservaModal**: Modal de edición de reserva
- **ConfirmDialog**: Diálogo de confirmación genérico

### 5. Componentes de Layout
- **DashboardLayout**: Layout del dashboard con sidebar
- **PageHeader**: Encabezado de página con título y subtítulo
- **InfoCard**: Tarjeta de información

## Pasos de Refactorización

### Fase 1: Estructura Base
1. Crear estructura de carpetas
2. Mover archivos de configuración (theme, constants)
3. Crear utilidades compartidas

### Fase 2: Componentes Comunes
1. Extraer KpiCard a components/common/KpiCard
2. Extraer ChartCard a components/common/ChartCard
3. Crear DataTable genérico
4. Crear StatusChip configurable
5. Crear FiltersBar reutilizable

### Fase 3: Componentes de Dominio
1. Extraer formularios a components/forms
2. Extraer gráficos a components/charts
3. Extraer modales a components/modals
4. Crear hooks personalizados (useDeliveries, useReservas)

### Fase 4: Capa de Dominio
1. Crear entidades (Delivery, Reserva, Documento)
2. Crear interfaces de repositorios
3. Crear casos de uso

### Fase 5: Capa de Infraestructura
1. Crear servicios API
2. Implementar repositorios
3. Migrar mocks a infrastructure/mocks

### Fase 6: Refactorizar Páginas
1. Refactorizar páginas para usar componentes reutilizables
2. Usar hooks personalizados
3. Aplicar casos de uso

## Prioridades

### Alta Prioridad (Hacer primero)
1. ✅ Crear estructura de carpetas
2. ✅ Extraer componentes comunes (KpiCard, ChartCard)
3. ✅ Crear DataTable genérico
4. ✅ Crear StatusChip configurable

### Media Prioridad
1. Extraer formularios
2. Extraer modales
3. Crear hooks personalizados

### Baja Prioridad (Futuro)
1. Implementar capa de dominio completa
2. Migrar a TypeScript
3. Implementar tests

## Notas
- Mantener compatibilidad durante la refactorización
- Hacer cambios incrementales
- Probar cada componente extraído antes de continuar