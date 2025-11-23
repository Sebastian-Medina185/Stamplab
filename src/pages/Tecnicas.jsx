import React, { useState, useEffect } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash, FaSyncAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";

import TecnicasForm from "../pages/formularios_dash/TecnicasForm";
import { getAllTecnicas, createTecnica, updateTecnica, deleteTecnica } from "../services/api-tecnicas/tecnicas";

const Tecnicas = () => {
    const [search, setSearch] = useState("");
    const [tecnicas, setTecnicas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [tecnicaEdit, setTecnicaEdit] = useState(null);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedTecnica, setSelectedTecnica] = useState(null);

    useEffect(() => {
        loadTecnicas();
    }, []);

    const loadTecnicas = async () => {
        try {
            setLoading(true);
            const response = await getAllTecnicas();
            if (response) setTecnicas(response);
            else setError("Error al cargar técnicas");
        } catch (err) {
            setError("Error al cargar las técnicas: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const filtered = tecnicas.filter((t) =>
        t.Nombre.toLowerCase().includes(search.toLowerCase())
    );

    const handleAgregar = () => {
        setTecnicaEdit(null);
        setShowForm(true);
    };

    const handleEditar = (tecnica) => {
        setTecnicaEdit(tecnica);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setTecnicaEdit(null);
    };

    const handleSave = async (tecnicaData) => {
        try {
            setLoading(true);
            let response;

            if (tecnicaEdit)
                response = await updateTecnica(tecnicaEdit.TecnicaID, tecnicaData);
            else
                response = await createTecnica(tecnicaData);

            if (response.estado) {
                await loadTecnicas();
                handleCloseForm();

                Swal.fire({
                    toast: true,
                    icon: "success",
                    title: tecnicaEdit ? "Técnica actualizada" : "Técnica creada",
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                });
            } else throw new Error();
        } catch (error) {
            console.error("Error en createTecnica:", error);
            Swal.fire(
                "Error",
                tecnicaEdit
                    ? "No se pudo actualizar la técnica"
                    : "Técnica no creada",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (tecnicaID) => {
        try {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción no se puede revertir",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                setLoading(true);
                const response = await deleteTecnica(tecnicaID);

                if (response.estado) {
                    await loadTecnicas();
                    Swal.fire({
                        toast: true,
                        icon: "success",
                        title: "Técnica eliminada",
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2000,
                    });
                } else throw new Error("Error al eliminar");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", error.message || "No se pudo eliminar", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (tecnica) => {
        const nuevoEstado = !tecnica.Estado;
        try {
            const result = await Swal.fire({
                title: "¿Cambiar estado?",
                text: `¿Seguro que desea cambiar a ${nuevoEstado ? "Activo" : "Inactivo"}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
            });

            if (result.isConfirmed) {
                setLoading(true);
                const response = await updateTecnica(tecnica.TecnicaID, {
                    ...tecnica,
                    Estado: nuevoEstado,
                });

                if (response.estado) await loadTecnicas();
                else throw new Error("Error al cambiar estado");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", error.message || "No se pudo cambiar estado", "error");
        } finally {
            setLoading(false);
        }
    };

    if (showForm)
        return (
            <TecnicasForm
                onClose={handleCloseForm}
                onSave={handleSave}
                tecnicaEdit={tecnicaEdit}
            />
        );

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="d-flex flex-column" style={{ minHeight: "100dvh", padding: "20px 30px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="fs-5 fw-bold mb-0 text-primary">Gestión de Técnicas</h1>
                <button
                    className="btn btn-sm btn-primary d-flex align-items-center gap-2"
                    onClick={handleAgregar}
                >
                    <FaPlusCircle /> Agregar Técnica
                </button>
            </div>

            <div className="d-flex justify-content-end mb-3">
                <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Buscar técnica..."
                    style={{ maxWidth: 260 }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="table-responsive rounded-4 shadow-sm bg-white">
                <table className="table table-sm align-middle mb-0">
                    <thead className="text-white" style={{ background: "#1976d2" }}>
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Imagen</th>
                            <th>Estado</th>
                            <th style={{ width: 200 }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-muted">
                                    No hay técnicas para mostrar.
                                </td>
                            </tr>
                        )}

                        {filtered.map((t) => (
                            <tr key={t.TecnicaID}>
                                <td>{t.Nombre}</td>
                                <td>{t.Descripcion}</td>

                                <td>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => {
                                            setSelectedTecnica(t);
                                            setShowImageModal(true);
                                        }}
                                    >
                                        Ver Imagen
                                    </button>
                                </td>

                                <td>
                                    <span
                                        className={`badge ${t.Estado ? "bg-success" : "bg-danger"}`}
                                    >
                                        {t.Estado ? "Activo" : "Inactivo"}
                                    </span>
                                </td>

                                <td className="d-flex gap-1">
                                    <button
                                        className="btn btn-outline-warning btn-sm"
                                        onClick={() => handleEditar(t)}
                                        title="Editar"
                                    >
                                        <FaEdit />
                                    </button>

                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleEliminar(t.TecnicaID)}
                                        title="Eliminar"
                                    >
                                        <FaTrash />
                                    </button>

                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => handleCambiarEstado(t)}
                                        title="Cambiar estado"
                                    >
                                        <FaSyncAlt />
                                    </button>

                                    <button
                                        className="btn btn-outline-info btn-sm"
                                        onClick={() => {
                                            setSelectedTecnica(t);
                                            setShowDetailModal(true);
                                        }}
                                        title="Ver detalle"
                                    >
                                        <FaEye />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL VER IMAGEN */}
            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedTecnica?.Nombre}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="text-center">
                    {selectedTecnica?.ImagenTecnica ? (
                        <img
                            src={selectedTecnica.ImagenTecnica}
                            alt={selectedTecnica.Nombre}
                            className="img-fluid rounded shadow"
                            style={{ maxHeight: "400px", objectFit: "contain" }}
                        />
                    ) : (
                        <p>No hay imagen disponible</p>
                    )}
                </Modal.Body>
            </Modal>

            {/* MODAL DETALLES */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de la Técnica</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedTecnica && (
                        <>
                            <p><strong>Nombre:</strong> {selectedTecnica.Nombre}</p>
                            <p><strong>Descripción:</strong> {selectedTecnica.Descripcion}</p>
                            <p><strong>Estado:</strong> {selectedTecnica.Estado ? "Activo" : "Inactivo"}</p>

                            <hr />

                            <h5 className="mb-3">Imagen</h5>
                            {selectedTecnica.ImagenTecnica ? (
                                <img
                                    src={selectedTecnica.ImagenTecnica}
                                    alt="imagen técnica"
                                    className="img-fluid rounded shadow"
                                    style={{ maxHeight: "350px", objectFit: "contain" }}
                                />
                            ) : (
                                <p className="text-muted">No hay imagen disponible</p>
                            )}
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Tecnicas;
