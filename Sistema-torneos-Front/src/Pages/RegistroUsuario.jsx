import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrarUsuario } from '../Services/authService';

export default function RegistroUsuario() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        confirmarPassword: '',
        rol: 'ENCARGADO_PARTIDO'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmarPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);
        try {
            await registrarUsuario({
                nombres: form.nombres,
                apellidos: form.apellidos,
                email: form.email,
                password: form.password,
                rol: form.rol
            });
            alert('¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Crear Cuenta</h2>
                    <p style={styles.subtitle}>Registro de personal del sistema</p>
                </div>

                {error && <div style={styles.alertError}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.group}>
                            <label style={styles.label}>Nombres</label>
                            <input type="text" name="nombres" required placeholder="Ej. Carlos" value={form.nombres} onChange={handleChange} style={styles.input} />
                        </div>
                        <div style={styles.group}>
                            <label style={styles.label}>Apellidos</label>
                            <input type="text" name="apellidos" required placeholder="Ej. Pérez" value={form.apellidos} onChange={handleChange} style={styles.input} />
                        </div>
                    </div>

                    <div style={styles.group}>
                        <label style={styles.label}>Correo Electrónico</label>
                        <input type="email" name="email" required placeholder="usuario@torneo.com" value={form.email} onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.group}>
                        <label style={styles.label}>Rol en el Sistema</label>
                        <select name="rol" value={form.rol} onChange={handleChange} style={styles.input}>
                            <option value="ENCARGADO_PARTIDO">Encargado de Partido</option>
                            <option value="ADMINISTRADOR">Administrador</option>
                        </select>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.group}>
                            <label style={styles.label}>Contraseña</label>
                            <input type="password" name="password" required placeholder="••••••••" value={form.password} onChange={handleChange} style={styles.input} />
                        </div>
                        <div style={styles.group}>
                            <label style={styles.label}>Confirmar</label>
                            <input type="password" name="confirmarPassword" required placeholder="••••••••" value={form.confirmarPassword} onChange={handleChange} style={styles.input} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={styles.btnPrimary}>
                        {loading ? 'Registrando...' : 'Registrar Usuario'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>¿Ya tienes cuenta? </span>
                    <Link to="/login" style={styles.link}>Inicia sesión</Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', fontFamily: 'Arial, sans-serif', padding: '20px' },
    card: { backgroundColor: '#ffffff', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '460px' },
    header: { textAlign: 'center', marginBottom: '22px' },
    title: { margin: 0, color: '#0f172a', fontSize: '24px' },
    subtitle: { margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' },
    alertError: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
    group: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 'bold', color: '#334155' },
    input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
    btnPrimary: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '5px' },
    footer: { marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' },
    link: { color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }
};