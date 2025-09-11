// Insumos.jsx
import { useState } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash, FaSync } from "react-icons/fa";

const Insumos = () => {
  const [search, setSearch] = useState("");

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
          Gestión de Insumos
        </h1>
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
          <FaPlusCircle size={22} />
          Agregar Insumo
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex justify-content-end mb-3 px-4">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Filtrar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                <th style={{ borderTopLeftRadius: 16 }}>Nombre Insumo</th>
                <th>Stock</th>
                <th>Estado</th>
                <th style={{ borderTopRightRadius: 16 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #e3e8ee" }}>
                <td className="fw-medium">Camiseta</td>
                <td>4</td>
                <td>
                  <span
                    className="badge bg-success px-3 py-2 shadow-sm"
                    style={{ fontSize: 14 }}
                  >
                    Activo
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-info btn-sm rounded-circle"
                      title="Ver"
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm rounded-circle"
                      title="Editar"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-circle"
                      title="Eliminar"
                    >
                      <FaTrash size={16} />
                    </button>
                    <button
                      className="btn btn-outline-secondary btn-sm rounded-circle"
                      title="Cambiar estado"
                    >
                      <FaSync size={16} />
                    </button>
                  </div>
                </td>
              </tr>
              {/* Aquí luego vas a mapear los insumos reales */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Insumos;
