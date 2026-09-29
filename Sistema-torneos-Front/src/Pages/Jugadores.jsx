import { useEffect, useState } from "react";
import {
    listarJugadores,
    registrarJugador,
    actualizarJugador,
    eliminarJugador,
} from "../Services/jugadorService.js";

// formulario vacio
const jugadorVacio = {
    idJugador: null,
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    dni: "",
    nacionalidad: "",
    estado: "Activo",
};

function Jugadores() {
    //estados de la pantalla
    const [jugadores, setJugadores] = useState([]);
    const [formulario, setFormulario] = useState(jugadorVacio);
    const [busqueda, setBusqueda] = useState("");
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");

    // carga la lista de jugadores desde el backend
    async function cargarJugadores() {
        try {
            setJugadores(await listarJugadores());
        } catch (e) {
            setError(e.message);
        }
    }
    // hace que cargue la lista al abrir la pantalla
    useEffect(() => {
        cargarJugadores();
    }, []);

    // actualiza el campo que el usuario esta escribiendo
    function cambiarCampo(e) {
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    }

    async function guardar(e) {
        e.preventDefault();
        setError("");
        setExito("");

        // los campos opcionales que no se llenen se mandan como null
        const jugador = {
            ...formulario,
            fechaNacimiento: formulario.fechaNacimiento || null,
            dni: formulario.dni || null,
            nacionalidad: formulario.nacionalidad || null,
        };

        try {
            if (jugador.idJugador) {
                await actualizarJugador(jugador);
                setExito("Jugador actualizado correctamente");
            } else {
                await registrarJugador(jugador);
                setExito("Jugador registrado correctamente");
            }
            setFormulario(jugadorVacio);
            cargarJugadores();
        } catch (e) {
            // muestra el mensaje del backend 
            setError(e.message);
        }
    }

    // pasa los datos del jugador al formulario para editarlo
    function editar(jugador) {
        setError("");
        setExito("");
        setFormulario({
            ...jugador,
            fechaNacimiento: jugador.fechaNacimiento ?? "",
            dni: jugador.dni ?? "",
            nacionalidad: jugador.nacionalidad ?? "",
        });
    }

    async function eliminar(jugador) {
        if (!window.confirm(`¿Eliminar a ${jugador.nombres} ${jugador.apellidos}?`)) return;
        setError("");
        setExito("");
        try {
            await eliminarJugador(jugador.idJugador);
            setExito("Jugador eliminado");
            cargarJugadores();
        } catch (e) {
            setError(e.message);
        }
    }

    // filtra por nombre, apellido o DNI
    const texto = busqueda.toLowerCase();
    const jugadoresFiltrados = jugadores.filter((j) =>
        `${j.nombres} ${j.apellidos} ${j.dni ?? ""}`.toLowerCase().includes(texto)
    );

    return (
        <div className="contenedor-pagina">
            <h1>Jugadores</h1>
            <p>Registro y mantenimiento de los jugadores del torneo.</p>

            {error && <div className="aviso aviso-error">{error}</div>}
            {exito && <div className="aviso aviso-exito">{exito}</div>}

            {/* ---------- FORMULARIO ---------- */}
            <form className="formulario" onSubmit={guardar}>
                <h2>{formulario.idJugador ? "Editar jugador" : "Nuevo jugador"}</h2>

                <div className="formulario-grilla">
                    <label className="campo">
                        Nombres *
                        <input name="nombres" value={formulario.nombres} onChange={cambiarCampo} />
                    </label>
                    <label className="campo">
                        Apellidos *
                        <input name="apellidos" value={formulario.apellidos} onChange={cambiarCampo} />
                    </label>
                    <label className="campo">
                        Fecha de nacimiento
                        <input type="date" name="fechaNacimiento" value={formulario.fechaNacimiento} onChange={cambiarCampo} />
                    </label>
                    <label className="campo">
                        DNI
                        <input name="dni" maxLength={20} value={formulario.dni} onChange={cambiarCampo} />
                    </label>
                    <label className="campo">
                        Nacionalidad
                        <input name="nacionalidad" value={formulario.nacionalidad} onChange={cambiarCampo} />
                    </label>
                    <label className="campo">
                        Estado *
                        <select name="estado" value={formulario.estado} onChange={cambiarCampo}>
                            <option>Activo</option>
                            <option>Inactivo</option>
                        </select>
                    </label>
                </div>

                <div className="formulario-botones">
                    {formulario.idJugador && (
                        <button type="button" className="btn btn-secundario" onClick={() => setFormulario(jugadorVacio)}>
                            Cancelar
                        </button>
                    )}
                    <button type="submit" className="btn">
                        {formulario.idJugador ? "Guardar cambios" : "Registrar"}
                    </button>
                </div>
            </form>

            {/* ---------- LISTADO ---------- */}
            <input
                className="buscador"
                placeholder="Buscar por nombre, apellido o DNI..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <table className="tabla">
                <thead>
                    <tr>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>DNI</th>
                        <th>Nacionalidad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {jugadoresFiltrados.map((j) => (
                        <tr key={j.idJugador}>
                            <td>{j.nombres}</td>
                            <td>{j.apellidos}</td>
                            <td>{j.dni ?? "-"}</td>
                            <td>{j.nacionalidad ?? "-"}</td>
                            <td>{j.estado}</td>
                            <td className="acciones">
                                <button className="btn btn-secundario" onClick={() => editar(j)}>Editar</button>
                                <button className="btn btn-peligro" onClick={() => eliminar(j)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                    {jugadoresFiltrados.length === 0 && (
                        <tr>
                            <td colSpan={6} className="tabla-vacia">No hay jugadores para mostrar</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Jugadores;