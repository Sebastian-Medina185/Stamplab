import { useState } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const Tallas = () => {
  const [search, setSearch] = useState("");

  const tallas = [
    { id: "01", nombre: "Pequeña" },
    { id: "02", nombre: "Mediana" },
    { id: "03", nombre: "Grande" },
    { id: "04", nombre: "Extra Grande" }
  ];

  const filtered = tallas.filter((t) =>
    t.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #ffffffff 0%, #fafcff 100%)"
      }}
    >
      {/* Encabezado y botón agregar */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3 px-4">
        <h1
          className="fs-4 fw-bold mb-0 text-primary"
          style={{ letterSpacing: 1 }}
        >
          Gestión de Tallas
        </h1>
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
          <FaPlusCircle size={22} />
          Agregar Talla
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex justify-content-end mb-3 px-4">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Filtrar por tallas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div
        className="flex-grow-1 px-4 pb-4"
        style={{
          overflow: "auto",
          minHeight: 0
        }}
      >
        <div
          className="table-responsive rounded-4 shadow"
          style={{ background: "#fff" }}
        >
          <table className="table align-middle mb-0">
            <thead
              style={{
                background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                color: "#fff"
              }}
            >
              <tr>
                <th style={{ width: 120, borderTopLeftRadius: 16 }}>ID Talla</th>
                <th>Nombre</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    No hay tallas para mostrar.
                  </td>
                </tr>
              )}
              {filtered.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #e3e8ee" }}>
                  <td>
                    <span
                      className="badge bg-light text-dark px-3 py-2 shadow-sm"
                      style={{ fontSize: 15 }}
                    >
                      {t.id}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500, fontSize: 16 }}>{t.nombre}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
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

export default Tallas;