import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaPlusCircle, FaSync, FaTrash } from "react-icons/fa";
import { getTecnicas } from "../Services/api-tecncias/Tecnicas";
import TecnicaForm from "./formularios_dash/TecnicasForm";

const Tecnicas = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTecnica, setEditingTecnica] = useState(null);
  const [tecnicas, setTecnicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar las técnicas
  const fetchTecnicas = async () => {
    try {
      setLoading(true);
      const data = await getTecnicas();

      // Verificar que data.datos existe y es un array
      if (data && Array.isArray(data.datos)) {
        setTecnicas(data.datos);
      } else {
        console.warn(
          "Los datos recibidos no tienen la estructura esperada:",
          data
        );
        setTecnicas([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error al cargar técnicas:", err);
      setError("Error al cargar las técnicas");
      setTecnicas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTecnicas();
  }, []);

  // Función para manejar el cierre del formulario y actualizar la lista
  const handleFormClose = (shouldRefresh = false) => {
    setShowForm(false);
    setEditingTecnica(null);
    
    // Si se guardó/actualizó una técnica, recargar la lista
    if (shouldRefresh) {
      fetchTecnicas();
    }
  };

  // Función para abrir el formulario de edición
  const handleEdit = (tecnica) => {
    setEditingTecnica(tecnica);
    setShowForm(true);
  };

  // Función para filtrar técnicas
  const filteredTecnicas = tecnicas.filter((tecnica) => {
    if (!tecnica || typeof tecnica.Nombre !== "string") {
      return false;
    }
    return tecnica.Nombre.toLowerCase().includes(search.toLowerCase());
  });

  if (loading && tecnicas.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100dvh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #ffffff 0%, #fafcff 100%)",
      }}
    >
      {/* Encabezado y botón agregar */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3 px-4">
        <h1
          className="fs-4 fw-bold mb-0 text-primary"
          style={{ letterSpacing: 1 }}
        >
          Gestión de Técnicas
        </h1>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={() => {
            setEditingTecnica(null);
            setShowForm(true);
          }}
        >
          <FaPlusCircle size={22} />
          Agregar Técnica
        </button>
      </div>

      {showForm ? (
        <TecnicaForm 
          onClose={handleFormClose}
          tecnica={editingTecnica}
        />
      ) : (
        <>
          {/* Buscador */}
          <div className="d-flex justify-content-end mb-3 px-4">
            <div className="input-group" style={{ maxWidth: 300 }}>
              <span className="input-group-text bg-white border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Filtrar técnicas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Mostrar error si existe */}
          {error && (
            <div className="alert alert-danger mx-4" role="alert">
              {error}
            </div>
          )}

          {/* Tabla con estilo */}
          <div
            className="flex-grow-1 px-4 pb-4"
            style={{ overflow: "auto", minHeight: 0 }}
          >
            <div
              className="table-responsive rounded-4 shadow"
              style={{ background: "#fff" }}
            >
              <table className="table align-middle mb-0">
                <thead
                  style={{
                    background:
                      "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                    color: "#fff",
                  }}
                >
                  <tr>
                    <th style={{ borderTopLeftRadius: 16 }}>ID</th>
                    <th>Nombre Técnica</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th style={{ borderTopRightRadius: 16 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan="5" className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!loading && filteredTecnicas.length > 0 ? (
                    filteredTecnicas.map((tecnica, index) => (
                      <tr
                        key={tecnica.TecnicaID || index}
                        style={{ borderBottom: "1px solid #e3e8ee" }}
                      >
                        <td>
                          <span
                            className="badge bg-light text-dark px-3 py-2 shadow-sm"
                            style={{ fontSize: 15 }}
                          >
                            {tecnica.TecnicaID || index + 1}
                          </span>
                        </td>
                        <td className="fw-medium">
                          {tecnica.Nombre || "Sin nombre"}
                        </td>
                        <td>
                          <span
                            className="text-muted"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              maxWidth: "300px",
                            }}
                          >
                            {tecnica.Descripcion || "Sin descripción"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge fw-bold fs-6 px-1 py-2 shadow-sm ${
                              tecnica.Estado === 1 || tecnica.Estado === true
                                ? "text-success"
                                : "text-danger"
                            }`}
                            style={{ fontSize: 14 }}
                          >
                            {tecnica.Estado === 1 || tecnica.Estado === true ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm rounded-circle"
                              title="Ver"
                              onClick={() => {
                                // Implementar función ver
                                console.log('Ver técnica:', tecnica);
                              }}
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              className="btn btn-outline-warning btn-sm rounded-circle"
                              title="Editar"
                              onClick={() => handleEdit(tecnica)}
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm rounded-circle"
                              title="Eliminar"
                              onClick={() => {
                                // Implementar función eliminar
                                if (window.confirm('¿Estás seguro de eliminar esta técnica?')) {
                                  console.log('Eliminar técnica:', tecnica);
                                }
                              }}
                            >
                              <FaTrash size={16} />
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm rounded-circle"
                              title="Cambiar estado"
                              onClick={() => {
                                // Implementar función cambiar estado
                                console.log('Cambiar estado:', tecnica);
                              }}
                            >
                              <FaSync size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : !loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        {search
                          ? "No se encontraron técnicas que coincidan con la búsqueda"
                          : "No hay técnicas disponibles"}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tecnicas;