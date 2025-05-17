import { useState } from 'react';
import axios from '../api/axiosTareasInstance';
import ModificarTarea from './ModificarTarea';
import { FaEdit, FaTrash, FaFilter, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import '../styles/ListTareas.css';

function ListTareas({ tareas, onActualizar, onFiltrado }) {

  const [editandoId, setEditandoId] = useState(null);
  const [estado, setEstado] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [q, setQ] = useState('');
  const [tareaAEliminar, setTareaAEliminar] = useState(null);

  const confirmarEliminar = async () => {
    try {
      await axios.delete(`/tareas/${tareaAEliminar.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Tarea eliminada con éxito');
      setTareaAEliminar(null);
      onActualizar();
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al eliminar la tarea';
      alert(msg);
    }
  };

  const filtrarTareas = async () => {
    try {
      const params = {};
      if (estado !== '') params.estado = parseInt(estado);
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;
      if (q.trim()) params.q = q.trim();

      const res = await axios.get('/tareas', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        params,
      });

      onFiltrado(res.data);
    } catch (err) {
      alert('Error al filtrar tareas');
    }
  };

  const limpiarFiltros = () => {
    setEstado('');
    setDesde('');
    setHasta('');
    setQ('');
    onActualizar();
  };

  return (
    <div className="tareas-container">
      <div className="filtros">
        <div className="filtro-grupo">
          <label>Estado:</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="0">Pendiente</option>
            <option value="1">En Progreso</option>
            <option value="2">Completada</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Desde:</label>
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </div>

        <div className="filtro-grupo">
          <label>Hasta:</label>
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </div>

        <div className="filtro-grupo">
          <label>Búsqueda:</label>
          <input type="text" placeholder="Buscar por título o descripción..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <div className="filtro-botones">
          <button onClick={filtrarTareas} className="btn-filtrar">
            <FaFilter /> Filtrar
          </button>
          <button onClick={limpiarFiltros} className="btn-limpiar">
            <FaTimes /> Limpiar
          </button>
        </div>
      </div>


      <p className="total">Total: {tareas.length} tareas</p>

      {tareas.length === 0 ? (
        <p className="no-tareas">No hay tareas para mostrar.</p>
      ) : (
        <ul className="lista-tareas">
          {tareas.map((tarea) => (
            <li key={tarea.id} className={`tarea-item estado-${tarea.completada}`}>
              {editandoId === tarea.id ? (
                <ModificarTarea tarea={tarea} onCancel={() => setEditandoId(null)} onUpdated={onActualizar} />
              ) : (
                <>
                  <div className="tarea-info">
                    <strong>{tarea.titulo}</strong>
                    <p>{tarea.descripcion}</p>
                    <span className="estado">{['Pendiente', 'En progreso', 'Completada'][tarea.completada]}</span>
                    <p className="fecha-limite">
                      {tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : 'Sin fecha límite'}
                    </p>
                  </div>
                  <div className="tarea-actions">
                    <button onClick={() => setEditandoId(tarea.id)} title="Editar">
                      <FaEdit />
                    </button>
                    {tarea.completada === 2 && (
                      <button onClick={() => setTareaAEliminar(tarea)} title="Eliminar">
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      {tareaAEliminar && (
        <div className="modal-overlay">
          <div className="modal eliminar-modal">
            <FaExclamationTriangle size={48} color="#e74c3c" />
            <h4 className="modal-title">¿Eliminar esta tarea?</h4>
            <p className="modal-text"><strong>{tareaAEliminar.titulo}</strong></p>
            <p className="modal-text">{tareaAEliminar.descripcion}</p>
            <div className="modal-actions">
              <button className="btn-confirm" onClick={confirmarEliminar}>Sí, eliminar</button>
              <button className="btn-cancel" onClick={() => setTareaAEliminar(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListTareas;
