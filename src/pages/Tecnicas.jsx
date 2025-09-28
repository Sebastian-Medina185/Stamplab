import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa";
import { getTecnicas, createTecnica, updateTecnica, deleteTecnica } from "../Services/api-tecnicas/tecnicas";
import TecnicasForm from "./formularios_dash/TecnicasForm";
import Swal from "sweetalert2";

const Tecnicas = () => {
  const [search, setSearch] = useState("");
  const [tecnicas, setTecnicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tecnicaEdit, setTecnicaEdit] = useState(null);

  // Cargar técnicas al montar el componente
  useEffect(() => {
    loadTecnicas();
  }, []);

  // Función para cargar todas las técnicas
  const loadTecnicas = async () => {
    try {
      setLoading(true);
      const response = await getTecnicas();
      if (response.estado) {
        setTecnicas(response.datos);
      } else {
        setError(response.mensaje);
      }
    } catch (err) {
      setError("Error al cargar las técnicas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = tecnicas.filter((t) =>
    t.Nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Función para abrir formulario de agregar
  const handleAgregar = () => {
    setTecnicaEdit(null);
    setShowForm(true);
  };

  // Función para abrir formulario de editar
  const handleEditar = (tecnica) => {
    setTecnicaEdit(tecnica);
    setShowForm(true);
  };

  // Función para cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setTecnicaEdit(null);
  };

  // Función para manejar el guardado
  const handleSave = async (tecnicaData) => {
    try {
      setLoading(true);
      if (tecnicaEdit) {
        // Actualizar
        await updateTecnica(tecnicaEdit.TecnicaID, tecnicaData);
        Swal.fire('¡Éxito!', 'Técnica actualizada correctamente', 'success');
      } else {
        // Crear nuevo
        await createTecnica(tecnicaData);
        Swal.fire('¡Éxito!', 'Técnica creada correctamente', 'success');
      }
      handleCloseForm();
      await loadTecnicas();
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', error.response?.data?.mensaje || 'Error al procesar la técnica', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar
  const handleEliminar = async (tecnicaID) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede revertir",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setLoading(true);
        await deleteTecnica(tecnicaID);
        await loadTecnicas();
        Swal.fire('¡Eliminado!', 'La técnica ha sido eliminada.', 'success');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', error.response?.data?.mensaje || 'Error al eliminar la técnica', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Renderizado condicional del formulario
  if (showForm) {
    return (
      <TecnicasForm
        onClose={handleCloseForm}
        onSave={handleSave}
        tecnicaEdit={tecnicaEdit}
      />
    );
  }

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #ffffffff 0%, #fafcff 100%)",
        padding: "20px 30px",
        fontSize: "0.9rem",
      }}
    >
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="fs-5 fw-bold mb-0 text-primary" style={{ letterSpacing: 1 }}>
          Gestión de Técnicas
        </h1>
        <button
          className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={handleAgregar}
        >
          <FaPlusCircle size={18} />
          Agregar Técnica
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex justify-content-end mb-3">
        <div className="input-group input-group-sm" style={{ maxWidth: 260 }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Buscar técnica..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla con botones funcionando */}
      <div className="flex-grow-1" style={{ overflow: "auto", minHeight: 0 }}>
        <div
          className="table-responsive rounded-4 shadow-sm"
          style={{ background: "#fff" }}
        >
          <table className="table table-sm align-middle mb-0">
            <thead
              style={{
                background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                color: "#fff",
                fontSize: "0.85rem",
              }}
            >
              <tr>
                <th style={{ borderTopLeftRadius: 12 }}>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    No hay técnicas para mostrar.
                  </td>
                </tr>
              )}
              {filtered.map((t) => (
                <tr key={t.TecnicaID} style={{ borderBottom: "1px solid #e3e8ee" }}>
                  <td className="fw-medium">{t.Nombre}</td>
                  <td>{t.Descripcion}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 shadow-sm ${t.Estado ? "text-success fw-bold fs-6" : "text-secondary fw-bold fs-6"
                        }`}
                    >
                      {t.Estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-circle"
                        title="Ver"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        className="btn btn-outline-warning btn-sm rounded-circle"
                        title="Editar"
                        onClick={() => handleEditar(t)}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm rounded-circle"
                        title="Eliminar"
                        onClick={() => handleEliminar(t.TecnicaID)}
                      >
                        <FaTrash size={14} />
                      </button>
                      <button className="btn btn-outline-secondary btn-sm rounded-circle" title="Cambiar estado">
                        <FaSyncAlt size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tecnicas;
