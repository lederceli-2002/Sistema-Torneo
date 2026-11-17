import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const API_URL = `${API_BASE}/auth`;

export const iniciarSesion = async (credenciales) => {
    const response = await axios.post(`${API_URL}/login`, credenciales);
    if (response.data) {
        localStorage.setItem('usuarioSistema', JSON.stringify(response.data));
    }
    return response.data;
};

export const registrarUsuario = async (datosUsuario) => {
    const response = await axios.post(`${API_URL}/registro`, datosUsuario);
    return response.data;
};

export const cerrarSesion = () => {
    localStorage.removeItem('usuarioSistema');
};

export const obtenerUsuarioActual = () => {
    const data = localStorage.getItem('usuarioSistema');
    return data ? JSON.parse(data) : null;
};