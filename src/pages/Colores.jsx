import { useState, useEffect } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import ColoresForm from "./formularios_dash/colores";
import { getColores, deleteColor } from "../Services/api-colores/colores"; 

const Colores = () => {
    const [search, setSearch] = useState("");
    const [colores, setColores] = useState([]); // 👉 estado con datos desde la API
    const [showForm, setShowForm] = useState(false);
    const [selectedColor, setSelectedColor] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cargar colores al iniciar
    useEffect(() => {
        fetchColores();
    }, []);

    const fetchColores = async () => {
        setLoading(true);
        try {
            const result = await getColores();
            if (result.estado) {
                setColores(result.datos); // 👉 asumimos que el backend responde {estado, datos}
            } else {
                setColores([]);
                console.warn("No se encontraron colores");
            }
        } catch (error) {
            console.error("Error cargando colores:", error);
        } finally {
            setLoading(false);
        }
    };

    // Guardar (crear o actualizar)
    const handleSave = (nuevoColor) => {
        fetchColores(); // recarga la lista
        setShowForm(false);
        setSelectedColor(null);
    };

    // Eliminar
    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este color?")) return;
        try {
            const result = await deleteColor(id);
            if (result.estado) {
                alert("Color eliminado correctamente");
                fetchColores();
            } else {
                alert("Error: " + result.mensaje);
            }
        } catch (error) {
            console.error("Error eliminando color:", error);
            alert("Error de conexión al eliminar");
        }
    };

    // Filtro por búsqueda
    const filtered = colores.filter((c) =>
        c.Nombre.toLowerCase().includes(search.toLowerCase())
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
                <button
                    className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm"
                    onClick={() => {
                        setSelectedColor(null);
                        setShowForm(true);
                    }}
                >
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

            {/* Tabla */}
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
                            {loading ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status"></div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-4 text-muted">
                                        No hay colores para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c.ColorID} style={{ borderBottom: "1px solid #e3e8ee" }}>
                                        <td>
                                            <span className="badge bg-light text-dark px-2 py-1 shadow-sm">
                                                {c.ColorID}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="fw-medium">{c.Nombre}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-1">
                                                <button
                                                    className="btn btn-outline-warning btn-sm rounded-circle"
                                                    title="Editar"
                                                    onClick={() => {
                                                        setSelectedColor(c);
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm rounded-circle"
                                                    title="Eliminar"
                                                    onClick={() => handleDelete(c.ColorID)}
                                                >
                                                    <FaTrash size={14} />
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

            {/* Formulario */}
            {showForm && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ background: "rgba(0,0,0,0.4)" }}
                >
                    <div className="bg-white rounded-4 shadow-lg p-3" style={{ width: "500px" }}>
                        <ColoresForm
                            onClose={() => setShowForm(false)}
                            onSave={handleSave}
                            color={selectedColor}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Colores;
