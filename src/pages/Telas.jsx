import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaPlusCircle, FaTrash } from "react-icons/fa";
import TelasForm from "./formularios_dash/TelasForm";
import { getTelas, deleteTela } from "../Services/api-telas/telas.js";

const Telas = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [telas, setTelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [telaEdit, setTelaEdit] = useState(null);

  // ========== Cargar telas ==========
  const fetchTelas = async () => {
    try {
      setLoading(true);
      const data = await getTelas();
      if (data && Array.isArray(data.datos)) {
        setTelas(data.datos);
      } else {
        console.warn("Los datos recibidos no tienen la estructura esperada:", data);
        setTelas([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error al cargar telas:", err);
      setError("Error al cargar las telas");
      setTelas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelas();
  }, []);

  // ========== Guardar (crear/editar) ==========
  const handleSave = async () => {
    await fetchTelas();
    setShowForm(false);
    setTelaEdit(null);
  };

  // ========== Editar ==========
  const handleEdit = (tela) => {
    setTelaEdit(tela);
    setShowForm(true);
  };

  // ========== Eliminar ==========
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tela?")) return;
    try {
      const result = await deleteTela(id);
      if (result.estado) {
        alert("Tela eliminada correctamente");
        fetchTelas();
      } else {
        alert("Error: " + result.mensaje);
      }
    } catch (error) {
      console.error("Error eliminando tela:", error);
      alert("Error de conexión al eliminar");
    }
  };

  // ========== Filtrar ==========
  const filteredTelas = telas.filter((tela) =>
    tela?.Nombre?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100dvh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // ========== Mostrar formulario ==========
  if (showForm) {
    return (
      <TelasForm
        onClose={() => {
          setShowForm(false);
          setTelaEdit(null);
        }}
        onSave={handleSave}
        telaEdit={telaEdit}
      />
    );
  }

  // ========== Listado ==========
  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #ffffff 0%, #fafcff 100%)",
      }}
    >
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3 px-4">
        <h1 className="fs-4 fw-bold mb-0 text-primary" style={{ letterSpacing: 1 }}>
          Gestión de Telas
        </h1>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={() => {
            setTelaEdit(null);
            setShowForm(true);
          }}
        >
          <FaPlusCircle size={22} />
          Agregar Tela
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex justify-content-end mb-3 px-4">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Filtrar telas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger mx-4" role="alert">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="flex-grow-1 px-4 pb-4" style={{ overflow: "auto", minHeight: 0 }}>
        <div className="table-responsive rounded-4 shadow" style={{ background: "#fff" }}>
          <table className="table align-middle mb-0">
            <thead
              style={{
                background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                color: "#fff",
              }}
            >
              <tr>
                <th style={{ borderTopLeftRadius: 16 }}>ID</th>
                <th>Nombre de la Tela</th>
                <th style={{ borderTopRightRadius: 16 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTelas.length > 0 ? (
                filteredTelas.map((tela, index) => (
                  <tr key={tela.TelaID || index} style={{ borderBottom: "1px solid #e3e8ee" }}>
                    <td>
                      <span
                        className="badge bg-light text-dark px-3 py-2 shadow-sm"
                        style={{ fontSize: 15 }}
                      >
                        {tela.TelaID || index + 1}
                      </span>
                    </td>
                    <td className="fw-medium">{tela.Nombre || "Sin nombre"}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-outline-warning btn-sm rounded-circle"
                          title="Editar"
                          onClick={() => handleEdit(tela)}
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-circle"
                          title="Eliminar"
                          onClick={() => handleDelete(tela.TelaID)}
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-muted">
                    {search
                      ? "No se encontraron telas que coincidan con la búsqueda"
                      : "No hay telas disponibles"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Telas;