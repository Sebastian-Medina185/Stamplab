import { useState } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const Colores = () => {
    const [search, setSearch] = useState("");

    const colores = [
        { id: "01", nombre: "Rojo", color: "#e53935" },
        { id: "02", nombre: "Azul", color: "#1976d2" },
        { id: "03", nombre: "Verde", color: "#43a047" },
        { id: "04", nombre: "Amarillo", color: "#fbc02d" },
        { id: "05", nombre: "Negro", color: "#222" },
        { id: "06", nombre: "Blanco", color: "#fff", texto: "#222" },
    ];

    const filtered = colores.filter((c) =>
        c.nombre.toLowerCase().includes(search.toLowerCase())
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
            {/* Encabezado y botón agregar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="fs-5 fw-bold mb-0 text-primary" style={{ letterSpacing: 1 }}>
                    Gestión de Colores
                </h1>
                <button className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm">
                    <FaPlusCircle size={18} />
                    Agregar Color
                </button>
            </div>

            {/* Buscador */}
            <div className="d-flex justify-content-end mb-3">
                <div className="input-group input-group-sm" style={{ maxWidth: 260 }}>
                    <span className="input-group-text bg-white border-end-0">🔍</span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Buscar color..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla con scroll interno */}
            <div className="flex-grow-1" style={{ overflow: "auto", minHeight: 0 }}>
                <div className="table-responsive rounded-4 shadow-sm" style={{ background: "#fff" }}>
                    <table className="table table-sm align-middle mb-0">
                        <thead
                            style={{
                                background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                                color: "#fff",
                                fontSize: "0.85rem",
                            }}
                        >
                            <tr>
                                <th style={{ borderTopLeftRadius: 12 }}>ID</th>
                                <th>Nombre</th>
                                <th style={{ width: 140 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-4 text-muted">
                                        No hay colores para mostrar.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((c) => (
                                <tr key={c.id} style={{ borderBottom: "1px solid #e3e8ee" }}>
                                    <td>
                                        <span className="badge bg-light text-dark px-2 py-1 shadow-sm">
                                            {c.id}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="d-inline-flex align-items-center gap-2 fw-medium">
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: "50%",
                                                    background: c.color,
                                                    border: "1px solid #ccc",
                                                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                }}
                                            ></span>
                                            <span style={{ color: c.texto || "#222" }}>{c.nombre}</span>
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-1">
                                            <button className="btn btn-outline-info btn-sm rounded-circle" title="Ver">
                                                <FaEye size={14} />
                                            </button>
                                            <button className="btn btn-outline-warning btn-sm rounded-circle" title="Editar">
                                                <FaEdit size={14} />
                                            </button>
                                            <button className="btn btn-outline-danger btn-sm rounded-circle" title="Eliminar">
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

export default Colores;
