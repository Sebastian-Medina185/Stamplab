import { useState, useEffect } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ProveedoresForm from './formularios_dash/proveedores';
import { getProveedores, deleteProveedor } from '../Services/api-proveedores/proveedores';

const Proveedores = () => {
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar proveedores al montar el componente
  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProveedores();
      
      if (response.estado) {
        setProveedores(response.datos);
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

  // Función para abrir formulario de agregar
  const handleAgregar = () => {
    setSelectedProveedor(null);
    setShowForm(true);
  };

  // Función para abrir formulario de editar
  const handleEditar = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowForm(true);
  };

  // Función para cerrar formulario y recargar datos
  const handleCloseForm = (proveedorActualizado = false) => {
    setShowForm(false);
    setSelectedProveedor(null);
    
    // Si se agregó o editó un proveedor, recargar la lista
    if (proveedorActualizado) {
      cargarProveedores();
    }
  };

  // Función para eliminar
  const handleEliminar = async (nit) => {
    if (window.confirm("¿Está seguro de eliminar este proveedor?")) {
      try {
        const response = await deleteProveedor(nit);
        
        if (response.estado) {
          // Actualizar la lista eliminando el proveedor localmente
          setProveedores(prevProveedores => 
            prevProveedores.filter(proveedor => proveedor.Nit !== nit)
          );
          console.log("Proveedor eliminado exitosamente");
        } else {
          alert('Error al eliminar el proveedor: ' + response.mensaje);
        }
      } catch (error) {
        console.error("Error eliminando proveedor:", error);
        alert('Error al eliminar el proveedor');
      }
    }
  };

  // Filtrado de proveedores
  const filtered = proveedores.filter(
    (proveedor) =>
      proveedor.Nombre.toLowerCase().includes(searchName.toLowerCase()) &&
      proveedor.Estado.toString().toLowerCase().includes(searchStatus.toLowerCase())
  );

  // Si el formulario está abierto, mostrar solo el formulario
  if (showForm) {
    return (
      <ProveedoresForm
        onClose={handleCloseForm}
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
          className="table-responsive rounded-4 shadow"
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
                            console.log("Ver proveedor:", proveedor);
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

export default Proveedores;