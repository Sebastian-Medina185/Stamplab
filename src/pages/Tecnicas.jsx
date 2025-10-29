import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa";
import { getTecnicas, createTecnica, updateTecnica, deleteTecnica } from "../Services/api-tecnicas/tecnicas";
import TecnicasForm from "./formularios_dash/TecnicasForm";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";

const Tecnicas = () => {
  const [search, setSearch] = useState("");
  const [tecnicas, setTecnicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tecnicaEdit, setTecnicaEdit] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTecnica, setSelectedTecnica] = useState(null);

  // Cargar técnicas al montar el componente
  useEffect(() => {
    loadTecnicas();
  }, []);

  // Función para cargar todas las técnicas
  const loadTecnicas = async () => {
    try {
      setLoading(true);
      const response = await getTecnicas();
      if (response) {
        setTecnicas(response);
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
      let response;
      
      if (tecnicaEdit) {
        // Actualizar
        response = await updateTecnica(tecnicaEdit.TecnicaID, tecnicaData);
      } else {
        // Crear nuevo
        response = await createTecnica(tecnicaData);
      }

      if (response.estado) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        });

        Toast.fire({
          icon: 'success',
          title: tecnicaEdit ? 'Técnica actualizada correctamente' : 'Técnica creada correctamente'
        });

        await loadTecnicas();
        handleCloseForm();
      } else {
        throw new Error(response.mensaje || 'Error al procesar la técnica');
      }
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
        const response = await deleteTecnica(tecnicaID);
        
        if (response.estado) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });

          await loadTecnicas();
          Toast.fire({
            icon: 'success',
            title: 'Técnica eliminada correctamente'
          });
        } else {
          throw new Error(response.mensaje || 'Error al eliminar la técnica');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('Error', error.response?.data?.mensaje || 'Error al eliminar la técnica', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar estado
  const handleCambiarEstado = async (tecnica) => {
    const nuevoEstado = !tecnica.Estado;
    const estadoTexto = nuevoEstado ? "Activo" : "Inactivo";

    try {
      const result = await Swal.fire({
        title: '¿Cambiar estado?',
        text: `¿Seguro que desea cambiar el estado de esta técnica a ${estadoTexto}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setLoading(true);
        const tecnicaActualizada = { ...tecnica, Estado: nuevoEstado };
        const response = await updateTecnica(tecnica.TecnicaID, tecnicaActualizada);
        
        if (response.estado) {
          await loadTecnicas();
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });

          Toast.fire({
            icon: 'success',
            title: `¡Estado cambiado a ${estadoTexto}!`
          });
        } else {
          throw new Error(response.mensaje || 'Error al cambiar el estado');
        }
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire(
        'Error',
        error.message || 'Error al cambiar el estado de la técnica',
        'error'
      );
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
                      className={`badge px-3 py-2 shadow-sm ${t.Estado ? "text-success fw-bold fs-6" : "text-danger fw-bold fs-6"
                        }`}
                    >
                      {t.Estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-circle"
                        title="Ver detalles"
                        onClick={() => {
                          setSelectedTecnica(t);
                          setShowDetailModal(true);
                        }}
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
                      <button 
                        className="btn btn-outline-secondary btn-sm rounded-circle" 
                        title="Cambiar estado"
                        onClick={() => handleCambiarEstado(t)}
                      >
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

      {/* Modal de Detalles de la Técnica */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
        className="fade"
        size="lg"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="modal-content border-0 shadow" style={{ overflow: 'hidden' }}>
          {selectedTecnica && (
            <>
              {/* Encabezado del Modal */}
              <div className="modal-header border-0 text-white"
                style={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                  padding: '20px'
                }}>
                <div className="d-flex align-items-center">
                  <div>
                    <h5 className="modal-title fw-bold mb-1">Detalles de la Técnica</h5>
                    <p className="mb-0 opacity-75" style={{ fontSize: '0.9rem' }}>
                      ID: {selectedTecnica.TecnicaID}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowDetailModal(false)}
                  aria-label="Close"
                />
              </div>

              {/* Cuerpo del Modal */}
              <div className="modal-body p-4">
                <div className="row g-1">
                  {/* Nombre de la Técnica */}
                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6">Nombre de la Técnica</label>
                      <h4 className="mb-0 fs-6 fw-normal">{selectedTecnica.Nombre}</h4>
                    </div>
                  </div>


                  {/* Descripción */}
                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6">Descripción</label>
                      <p className="mb-0 fs-6">{selectedTecnica.Descripcion}</p>
                    </div>
                  </div>


                  {/* Imagen de la Técnica */}
                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-2 fs-6">Imagen</label>
                      <div className="text-center">
                        {selectedTecnica.ImagenTecnica ? (
                          <img
                            src={selectedTecnica.ImagenTecnica}
                            alt={selectedTecnica.Nombre}
                            className="img-fluid rounded-3 shadow-sm"
                            style={{ maxHeight: '200px', objectFit: 'contain' }}
                          />
                        ) : (
                          <div className="text-muted py-4">
                            No hay imagen disponible
                          </div>
                        )}
                      </div>
                    </div>
                  </div>


                  {/* Estado */}
                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6">Estado</label>
                      <div className="d-flex align-items-center">
                        <span
                          className={`badge px-3 py-2 ${selectedTecnica.Estado ? 'bg-success' : 'bg-danger'
                            }`}
                          style={{ fontSize: '0.9rem' }}
                        >
                          {selectedTecnica.Estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pie del Modal */}
              <div className="modal-footer d-flex justify-content-center border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-danger px-4"
                  onClick={() => setShowDetailModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Tecnicas;
