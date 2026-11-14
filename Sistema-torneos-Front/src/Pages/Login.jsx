import React, {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import {iniciarSesion} from '../Services/authService';


export default function Login(){

    const navigate = useNavigate();
    const [form, setForm] = useState({email: '', password: ''});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try{
            await iniciarSesion(form);
            navigate('/');            
        } catch (err){
            setError(err.response?.data?.message || 'Credenciales incorrectas');
        } finally{
            setLoading(false)
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>⚽ Sistema de Torneos</h2>
                    <p style={styles.subtitle}>Ingresa tus credenciales para continuar</p>
                </div>

                {error && <div style={styles.alertError}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.group}>
                        <label style={styles.label}>Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="admin@torneo.com"
                            value={form.email}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.group}>
                        <label style={styles.label}>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.btnPrimary}>
                        {loading ? 'Ingresando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <span>¿No tienes una cuenta? </span>
                    <Link to="/registro" style={styles.link}>Regístrate aquí</Link>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', fontFamily: 'Arial, sans-serif', padding: '20px' },
    card: { backgroundColor: '#ffffff', padding: '35px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px' },
    header: { textAlign: 'center', marginBottom: '25px' },
    title: { margin: 0, color: '#0f172a', fontSize: '24px' },
    subtitle: { margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' },
    alertError: { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    group: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: 'bold', color: '#334155' },
    input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
    btnPrimary: { backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '5px' },
    footer: { marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' },
    link: { color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }
}