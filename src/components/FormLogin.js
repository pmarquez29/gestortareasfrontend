import { useState } from 'react';
import axios from '../api/axiosAuthInstance';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.css';
import { FaUserLock } from 'react-icons/fa';

function FormLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      document.body.classList.add('fade-transition');
      setTimeout(() => navigate('/tareas'), 300);
    } catch (err) {
      alert('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    'login-input' + (touched[field] && !eval(field) ? ' login-input-error' : '');

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="login-icon-wrapper">
          <FaUserLock className="login-icon" />
        </div>
        <h2 className="login-title">Iniciar Sesión</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched({ ...touched, email: true })}
          placeholder="Correo"
          required
          className={inputClass('email')}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched({ ...touched, password: true })}
          placeholder="Contraseña"
          required
          className={inputClass('password')}
        />
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? 'Cargando...' : 'Entrar'}
        </button>

        <div className="login-footer">
          <p>¿No tienes una cuenta?</p>
          <button
            type="button"
            className="register-link"
            onClick={() => navigate('/registro')}
          >
            Regístrate aquí
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormLogin;
