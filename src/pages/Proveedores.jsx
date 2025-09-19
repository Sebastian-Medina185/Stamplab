import { useState } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ProveedoresForm from './formularios_dash/proveedores';

const Proveedores = () => {
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  // Datos de ejemplo (luego los reemplazas con datos reales)
  const proveedores = [
    {
      nit: "43-63-87",
      nombre: "Mario",
      correo: "mario12@gmail.com",
      telefono: "3456543",
      direccion: "CLL #42",
      estado: "Activo"
    }
    // Aquí agregarías más proveedores
  ];

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

  // Función para cerrar formulario
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProveedor(null);
  };

  // Función para eliminar (aquí puedes agregar confirmación)
  const handleEliminar = (nit) => {
    if (window.confirm("¿Está seguro de eliminar este proveedor?")) {
      // Aquí iría la lógica para eliminar
      console.log("Eliminar proveedor con NIT:", nit);
    }
  };

  // Filtrado de proveedores
  const filtered = proveedores.filter(
    (proveedor) =>
      proveedor.nombre.toLowerCase().includes(searchName.toLowerCase()) &&
      proveedor.estado.toLowerCase().includes(searchStatus.toLowerCase())
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-muted">
                    No se encontraron proveedores.
                  </td>
                </tr>
              ) : (
                filtered.map((proveedor) => (
                  <tr key={proveedor.nit} style={{ borderBottom: "1px solid #e3e8ee" }}>
                    <td>
                      <span
                        className="badge bg-light text-dark px-3 py-2 shadow-sm"
                        style={{ fontSize: 15 }}
                      >
                        {proveedor.nit}
                      </span>
                    </td>
                    <td className="fw-medium">{proveedor.nombre}</td>
                    <td>{proveedor.correo}</td>
                    <td>{proveedor.telefono}</td>
                    <td>{proveedor.direccion}</td>
                    <td>
                      <span
                        className={`badge fw-bold fs-6 px-1 py-2 shadow-sm ${proveedor.estado === "Activo"
                            ? "text-success"
                            : "text-danger"
                          }`}
                        style={{ fontSize: 14 }}
                      >
                        {proveedor.estado}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-circle"
                          title="Ver"
                          onClick={() => {
                            // Aquí puedes agregar lógica para ver detalles
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
                          onClick={() => handleEliminar(proveedor.nit)}
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