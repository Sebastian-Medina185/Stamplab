import { useState } from "react";
import Icon from "../components/Icon";
import { FaEdit, FaEye, FaPlusCircle, FaTrash } from "react-icons/fa";

const Pedidos = () => {
    const [search, setSearch] = useState("");

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
                <h1
                    className="fs-5 fw-bold mb-0 text-primary"
                    style={{ letterSpacing: 1 }}
                >
                    Gestión de Pedidos
                </h1>
                <button className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm">
                    <FaPlusCircle size={18} />
                    Agregar Pedido
                </button>
            </div>

            {/* Buscador */}
            <div className="d-flex justify-content-end mb-3">
                <div className="input-group input-group-sm" style={{ maxWidth: 260 }}>
                    <span className="input-group-text bg-white border-end-0">🔍</span>
                    <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Buscar pedido..."
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
                                <th style={{ borderTopLeftRadius: 12 }}>ID Pedido</th>
                                <th>Cliente</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th style={{ width: 160 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: "1px solid #e3e8ee" }}>
                                <td>
                                    <span className="badge bg-light text-dark px-2 py-1 shadow-sm">
                                        001
                                    </span>
                                </td>
                                <td className="fw-medium">Juan Pérez</td>
                                <td>Camiseta</td>
                                <td>3</td>
                                <td>28/08/2025</td>
                                <td>
                                    <span className="badge text-success fw-bold fs-6 px-1 py-2 shadow-sm">
                                        Activo
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
                            <tr style={{ borderBottom: "1px solid #e3e8ee" }}>
                                <td>
                                    <span className="badge bg-light text-dark px-2 py-1 shadow-sm">
                                        002
                                    </span>
                                </td>
                                <td className="fw-medium">María López</td>
                                <td>Pantalón</td>
                                <td>2</td>
                                <td>29/08/2025</td>
                                <td>
                                    <span className="badge text-success fw-bold fs-6 px-1 py-2 shadow-sm">
                                        Activo
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Pedidos;
