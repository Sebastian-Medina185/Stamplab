import { useState, useEffect } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa";
import ProveedoresForm from './formularios_dash/ProveedoresForm';
import { 
    getProveedores, 
    createProveedor, 
    updateProveedor, 
    deleteProveedor,
    cambiarEstadoProveedor
} from "../Services/api-proveedores/proveedores.js";
import Swal from 'sweetalert2';
import { Modal } from 'react-bootstrap';

const Proveedores = () => {
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProveedores();

      if (response) {
        setProveedores(response);
      } else {
        setError('Error al cargar los proveedores');
      }
    } catch (err) {
      console.error("Error cargando proveedores:", err);
      setError('Error de conexión al cargar proveedores');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregar = () => {
    setSelectedProveedor(null);
    setShowForm(true);
  };

  const handleEditar = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowForm(true);
  };

  const handleCloseForm = (proveedorActualizado = false) => {
    setShowForm(false);
    setSelectedProveedor(null);
    if (proveedorActualizado) {
      cargarProveedores();
    }
  };

  const handleEliminar = async (nit) => {
  try {
    const result = await Swal.fire({
      title: '¿Está seguro?',
      text: "Si el proveedor tiene compras asociadas, solo se desactivará",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const response = await deleteProveedor(nit);
      
      if (response.estado) {
        await cargarProveedores();
        
        // ✅ CORRECCIÓN: Detectar si fue eliminado o desactivado
        const accion = response.data?.accion || response.accion;
        
        if (accion === 'desactivado') {
          // Mostrar mensaje de desactivación
          Swal.fire({
            icon: 'info',
            title: 'Proveedor Desactivado',
            html: `
              <p class="mb-2">${response.mensaje || 'El proveedor tiene compras asociadas y ha sido desactivado.'}</p>
              <small class="text-muted">No se puede eliminar porque tiene historial de compras.</small>
            `,
          });
        } else {
          // Mostrar mensaje de eliminación exitosa
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El proveedor ha sido eliminado correctamente'
          });
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire('Error', error.message || 'Error al eliminar el proveedor', 'error');
  }
};
  const handleCambiarEstado = async (proveedor) => {
    try {
      const estadoActual = proveedor.Estado === true || proveedor.Estado === "Activo";
      const nuevoEstado = !estadoActual;
      const estadoTexto = nuevoEstado ? "Activo" : "Inactivo";

      const result = await Swal.fire({
        title: '¿Cambiar estado?',
        text: `¿Seguro que desea cambiar el estado de este proveedor a ${estadoTexto}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        setLoading(true);

        try {
          const response = await cambiarEstadoProveedor(proveedor.Nit, nuevoEstado);
          if (response.estado) {
            await cargarProveedores();
            Swal.fire(
              '¡Actualizado!',
              `El estado del proveedor ha sido cambiado a ${estadoTexto}`,
              'success'
            );
          } else {
            throw new Error(response.mensaje || 'Error al cambiar el estado');
          }
        } catch (patchError) {
          console.warn("PATCH falló, intentando actualización completa:", patchError);
          const updatedData = {
            ...proveedor,
            Estado: nuevoEstado
          };
          const response = await updateProveedor(proveedor.Nit, updatedData);
          if (response.estado) {
            await cargarProveedores();
            Swal.fire(
              '¡Actualizado!',
              `El estado del proveedor ha sido cambiado a ${estadoTexto}`,
              'success'
            );
          } else {
            throw new Error(response.mensaje || 'Error al cambiar el estado');
          }
        }
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      Swal.fire(
        'Error',
        error.message || 'Error al cambiar el estado del proveedor',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (proveedorData) => {
    try {
        setLoading(true);
        
        if (selectedProveedor) {
            // Actualizar proveedor existente
            const response = await updateProveedor(selectedProveedor.Nit, proveedorData);
            
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: response.mensaje || 'Proveedor actualizado correctamente'
            });
            setShowForm(false);
            await cargarProveedores();
        } else {
            // Crear nuevo proveedor
            const response = await createProveedor(proveedorData);
            
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: response.mensaje || 'Proveedor creado correctamente'
            });
            setShowForm(false);
            await cargarProveedores();
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Ocurrió un error al procesar la solicitud'
        });
    } finally {
        setLoading(false);
    }
  };

  const filtered = proveedores.filter(
    (proveedor) =>
      proveedor.Nombre.toLowerCase().includes(searchName.toLowerCase()) &&
      (searchStatus === "" || 
       proveedor.Estado === (searchStatus.toLowerCase() === "activo"))
  );

  if (showForm) {
    return (
        <ProveedoresForm
            onClose={handleCloseForm}
            onSave={handleSave}
            proveedor={selectedProveedor}
        />
    );
  }

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #ffffffff 0%, #fafcff 100%)",
      }}
    >
      {/* Encabezado y botón agregar */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3 px-4">
        <h1
          className="fs-4 fw-bold mb-0 text-primary"
          style={{ letterSpacing: 1 }}
        >
          Gestión de Proveedores
        </h1>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={handleAgregar}
        >
          <FaPlusCircle size={22} />
          Agregar Proveedor
        </button>
      </div>

      {/* Filtros */}
      <div className="d-flex justify-content-around mb-3 px-4 gap-3 flex-wrap">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Filtrar por nombre"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Filtrar por estado"
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla con estilo */}
      <div
        className="flex-grow-1 px-4 pb-4"
        style={{ overflow: "auto", minHeight: 0 }}
      >
        <div
          className="table-responsive rounded-4 shadow text-center"
          style={{ background: "#fff" }}
        >
          <table className="table align-middle mb-0">
            <thead
              style={{
                background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                color: "#fff",
              }}
            >
              <tr>
                <th style={{ borderTopLeftRadius: 16 }}>Nit Proveedor</th>
                <th>Nombre Proveedor</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th style={{ borderTopRightRadius: 16 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-danger">
                    {error}
                    <br />
                    <button
                      className="btn btn-outline-primary btn-sm mt-2"
                      onClick={cargarProveedores}
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    {proveedores.length === 0
                      ? "No hay proveedores registrados."
                      : "No se encontraron proveedores con los filtros aplicados."
                    }
                  </td>
                </tr>
              ) : (
                filtered.map((proveedor) => (
                  <tr key={proveedor.Nit} style={{ borderBottom: "1px solid #e3e8ee" }}>
                    <td>
                      <span
                        className="badge bg-light text-dark px-3 py-2 shadow-sm"
                        style={{ fontSize: 15 }}
                      >
                        {proveedor.Nit}
                      </span>
                    </td>
                    <td className="fw-medium">{proveedor.Nombre}</td>
                    <td>{proveedor.Correo}</td>
                    <td>{proveedor.Telefono}</td>
                    <td>{proveedor.Direccion}</td>
                    <td>
                      <span
                        className={`badge fw-bold fs-6 px-1 py-2 shadow-sm ${proveedor.Estado === true || proveedor.Estado === "Activo"
                          ? "text-success"
                          : "text-danger"
                          }`}
                        style={{ fontSize: 14 }}
                      >
                        {proveedor.Estado === true || proveedor.Estado === "Activo" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-circle"
                          title="Ver"
                          onClick={() => {
                            setSelectedProveedor(proveedor);
                            setShowDetailModal(true);
                          }}
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm rounded-circle"
                          title="Editar"
                          onClick={() => handleEditar(proveedor)}
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-circle"
                          title="Eliminar"
                          onClick={() => handleEliminar(proveedor.Nit)}
                        >
                          <FaTrash size={16} />
                        </button>
                        <button 
                          className="btn btn-outline-secondary btn-sm rounded-circle" 
                          title="Cambiar estado"
                          onClick={() => handleCambiarEstado(proveedor)}
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

      {/* Modal de Detalles del Proveedor */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
        className="fade"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <div className="modal-content border-0 shadow" style={{ overflow: 'hidden' }}>
          {selectedProveedor && (
            <>
              <div className="modal-header border-0 text-white" 
                style={{ 
                  background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
                  padding: '20px'
                }}>
                <div className="d-flex align-items-center">
                  <div>
                    <h5 className="modal-title fw-bold mb-1">Detalles del Proveedor</h5>
                    <p className="mb-0 opacity-75" style={{ fontSize: '0.9rem' }}>
                      NIT: {selectedProveedor.Nit}
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

              <div className="modal-body p-4">
                <div className="row g-1">
                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6">Nombre del Proveedor</label>
                      <h4 className="mb-0 fs-6 fw-normal">{selectedProveedor.Nombre}</h4>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6" style={{ fontSize: '0.85rem' }}>Correo Electrónico</label>
                      <p className="mb-0 fs-6">{selectedProveedor.Correo}</p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6" style={{ fontSize: '0.85rem' }}>Teléfono</label>
                      <p className="mb-0 fs-6">{selectedProveedor.Telefono}</p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6" style={{ fontSize: '0.85rem' }}>Dirección</label>
                      <p className="mb-0 fs-6">{selectedProveedor.Direccion}</p>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 rounded-3" style={{ backgroundColor: '#f8f9fa' }}>
                      <label className="text-muted mb-1 fs-6">Estado</label>
                      <div className="d-flex align-items-center">
                        <span 
                          className={`badge px-3 py-2 ${selectedProveedor.Estado ? 'bg-success' : 'bg-danger'}`}
                          style={{ fontSize: '0.9rem' }}
                        >
                          {selectedProveedor.Estado ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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

export default Proveedores;