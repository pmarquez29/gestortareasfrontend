import { useState } from 'react';
import axios from '../api/axiosAuthInstance';
import { useNavigate } from 'react-router-dom';
import '../styles/RegistroForm.css';
import { FaUserPlus } from 'react-icons/fa';

function FormRegistro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirmPassword: false });
  const navigate = useNavigate();

  const handleRegistro = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      await axios.post('/register', { name, email, password });
      alert('Registro exitoso, ahora inicia sesión');
      navigate('/login');
    } catch (err) {
      alert('Error al registrarse');
    }
  };

  const inputClass = (field) =>
    'registro-input' + (touched[field] && !eval(field) ? ' registro-input-error' : '');

  return (
    <div className="registro-container">
      <form className="registro-form" onSubmit={handleRegistro}>
        <div className="registro-icon-wrapper">
          <FaUserPlus className="registro-icon" />
        </div>
        <h2 className="registro-title">Crear Cuenta</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched({ ...touched, name: true })}
          placeholder="Nombre"
          required
          className={inputClass('name')}
        />
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setTouched({ ...touched, confirmPassword: true })}
          placeholder="Confirmar Contraseña"
          required
          className={inputClass('confirmPassword')}
        />
        <button type="submit" className="registro-button">Registrarse</button>
      </form>
    </div>
  );
}

export default FormRegistro;
