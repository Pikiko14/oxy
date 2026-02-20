import { useState } from "react";
import { AppBar, Box, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Stack, Toolbar, Tooltip, Typography } from "@mui/material";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import LocalShipping from "@mui/icons-material/LocalShipping";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import Menu from "@mui/icons-material/Menu";
import AssessmentOutlined from "@mui/icons-material/AssessmentOutlined";
import BookmarkBorder from "@mui/icons-material/BookmarkBorder";
import Description from "@mui/icons-material/Description";
import Assessment from "@mui/icons-material/Assessment";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import DashboardHomePage from "./dashboard/DashboardHomePage";
import DespachosPage from "./dashboard/DespachosPage";
import DetalleDespachoPage from "./dashboard/DetalleDespachoPage";
import AuditoriaPage from "./dashboard/AuditoriaPage";
import ReservasPage from "./dashboard/ReservasPage";
import DetalleReservaPage from "./dashboard/DetalleReservaPage";
import DocumentosPage from "./dashboard/DocumentosPage";
import ReportesPage from "./dashboard/ReportesPage";
import ChecklistPage from "./dashboard/ChecklistPage";
import oxychemLogoWhite from "../assets/OXYCHEM_LOGO_WHITE_RGB.png";
import { getAuthSession, logoutMock } from "../mocks/authService";
import { brandColors } from "../theme";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", path: "/dashboard", icon: <DashboardOutlined /> },
  { key: "reservas", label: "Reservas", path: "/dashboard/reservas", icon: <BookmarkBorder /> },
  { key: "despachos", label: "Delivery", path: "/dashboard/despachos", icon: <LocalShipping /> },
  { key: "documentos", label: "Documentos", path: "/dashboard/documentos", icon: <Description /> },
  { key: "auditoria", label: "Auditoría", path: "/dashboard/auditoria", icon: <AssessmentOutlined /> },
  { key: "reportes", label: "Reportes", path: "/dashboard/reportes", icon: <Assessment /> },
];

const getPageTitle = (pathname) => {
  if (pathname.startsWith("/dashboard/despachos/")) return "Detalle de Delivery";
  if (pathname.startsWith("/dashboard/despachos")) return "Panel de Delivery";
  if (pathname.startsWith("/dashboard/reservas/")) return "Detalle de Reserva";
  if (pathname.startsWith("/dashboard/reservas")) return "Reservas";
  if (pathname.startsWith("/dashboard/documentos")) return "Documentos";
  if (pathname.startsWith("/dashboard/reportes")) return "Reportes";
  if (pathname.startsWith("/dashboard/auditoria")) return "Auditoría del Sistema";
  return "Dashboard de Delivery";
};

const getPageSubtitle = (pathname, userName) => {
  if (pathname.startsWith("/dashboard/despachos/")) return "Seguimiento operativo, documentos y acciones";
  if (pathname.startsWith("/dashboard/despachos")) return "Gestión operativa de delivery";
  if (pathname.startsWith("/dashboard/reservas/")) return "Seguimiento operativo, documentos y acciones de la reserva";
  if (pathname.startsWith("/dashboard/reservas")) return "Gestión de reservas asociadas a deliveries";
  if (pathname.startsWith("/dashboard/documentos")) return "Visualización y envío de documentos comerciales";
  if (pathname.startsWith("/dashboard/reportes")) return "Genera reportes personalizables con campos seleccionables";
  if (pathname.startsWith("/dashboard/auditoria")) return "Registro de movimientos y acciones realizadas en la aplicación";
  return `Vista operativa de hoy para ${userName}`;
};

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getAuthSession();
  const userName = session?.user?.name || "Usuario";
  const [miniSidebar, setMiniSidebar] = useState(true);
  const asideWidth = miniSidebar ? { xs: 74, md: 90 } : { xs: 84, md: 250 };

  const handleLogout = () => {
    logoutMock();
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        bgcolor: "background.default",
        display: "flex",
        backgroundImage:
          "radial-gradient(900px circle at 90% -10%, rgba(0,83,155,0.08), transparent 58%), radial-gradient(700px circle at -10% 100%, rgba(181,18,27,0.05), transparent 64%)",
      }}
    >
      <Box
        component="aside"
        sx={{
          width: asideWidth,
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: brandColors.midnightBlue,
          color: "white",
          py: 2,
          px: { xs: 1.2, md: 1.6 },
          display: "flex",
          flexDirection: "column",
          gap: 2,
          position: "sticky",
          top: 0,
          height: "100dvh",
          transition: "width 180ms ease",
          boxShadow: "2px 0 18px rgba(0, 22, 45, 0.2)",
        }}
      >
        <Box
          component="img"
          src={oxychemLogoWhite}
          alt="Logo OXYCHEM blanco"
          sx={{
            width: miniSidebar ? { xs: 54, md: 62 } : "100%",
            maxWidth: miniSidebar ? { xs: 54, md: 62 } : "100%",
            height: "auto",
            objectFit: miniSidebar ? "cover" : "contain",
            objectPosition: "center",
            display: "block",
            px: { xs: 0.2, md: 0.4 },
            mb: 0.8,
            mx: miniSidebar ? "auto" : 0,
          }}
        />

        <List disablePadding sx={{ mt: 1 }}>
          {NAV_ITEMS.map((item) => {
            const selected =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard" || location.pathname === "/dashboard/"
                : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <ListItemButton
                key={item.key}
                selected={selected}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 0,
                  mb: 0.6,
                  color: "white",
                  borderLeft: "3px solid transparent",
                  "&.Mui-selected": {
                    bgcolor: "rgba(255,255,255,0.16)",
                    borderLeftColor: brandColors.morningBlue,
                  },
                  "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                  minHeight: 44,
                  px: { xs: 1.2, md: 1.6 },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: { xs: 0, md: miniSidebar ? 0 : 34 } }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ display: { xs: "none", md: miniSidebar ? "none" : "block" } }} />
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <List disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 0,
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
              minHeight: 44,
              px: { xs: 1.2, md: 1.6 },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: { xs: 0, md: miniSidebar ? 0 : 34 } }}>
              <LogoutOutlined />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesion" sx={{ display: { xs: "none", md: miniSidebar ? "none" : "block" } }} />
          </ListItemButton>
        </List>
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          elevation={0}
          color="transparent"
          sx={{
            borderBottom: "1px solid",
            borderColor: "divider",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(243,245,247,0.86)",
            borderRadius: 0,
            boxShadow: "0px 8px 18px rgba(0, 46, 77, 0.08)",
          }}
        >
          <Toolbar sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 0.9, md: 1.2 } }}>
            <Box sx={{ width: "100%" }}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={{ xs: 0.9, sm: 1.5 }}>
                <Stack direction="row" spacing={1.1} alignItems="center" sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Tooltip title="Alternar menú" arrow placement="bottom">
                    <IconButton
                      size="small"
                      onClick={() => setMiniSidebar((prev) => !prev)}
                      aria-label="alternar menu mini"
                      sx={{ border: "1px solid", borderColor: "divider" }}
                    >
                      <Menu fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: "1.05rem", sm: "1.25rem" },
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {getPageTitle(location.pathname)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: { xs: "none", sm: "block" },
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {getPageSubtitle(location.pathname, userName)}
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    alignSelf: { xs: "flex-start", sm: "center" },
                    pl: { xs: 5.1, sm: 0 },
                    fontSize: { xs: "0.85rem", sm: "0.95rem" },
                    lineHeight: 1.2,
                    color: "text.primary",
                  }}
                >
                  Bienvenido, {userName}
                </Typography>
              </Stack>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Routes>
            <Route index element={<DashboardHomePage />} />
            <Route path="despachos" element={<DespachosPage />} />
            <Route path="despachos/:actNumber" element={<DetalleDespachoPage />} />
            <Route path="reservas" element={<ReservasPage />} />
            <Route path="reservas/:id" element={<DetalleReservaPage />} />
            <Route path="documentos" element={<DocumentosPage />} />
            <Route path="reportes" element={<ReportesPage />} />
            <Route path="auditoria" element={<AuditoriaPage />} />
            <Route path="checklist" element={<ChecklistPage />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardPage;
