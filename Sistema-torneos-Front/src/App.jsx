import "./App.css"
import { Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import ListaTorneos from "./Pages/ListaTorneos";
import Jugadores from "./Pages/Jugadores";
import Torneos from "./Pages/Torneos";
import EnConstruccion from "./Pages/EnConstruccion";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ListaTorneos />} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/jugadores" element={<Jugadores />} />
        <Route path="*" element={<EnConstruccion />} />
      </Route>
    </Routes>
  )
}

export default App;