import { useState } from 'react';
import axios from '../api/axiosTareasInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/ModificarTarea.css';
import { FaCheckCircle } from 'react-icons/fa';

function ModificarTarea({ tarea, onCancel, onUpdated }) {
  const [titulo, setTitulo] = useState(tarea.titulo);
  const [descripcion, setDescripcion] = useState(tarea.descripcion);
  const [fechaLimite, setFechaLimite] = useState(tarea.fechaLimite?.split('T')[0] || '');
  const [estado, setEstado] = useState(tarea.completada);
  const [success, setSuccess] = useState(false);
  const [errorAnim, setErrorAnim] = useState(false);

  const handleGuardar = async (e) => {
    e.preventDefault();
    const hoy = new Date().toISOString().split('T')[0];

    if (!titulo.trim()) return toast.error('El título es obligatorio');
    if (!fechaLimite || fechaLimite < hoy || fechaLimite < tarea.fechaLimite.split('T')[0]) {
      return toast.error('La fecha límite debe ser igual o posterior a la actual y no menor a la fecha ya establecida');
    }

    const payload = {
      titulo,
      descripcion,
      fechaLimite,
    };

    if (parseInt(estado) !== tarea.completada) {
      payload.completada = parseInt(estado);
    }

    try {
      await axios.put(`/tareas/${tarea.id}`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSuccess(true);
      toast.success('Tarea actualizada con éxito');
      setTimeout(() => {
        setSuccess(false);
        onUpdated();
        onCancel();
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al actualizar tarea';
      setErrorAnim(true);
      toast.error(msg);
      setTimeout(() => setErrorAnim(false), 800);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal editar-modal">
        {success && (
          <div className="success-icon">
            <FaCheckCircle size={64} color="#2ecc71" />
          </div>
        )}
        <form className={`modificar-form ${errorAnim ? 'shake' : ''}`} onSubmit={handleGuardar}>
          <h3 className="modal-title">Editar Tarea</h3>
          <label className="input-label">Título</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
          <label className="input-label">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={Math.max(3, descripcion.split('\n').length)}
          />
          <label className="input-label">Fecha Límite</label>
          <input
            type="date"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]}
          />
          <label className="input-label">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="0">Pendiente</option>
            <option value="1">En Progreso</option>
            <option value="2">Completada</option>
          </select>
          <div className="btn-group">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModificarTarea;
