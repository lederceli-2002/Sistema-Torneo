import "./App.css"
import { Routes, Route, Router } from "react-router-dom";
import Layout from "./Components/Layout";
import ListaTorneos from "./Pages/ListaTorneos";
import Jugadores from "./Pages/Jugadores";
import Torneos from "./Pages/Torneos";
import Equipos from "./Pages/Equipos";
import EnConstruccion from "./Pages/EnConstruccion";
import ConfigurarTorneo from "./Pages/ConfigurarTorneo";
import CrearTorneo from "./Pages/crearTorneo";
import FixtureTorneo from "./Pages/FixtureTorneo";
import RegistrarPartido from './Pages/RegistrarPartido';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ListaTorneos />} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/torneos/crear" element={<CrearTorneo />} />
        <Route path="/torneos/:idTorneo/configurar" element={<ConfigurarTorneo />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/jugadores" element={<Jugadores />} />
        <Route path="/torneos/fixture/:idTorneo" element={<FixtureTorneo/>} />
        <Route path="/partidos/registrar/:idPartido" element={<RegistrarPartido />} />
        {/* Cualquier otra ruta todavía no implementada */}
        <Route path="*" element={<EnConstruccion />} />
      </Route>
    </Routes>
  )
}

export default App;