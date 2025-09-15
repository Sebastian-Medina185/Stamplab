import { useState } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const Telas = () => {
  const [search, setSearch] = useState("");

  const telas = [
    { id: "01", nombre: "Algodón", descripcion: "Tela fresca y suave" },
    { id: "02", nombre: "Lino", descripcion: "Ligera y transpirable" },
    { id: "03", nombre: "Seda", descripcion: "Suave y brillante" },
  ];

  const filtradas = telas.filter((t) =>
    t.nombre.toLowerCase().includes(search.toLowerCase())
  );

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
          Gestión de Telas
        </h1>
        <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
          <FaPlusCircle size={22} />
          Agregar Tela
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex justify-content-end mb-3 px-4">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Filtrar por telas..."
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
          minHeight: 0,
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
                color: "#fff",
              }}
            >
              <tr>
                <th style={{ width: 120, borderTopLeftRadius: 16 }}>ID Tela</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-4 text-muted"
                  >
                    No hay telas para mostrar.
                  </td>
                </tr>
              )}
              {filtradas.map((t) => (
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
                  <td className="text-muted">{t.descripcion}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-circle"
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

export default Telas;