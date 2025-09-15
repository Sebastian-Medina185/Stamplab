import { useState } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const Tecnicas = () => {
  const [search, setSearch] = useState("");

  // Datos de ejemplo
  const tecnicas = [
    { id: 1, nombre: "Sublimación", descripcion: "Para camisas", estado: "Activo" },
    { id: 2, nombre: "Bordado", descripcion: "Para gorras y chaquetas", estado: "Inactivo" },
  ];

  const filtered = tecnicas.filter((t) =>
    t.nombre.toLowerCase().includes(search.toLowerCase())
  );

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
        <button className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm">
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

      {/* Tabla */}
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
                <tr key={t.id} style={{ borderBottom: "1px solid #e3e8ee" }}>
                  <td className="fw-medium">{t.nombre}</td>
                  <td>{t.descripcion}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 shadow-sm ${t.estado === "Activo" ? "text-success fw-bold fs-6" : "text-secondary fw-bold fs-6"
                        }`}
                    >
                      {t.estado}
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
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm rounded-circle"
                        title="Eliminar"
                      >
                        <FaTrash size={14} />
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
