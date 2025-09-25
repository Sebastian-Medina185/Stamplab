import { useState, useEffect } from "react";
import RolesForm from "./formularios_dash/RolesForm";
import { FaPlusCircle, FaEye, FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa";
import { getRoles, createRol, updateRol, deleteRol } from "../Services/api-roles/roles";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rolEdit, setRolEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    console.log("Datos enviados al backend:", rolData); // Verifica los datos antes de enviarlos

    try {
      let response;
      if (rolEdit) {
        // Actualizar rol existente
        response = await updateRol(rolEdit.RolID, rolData);
      } else {
        // Crear nuevo rol
        response = await createRol(rolData);
      }

      if (response.estado) {
        // Recargar la lista de roles
        await loadRoles();
        setShowForm(false);
        setRolEdit(null);
        alert(rolEdit ? "Rol actualizado correctamente" : "Rol creado correctamente");
      } else {
        alert("Error al guardar rol: " + response.mensaje);
      }
    } catch (error) {
      console.error("Error al guardar rol:", error);
      alert("Error de conexión al guardar rol");
    }
  };

  const handleEdit = (rol) => {
    setRolEdit(rol);
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este rol?")) {
      try {
        const response = await deleteRol(id);
        if (response.estado) {
          // Recargar la lista de roles
          await loadRoles();
          alert("Rol eliminado correctamente");
        } else {
          alert("Error al eliminar rol: " + response.mensaje);
        }
      } catch (error) {
        console.error("Error al eliminar rol:", error);
        alert("Error de conexión al eliminar rol");
      }
    }
  };

  const handleCambiarEstado = async (rol) => {
    const nuevoEstado = !rol.Estado; // Cambiar true/false
    const estadoTexto = nuevoEstado ? "Activo" : "Inactivo";

    if (window.confirm(`¿Cambiar estado del rol a ${estadoTexto}?`)) {
      try {
        const rolActualizado = { ...rol, Estado: nuevoEstado };
        const response = await updateRol(rol.RolID, rolActualizado);
        if (response.estado) {
          await loadRoles();
          alert(`Estado cambiado a ${estadoTexto} correctamente`);
        } else {
          alert("Error al cambiar estado: " + response.mensaje);
        }
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert("Error de conexión al cambiar estado");
      }
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
                          title="Ver"
                          onClick={() => console.log("Ver rol:", r)}
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
                        <button className="btn btn-outline-secondary btn-sm rounded-circle" title="Cambiar estado">
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
    </div>
  );
};

export default Roles;