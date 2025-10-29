import { useState, useEffect } from "react";
import { FaPlusCircle, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

import ColoresForm from "./formularios_dash/colores.jsx";
import { getColores, deleteColor } from "../Services/api-colores/colores.js";

const Colores = () => {
    const [search, setSearch] = useState("");
    const [colores, setColores] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [colorEdit, setColorEdit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchColores();
    }, []);

    const fetchColores = async () => {
        setLoading(true);
        try {
            const result = await getColores();
            if (result) {
                setColores(result);
            } else {
                setColores([]);
            }
        } catch (error) {
            console.error("Error cargando colores:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        await fetchColores();
        setShowForm(false);
        setColorEdit(null);
    };

    const handleEdit = (c) => {
        setColorEdit(c);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await deleteColor(id);
                if (response.estado) {
                    await fetchColores();
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer);
                            toast.addEventListener('mouseleave', Swal.resumeTimer);
                        }
                    });
                    Toast.fire({
                        icon: 'success',
                        title: 'Color eliminado correctamente'
                    });
                } else {
                    throw new Error(response.mensaje);
                }
            } catch (error) {
                Swal.fire('Error', error.message || 'No se pudo eliminar el color', 'error');
            }
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setColorEdit(null);
    };

    const filtered = colores.filter((c) =>
        c.Nombre.toLowerCase().includes(search.toLowerCase())
    );

    if (showForm) {
        return (
            <ColoresForm
                onClose={handleCloseForm}
                onSave={handleSave}
                colorEdit={colorEdit}
            />
        );
    }

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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="fs-5 fw-bold mb-0 text-primary" style={{ letterSpacing: 1 }}>
                    Gestión de Colores
                </h1>
                <button
                    className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm"
                    onClick={() => {
                        setColorEdit(null);
                        setShowForm(true);
                    }}
                >
                    <FaPlusCircle size={18} />
                    Agregar Color
                </button>
            </div>

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
                                        <td className="fw-medium">{c.Nombre}</td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-1">
                                                <button
                                                    className="btn btn-outline-warning btn-sm rounded-circle"
                                                    title="Editar"
                                                    onClick={() => handleEdit(c)}
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
        </div>
    );
};

export default Colores;