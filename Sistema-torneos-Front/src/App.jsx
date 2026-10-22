import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Layout";
import ListaTorneos from "./Pages/ListaTorneos";
import Equipos from "./Pages/Equipos";
import Jugadores from "./Pages/Jugadores";
import ConfigurarTorneo from "./Pages/ConfigurarTorneo";
import CrearTorneo from "./Pages/crearTorneo";
import FixtureTorneo from "./Pages/FixtureTorneo";
import RegistrarPartido from './Pages/RegistrarPartido';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Rutas Activas Funcionales */}
        <Route path="/" element={<ListaTorneos />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/jugadores" element={<Jugadores />} />

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