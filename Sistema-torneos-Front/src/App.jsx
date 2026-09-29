import "./App.css"
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import ListaTorneos from "./Pages/ListaTorneos";
import Jugadores from "./Pages/Jugadores";
import EnConstruccion from "./Pages/EnConstruccion";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ListaTorneos />} />
        <Route path="/jugadores" element={<Jugadores />} />
        {/* Cualquier otra ruta todavía no implementada */}
        <Route path="*" element={<EnConstruccion />} />
      </Route>
    </Routes>
  )
}

export default App;