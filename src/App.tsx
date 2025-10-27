import { useState, useEffect} from 'react';
import axios from 'axios';
// Asegúrate de crear e importar tu archivo CSS
import './App.css';

const App = () => {
  // Estado para controlar qué opción del sidebar está activa
  const [activeContent, setActiveContent] = useState('inicio');
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatriculas = async () => {
    try {
      // Petición a la URL de tu backend
      // const response = await axios.get("http://localhost:3000/matricula/");
      // const response = await axios.get("http://54.145.248.126:3000/matricula/");
      const response = await axios.get("/matricula/");

      setMatriculas(response.data); // Asume que el backend devuelve un array en response.data
      setError(null);
    } catch (err) {
      console.error("Error al obtener matrículas:", err);
      // setError("No se pudo conectar al servidor (Verifica CORS y la URL).");
      setMatriculas([]); // Vaciar la lista si hay error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeContent === "matriculas-registradas") {
      fetchMatriculas();
    }
  }, [activeContent]);
  // Opciones de ejemplo para los campos select del formulario
  const carreras = ['Ingeniería de Sistemas', 'Medicina', 'Arquitectura', 'Derecho'];
  const ciclos = ['I', 'II', 'III', 'IV', 'V','VI','VII','VIII', 'IX', 'X'];
  const cursos = ['Matemática Básica', 'Programación I', 'Física', 'Química General'];

  // Estado para manejar los datos del formulario (opcional, para una simulación)
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    codigoAlumno: '',
    carreraProfesional: carreras[0],
    ciclo: ciclos[0],
    cursos: cursos[0],
  });

  const handleFormChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    
    // 1. Mapear los datos de camelCase a snake_case para el Backend
    const dataToSend = {
        nombre: formData.nombres,
        apellido: formData.apellidos,
        codigo_alumno: formData.codigoAlumno,
        carrera_profesional: formData.carreraProfesional,
        ciclo: formData.ciclo,
        curso: formData.cursos, // Asumo que el backend espera 'curso' en singular
    };
    try {
      // const response = await axios.post("http://localhost:3000/matricula/",dataToSend)
      // const response = await axios.post("http://54.145.248.126:3000/matricula/",dataToSend)
      const response = await axios.post("/matricula/",dataToSend)
      console.log('Matrícula creada:', response.data);
      alert(`Matrícula de ${formData.nombres} ${formData.apellidos} registrada con éxito.`);
      await fetchMatriculas();
      //limpiar formulario
      setFormData({
        nombres: "",
        apellidos: "",
        codigoAlumno: "",
        carreraProfesional: carreras[0],
        ciclo: ciclos[0],
        cursos: cursos[0],
      });
      // Muestra la lista de matrículas registradas
      //setActiveContent('matriculas-registradas');
    } catch (error) {
      console.error("Error al registrar la matrícula:", error);
      alert("Hubo un error al registrar la matrícula. Verifica la consola y CORS.");
    }
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'carreras':
        return (
          <div className="content-area">
            <h2>Carreras Profesionales</h2>
            <p>Información sobre las carreras que ofrece la Universidad Peruana Unión.</p>
            <ul>
              {carreras.map((carrera, index) => (
                <li key={index}>{carrera}</li>
              ))}
            </ul>
          </div>
        );
      case 'matricula':
        return (
          <div className="content-area">
            <h2>Formulario de Matrícula</h2>
            <form className="matricula-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="nombres">Nombres:</label>
                <input
                  type="text"
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="apellidos">Apellidos:</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="codigoAlumno">Código Alumno:</label>
                <input
                  type="text"
                  id="codigoAlumno"
                  name="codigoAlumno"
                  value={formData.codigoAlumno}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="carreraProfesional">Carrera Profesional:</label>
                <select
                  id="carreraProfesional"
                  name="carreraProfesional"
                  value={formData.carreraProfesional}
                  onChange={handleFormChange}
                  required
                >
                  {carreras.map((carrera, index) => (
                    <option key={index} value={carrera}>
                      {carrera}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ciclo">Ciclo:</label>
                <select
                  id="ciclo"
                  name="ciclo"
                  value={formData.ciclo}
                  onChange={handleFormChange}
                  required
                >
                  {ciclos.map((ciclo, index) => (
                    <option key={index} value={ciclo}>
                      {ciclo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cursos">Cursos:</label>
                <select
                  id="cursos"
                  name="cursos"
                  value={formData.cursos}
                  onChange={handleFormChange}
                  required
                >
                  {cursos.map((curso, index) => (
                    <option key={index} value={curso}>
                      {curso}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="submit-button">
                Registrar Matrícula
              </button>
            </form>
          </div>
        );
      case 'matriculas-registradas':
        return (
          <div className="content-area">
            <h2>Matrículas Registradas ({matriculas.length})</h2>
            {loading && <p>Cargando matrículas desde el servidor...</p>}
            {error && <p className="error-message">{error}</p>}
            {matriculas.length === 0 ? (
              <p>No hay matrículas registradas aún.</p>
            ) : (
              <div className="table-container">
                <table className="matriculas-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombres y Apellidos</th>
                      <th>Código</th>
                      <th>Carrera</th>
                      <th>Ciclo</th>
                      <th>Cursos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matriculas.map((m: any) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td>{m.nombre} {m.apellido}</td>
                        <td>{m.codigo_alumno}</td>
                        <td>{m.carrera_profesional}</td>
                        <td>{m.ciclo}</td>
                        <td>{m.curso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'inicio':
      default:
        return (
          <div className="content-area">
            <h2>Bienvenido a la Universidad Peruana Unión 🎓</h2>
            <p>
              Utiliza el menú lateral para navegar entre las opciones: Inicio,
              Carreras Profesionales y el Formulario de Matrícula.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="layout-container">
      {/* Navbar */}
      <header className="navbar">
        <div className="navbar-title">
          Universidad Peruana Unión
        </div>
      </header>

      <div className="main-content-wrapper">
        {/* Sidebar */}
        <nav className="sidebar">
          <ul>
            <li
              className={activeContent === 'inicio' ? 'active' : ''}
              onClick={() => setActiveContent('inicio')}
            >
              Inicio
            </li>
            <li
              className={activeContent === 'carreras' ? 'active' : ''}
              onClick={() => setActiveContent('carreras')}
            >
              Carreras Profesionales
            </li>
            <li
              className={activeContent === 'matricula' ? 'active' : ''}
              onClick={() => setActiveContent('matricula')}
            >
              Matrícula
            </li>
            <li
              className={activeContent === 'matriculas-registradas' ? 'active' : ''}
              onClick={() => setActiveContent('matriculas-registradas')}
            >
              Matrículas Registradas
            </li>
          </ul>
        </nav>

        {/* Contenido Principal (donde se renderiza el formulario) */}
        <main className="content-container">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;

// Nota: Recuerda importar y usar este componente en tu App.jsx o index.jsx