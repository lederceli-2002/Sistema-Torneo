import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Layout";
import ListaTorneos from "./Pages/ListaTorneos";
import Equipos from "./Pages/Equipos";
import Jugadores from "./Pages/Jugadores";
import ConfigurarTorneo from "./Pages/ConfigurarTorneo";
import CrearTorneo from "./Pages/crearTorneo";
import FixtureTorneo from "./Pages/FixtureTorneo";
import RegistrarPartido from "./Pages/RegistrarPartido";
import CrearEquipo from "./Pages/CrearEquipos";
import EditarEquipo from "./Pages/EditarEquipo";
import Login from "./Pages/Login";
import RegistroUsuario from "./Pages/RegistroUsuario";
import { obtenerUsuarioActual } from "./Services/authService";

// 1. Guardia para Rutas Privadas: Si no hay usuario logueado, manda al Login
function RutaProtegida({ children }) {
  const usuario = obtenerUsuarioActual();
  return usuario ? children : <Navigate to="/login" replace />;
}

// 2. Guardia para Rutas Públicas: Si ya inició sesión, lo redirige al Inicio
function RutaPublica({ children }) {
  const usuario = obtenerUsuarioActual();
  return usuario ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <Routes>
      {/* =========================================================
          RUTAS PÚBLICAS (Sin SideBar / Layout)
          ========================================================= */}
      <Route
        path="/login"
        element={
          <RutaPublica>
            <Login />
          </RutaPublica>
        }
      />
      <Route
        path="/registro"
        element={
          <RutaPublica>
            <RegistroUsuario />
          </RutaPublica>
        }
      />

      {/* =========================================================
          RUTAS PRIVADAS (Protegidas + Con Layout / SideBar)
          ========================================================= */}
      <Route
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >
        {/* Rutas Activas Funcionales */}
        <Route path="/" element={<ListaTorneos />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/jugadores" element={<Jugadores />} />
        <Route path="/equipos/crear" element={<CrearEquipo />} />
        <Route path="/equipos/editar/:idEquipo" element={<EditarEquipo />} />

        {/* Flujo desde las tarjetas del Inicio */}
        <Route path="/torneos/crear" element={<CrearTorneo />} />
        <Route path="/torneos/:idTorneo/configurar" element={<ConfigurarTorneo />} />
        <Route path="/torneos/fixture/:idTorneo" element={<FixtureTorneo />} />
        <Route path="/partidos/registrar/:idPartido" element={<RegistrarPartido />} />

        {/* Bloqueo y Redirección al Inicio para Torneos y el menú deshabilitado */}
        <Route path="/torneos" element={<Navigate to="/" replace />} />
        <Route path="/partidos" element={<Navigate to="/" replace />} />
        <Route path="/ranking" element={<Navigate to="/" replace />} />
        <Route path="/sanciones" element={<Navigate to="/" replace />} />
        <Route path="/tarjetas" element={<Navigate to="/" replace />} />
        <Route path="/configuracion" element={<Navigate to="/" replace />} />

        {/* Ruta Por Defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;