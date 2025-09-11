import { useState } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const Usuarios = () => {
    const [search, setSearch] = useState("");

    const usuarios = [
        {
            id: "197419744",
            nombre: "Wilmer",
            correo: "hole@gmail.com",
            direccion: "Cll 65 #143",
            telefono: "3149293233",
            rol: "Administrador",
        },
        {
            id: "108823493",
            nombre: "María",
            correo: "maria@hotmail.com",
            direccion: "Cra 10 #22-33",
            telefono: "3100001122",
            rol: "Cliente",
        },
    ];

    const filtered = usuarios.filter(
        (u) =>
            u.nombre.toLowerCase().includes(search.toLowerCase()) ||
            u.correo.toLowerCase().includes(search.toLowerCase()) ||
            u.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            className="d-flex flex-column"
            style={{
                minHeight: "100dvh",
                background: "linear-gradient(135deg, #ffffffff 0%, #fafcff 100%)",
                padding: "20px 30px", // 👈 más aire
                fontSize: "0.9rem", // 👈 contenido más pequeño
            }}
        >
            {/* Encabezado y botón agregar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1
                    className="fs-5 fw-bold mb-0 text-primary"
                    style={{ letterSpacing: 1 }}
                >
                    Gestión de Usuarios
                </h1>
                <button className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm">
                    <FaPlusCircle size={18} />
                    Agregar Usuario
                </button>
            </div>

            {/* Buscador */}
            <div className="d-flex justify-content-end mb-3">
                <div className="input-group input-group-sm" style={{ maxWidth: 260 }}>
                    <span className="input-group-text bg-white border-end-0">🔍</span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Buscar usuario..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

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
                                fontSize: "0.85rem", // 👈 más pequeño
                            }}
                        >
                            <tr>
                                <th style={{ borderTopLeftRadius: 12 }}>Documento</th>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Rol</th>
                                <th style={{ width: 160 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-muted">
                                        No hay usuarios para mostrar.
                                    </td>
                                </tr>
                            )}
                            {filtered.map((u) => (
                                <tr key={u.id} style={{ borderBottom: "1px solid #e3e8ee" }}>
                                    <td>
                                        <span className="badge bg-light text-dark px-2 py-1 shadow-sm">
                                            {u.id}
                                        </span>
                                    </td>
                                    <td className="fw-medium">{u.nombre}</td>
                                    <td>{u.correo}</td>
                                    <td>{u.direccion}</td>
                                    <td>{u.telefono}</td>
                                    <td>
                                        <span className="badge bg-secondary px-2 py-1 shadow-sm">
                                            {u.rol}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-1">
                                            <button
                                                className="btn btn-outline-info btn-sm rounded-circle"
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

export default Usuarios;
