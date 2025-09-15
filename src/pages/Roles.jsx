// Roles.jsx
import { useState } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaSyncAlt } from "react-icons/fa";

const Roles = () => {
    const [searchName, setSearchName] = useState("");

    // Datos de ejemplo (puedes conectarlos a tu API después)
    const roles = [
        { id: 1, nombre: "Administrador", descripcion: "Acceso completo al sistema", estado: "Activo" },
        { id: 2, nombre: "Empleado", descripcion: "Acceso limitado a funciones específicas", estado: "Activo" }
    ];

    const filtered = roles.filter(r =>
        r.nombre.toLowerCase().includes(searchName.toLowerCase())
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
                <h1 className="fs-4 fw-bold mb-0 text-primary" style={{ letterSpacing: 1 }}>
                    Gestión de Roles
                </h1>
                <button className="btn btn-primary d-flex align-items-center gap-2 shadow-sm">
                    <FaPlusCircle size={22} />
                    Agregar Rol
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
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla con scroll interno */}
            <div
                className="flex-grow-1 px-4 pb-4"
                style={{
                    overflow: "auto",
                    minHeight: 0
                }}
            >
                <div className="table-responsive rounded-4 shadow" style={{ background: "#fff" }}>
                    <table className="table align-middle mb-0 text-center">
                        <thead
                            style={{
                                background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                                color: "#fff"
                            }}
                        >
                            <tr>
                                <th style={{ width: 80, borderTopLeftRadius: 16 }}>ID</th>
                                <th>Nombre del Rol</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th style={{ width: 200 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-muted">
                                        No hay roles para mostrar.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((r) => (
                                <tr key={r.id} style={{ borderBottom: "1px solid #e3e8ee" }}>
                                    <td>
                                        <span className="badge bg-light text-dark px-3 py-2 shadow-sm" style={{ fontSize: 15 }}>
                                            {r.id}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 500, fontSize: 16 }}>{r.nombre}</td>
                                    <td style={{ fontSize: 15 }}>{r.descripcion}</td>
                                    <td>
                                        <span className={`shadow-sm ${r.estado === "Activo" ? "text-success fw-bold fs-6" : "btn-secondary"}`}> 
                                            {r.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                                            <button className="btn btn-outline-info btn-sm rounded-circle" title="Ver">
                                                <FaEye size={16} />
                                            </button>
                                            <button className="btn btn-outline-warning btn-sm rounded-circle" title="Editar">
                                                <FaEdit size={16} />
                                            </button>
                                            <button className="btn btn-outline-secondary btn-sm rounded-circle" title="Cambiar estado">
                                                <FaSyncAlt size={16} />
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

export default Roles;
