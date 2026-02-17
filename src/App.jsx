import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardHomePage from "./pages/dashboard/DashboardHomePage";
import DespachosPage from "./pages/dashboard/DespachosPage";
import DetalleDespachoPage from "./pages/dashboard/DetalleDespachoPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./mocks/authService";

function App() {
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/recuperar-password" element={<ForgotPasswordPage />} />
      <Route path="/reiniciar-password" element={<ChangePasswordPage />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/cambiar-password" element={<Navigate to="/reiniciar-password" replace />} />
      <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
