import { useState, useEffect } from "react";
import RolesForm from "./formularios_dash/RolesForm";
import { FaPlusCircle, FaEye, FaEdit, FaTrash, FaSyncAlt, FaUserShield, FaTimes } from "react-icons/fa";
import { getRoles, createRol, updateRol, deleteRol } from "../Services/api-roles/roles";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rolEdit, setRolEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);

  // Cargar roles al montar el componente
  useEffect(() => {
    loadRoles();
  }, []);

  // Función para cargar todos los roles
  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await getRoles();
      if (response.estado) {
        setRoles(response.datos);
      } else {
        setError("Error al cargar roles");
      }
    } catch (error) {
      console.error("Error al cargar roles:", error);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar rol (crear o actualizar)
  const handleSave = async (rolData) => {
    try {
      setLoading(true);
      let response;
      
      if (rolEdit) {
        // Actualizar rol existente
        response = await updateRol(rolEdit.RolID, rolData);
      } else {
        // Crear nuevo rol
        response = await createRol(rolData);
      }

      if (response.estado) {
        await loadRoles();
        setShowForm(false);
        setRolEdit(null);
        
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: rolEdit ? 'Rol actualizado correctamente' : 'Rol creado correctamente',
          confirmButtonColor: '#3085d6'
        });
      } else {
        throw new Error(response.mensaje || 'Error al guardar el rol');
      }
    } catch (error) {
      console.error("Error al guardar rol:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error al guardar el rol'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rol) => {
    setRolEdit(rol);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar rol?',
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
        const response = await deleteRol(id);
        
        if (response.estado) {
          await loadRoles();
          Swal.fire(
            '¡Eliminado!',
            'El rol ha sido eliminado correctamente',
            'success'
          );
        } else {
          throw new Error(response.mensaje || 'Error al eliminar el rol');
        }
      }
    } catch (error) {
      console.error("Error al eliminar rol:", error);
      Swal.fire(
        'Error',
        error.message || 'Error al eliminar el rol',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarEstado = async (rol) => {
    const nuevoEstado = !rol.Estado;
    const estadoTexto = nuevoEstado ? "Activo" : "Inactivo";

    try {
      const result = await Swal.fire({
        title: '¿Cambiar estado?',
        text: `¿Seguro que desea cambiar el estado de este rol a ${estadoTexto}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setLoading(true);
        const rolActualizado = { ...rol, Estado: nuevoEstado };
        const response = await updateRol(rol.RolID, rolActualizado);
        
        if (response.estado) {
          await loadRoles();
          Swal.fire(
            '¡Actualizado!',
            `El estado del rol ha sido cambiado a ${estadoTexto}`,
            'success'
          );
        } else {
          throw new Error(response.mensaje || 'Error al cambiar el estado');
        }
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire(
        'Error',
        error.message || 'Error al cambiar el estado del rol',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setRolEdit(null);
  };

  // Si el formulario está abierto, mostrar solo el formulario
  if (showForm) {
    return (
      <RolesForm
        onClose={handleCloseForm}
        onSave={handleSave}
        rolEdit={rolEdit}
      />
    );
  }

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
      {/* Encabezado y botón agregar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1
          className="fs-5 fw-bold mb-0 text-primary"
          style={{ letterSpacing: 1 }}
        >
          Gestión de Roles
        </h1>
        <button
          className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={() => {
            setRolEdit(null);
            setShowForm(true);
          }}
        >
          <FaPlusCircle size={18} />
          Agregar Rol
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={loadRoles}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Tabla con scroll interno */}
      <div className="flex-grow-1" style={{ overflow: "auto", minHeight: 0 }}>
        <div
          className="table-responsive rounded-4 shadow-sm"
          style={{ background: "#fff" }}
        >
          <table className="table table-sm align-middle mb-0">
            <thead
              style={{
                background:
                  "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                color: "#fff",
                fontSize: "0.85rem",
              }}
            >
              <tr>
                <th style={{ borderTopLeftRadius: 12 }}>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <span className="ms-2 text-muted">Cargando roles...</span>
                  </td>
                </tr>
              ) : roles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    No hay roles para mostrar.
                  </td>
                </tr>
              ) : (
                roles.map((r) => (
                  <tr key={r.RolID} style={{ borderBottom: "1px solid #e3e8ee" }}>
                    <td>
                      <span className="badge bg-light text-dark px-2 py-1 shadow-sm">
                        {r.RolID}
                      </span>
                    </td>
                    <td className="fw-medium">{r.Nombre}</td>
                    <td>{r.Descripcion}</td>
                    <td>
                      <span className={`badge px-2 py-2 shadow-sm ${r.Estado ? 'text-success fw-bold fs-6' : 'text-danger fw-bold fs-6'}`}>
                        {r.Estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-1">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-circle"
                          title="Ver detalles"
                          onClick={() => {
                            setSelectedRol(r);
                            setShowDetailModal(true);
                          }}
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm rounded-circle"
                          title="Editar"
                          onClick={() => handleEdit(r)}
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-circle"
                          title="Eliminar"
                          onClick={() => handleEliminar(r.RolID)}
                        >
                          <FaTrash size={14} />
                        </button>
                        <button 
                          className="btn btn-outline-secondary btn-sm rounded-circle" 
                          title="Cambiar estado"
                          onClick={() => handleCambiarEstado(r)}
                        >
                          <FaSyncAlt size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalles del Rol */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
        className="fade"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="modal-content border-0 shadow" style={{ overflow: 'hidden' }}>
          {selectedRol && (
            <>
              {/* Encabezado del Modal */}
              <div className="modal-header border-0 text-white" 
                style={{ 
                  background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                  padding: '20px'
                }}>
                <div className="d-flex align-items-center">
                  <div>
                    <h5 className="modal-title fw-bold mb-1">Detalles del Rol</h5>
                    <p className="mb-0 opacity-75" style={{ fontSize: '0.9rem' }}>
                      ID: {selectedRol.RolID}
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
                  {/* Nombre del Rol */}
                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6">Nombre del Rol</label>
                      <h4 className="mb-0 fs-6 fw-normal">{selectedRol.Nombre}</h4>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6" style={{ fontSize: '0.85rem' }}>Descripción</label>
                      <p className="mb-0 fs-6">{selectedRol.Descripcion}</p>
                    </div>
                  </div>

                  {/* Estado */}
                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6">Estado</label>
                      <div className="d-flex align-items-center">
                        <span 
                          className={`badge px-3 py-2 ${
                            selectedRol.Estado ? 'bg-success' : 'bg-danger'
                          }`}
                          style={{ fontSize: '0.9rem' }}
                        >
                          {selectedRol.Estado ? 'Activo' : 'Inactivo'}
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

export default Roles;