import { useState } from 'react';
import axios from '../api/axiosTareasInstance';
import '../styles/AgregarTarea.css';
import { FaPlusCircle, FaCheckCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';

registerLocale('es', es);

function AgregarTarea({ onTareaAgregada }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLimite, setFechaLimite] = useState(null);
  const [creada, setCreada] = useState(false);
  const [fechaInvalida, setFechaInvalida] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return toast.error('El título es obligatorio');
    if (!fechaLimite) {
      setFechaInvalida(true);
      return toast.error('Debe seleccionar una fecha límite');
    }
    if (new Date(fechaLimite) < new Date()) {
      setFechaInvalida(true);
      return toast.error('La fecha límite debe ser futura');
    }
    setFechaInvalida(false);

    try {
      await axios.post(
        '/tareas',
        {
          titulo,
          descripcion,
          fechaLimite,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setTitulo('');
      setDescripcion('');
      setFechaLimite(null);
      setCreada(true);
    } catch (error) {
      toast.error('Error al agregar tarea');
    }
  };

  const cerrarModal = () => {
    setCreada(false);
    onTareaAgregada();
  };

  return (
    <>
      <form className="agregar-tarea-form" onSubmit={handleSubmit}>
        <h3 className="agregar-tarea-title">
          <FaPlusCircle style={{ marginRight: '8px' }} /> Agregar Nueva Tarea
        </h3>
        <label className="input-label">Título</label>
        <input
          type="text"
          placeholder="Título de la tarea"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <label className="input-label">Descripción</label>
        <textarea
          placeholder="Descripción opcional"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={Math.max(3, descripcion.split('\n').length)}
        ></textarea>
        <label className="input-label">Fecha límite</label>
        <DatePicker
          selected={fechaLimite}
          onChange={(date) => setFechaLimite(date)}
          minDate={new Date()}
          dateFormat="dd/MM/yyyy"
          locale="es"
          placeholderText="Seleccionar fecha"
          className={`date-picker-input ${fechaInvalida ? 'input-error' : ''}`}
        />
        <br />
        <button type="submit">Agregar</button>
      </form>

      {creada && (
        <div className="modal-overlay">
          <div className="modal tarea-confirmacion">
            <FaCheckCircle size={48} color="#2ecc71" />
            <h4 className="modal-title">¡Tarea creada con éxito!</h4>
            <p>Tu tarea ha sido registrada correctamente.</p>
            <button onClick={cerrarModal} className="btn-confirm">Entendido</button>
          </div>
        </div>
      )}
    </>
  );
}

export default AgregarTarea;
