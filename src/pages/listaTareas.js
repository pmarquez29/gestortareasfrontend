import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosTareasInstance';
import AgregarTarea from '../components/AgregarTarea';
import ListTareas from '../components/ListTareas';
import '../styles/ListaTareasPage.css';

function ListaTareas() {
  const [tareas, setTareas] = useState([]);
  const [paginadas, setPaginadas] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(5);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  const obtenerTareas = async (personalizadas = null) => {
    setCargando(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      };

      if (personalizadas) config.params = personalizadas;

      const res = await axios.get('/tareas', config);
      setTareas(res.data);
      setPagina(1);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('Error al obtener tareas');
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerTareas();
  }, []);

  useEffect(() => {
    const inicio = (pagina - 1) * porPagina;
    const fin = inicio + porPagina;
    setPaginadas(tareas.slice(inicio, fin));
  }, [pagina, tareas]);

  const totalPaginas = Math.ceil(tareas.length / porPagina);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <div className="lista-tareas-page">
      <header className="lista-header">
        <h2 className="lista-title">Mis Tareas</h2>

        <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <AgregarTarea onTareaAgregada={() => obtenerTareas()} />

      {cargando ? (
        <div className="loader">Cargando tareas...</div>
      ) : (
        <>
          <ListTareas
            tareas={paginadas}
            onActualizar={obtenerTareas}
            onFiltrado={setTareas}
          />
          <div className="paginacion">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i}
                onClick={() => setPagina(i + 1)}
                className={pagina === i + 1 ? 'pagina-activa' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ListaTareas;
