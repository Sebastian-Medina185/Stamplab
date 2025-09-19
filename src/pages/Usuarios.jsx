import { useState, useEffect } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import UsuariosForm from "./formularios_dash/usuarios";
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from "../Services/api-usuarios/usuarios";

const Usuarios = () => {
    const [showForm, setShowForm] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        loadUsuarios();
    }, []);

    // Función para cargar todos los usuarios
    const loadUsuarios = async () => {
        try {
            setLoading(true);
            const response = await getUsuarios();
            if (response.estado) {
                setUsuarios(response.datos);
            } else {
                setError("Error al cargar usuarios");
            }
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            setError("Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    // Función para abrir formulario de agregar
    const handleAgregar = () => {
        setSelectedUsuario(null);
        setShowForm(true);
    };

    // Función para abrir formulario de editar
    const handleEditar = (usuario) => {
        setSelectedUsuario(usuario);
        setShowForm(true);
    };

    // Función para cerrar formulario
    const handleCloseForm = () => {
        setShowForm(false);
        setSelectedUsuario(null);
    };

    // Función para guardar usuario (crear o actualizar)
    const handleSaveUsuario = async (usuarioData) => {
        try {
            let response;
            if (selectedUsuario) {
                // Actualizar usuario existente
                response = await updateUsuario(selectedUsuario.documentoID, usuarioData);
            } else {
                // Crear nuevo usuario
                response = await createUsuario(usuarioData);
            }

            if (response.estado) {
                // Recargar la lista de usuarios
                await loadUsuarios();
                handleCloseForm();
                alert(selectedUsuario ? "Usuario actualizado correctamente" : "Usuario creado correctamente");
            } else {
                alert("Error al guardar usuario: " + response.mensaje);
            }
        } catch (error) {
            console.error("Error al guardar usuario:", error);
            alert("Error de conexión al guardar usuario");
        }
    };

    // Función para eliminar usuario
    const handleEliminar = async (documentoID) => {
        if (window.confirm("¿Está seguro de eliminar este usuario?")) {
            try {
                const response = await deleteUsuario(documentoID);
                if (response.estado) {
                    // Recargar la lista de usuarios
                    await loadUsuarios();
                    alert("Usuario eliminado correctamente");
                } else {
                    alert("Error al eliminar usuario: " + response.mensaje);
                }
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
                alert("Error de conexión al eliminar usuario");
            }
        }
    };



    // Si el formulario está abierto, mostrar solo el formulario
    if (showForm) {
        return (
            <UsuariosForm 
                onClose={handleCloseForm}
                onSave={handleSaveUsuario}
                usuario={selectedUsuario}
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
            {/* Encabezado y botón agregar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1
                    className="fs-5 fw-bold mb-0 text-primary"
                    style={{ letterSpacing: 1 }}
                >
                    Gestión de Usuarios
                </h1>
                <button
                    className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm"
                    onClick={handleAgregar}
                >
                    <FaPlusCircle size={18} />
                    Agregar Usuario
                </button>
            </div>



            {/* Mensaje de error */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                    <button 
                        className="btn btn-sm btn-outline-danger ms-2"
                        onClick={loadUsuarios}
                    >
                        Reintentar
                    </button>
                </div>
            )}

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
                                fontSize: "0.85rem",
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
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                        <span className="ms-2 text-muted">Cargando usuarios...</span>
                                    </td>
                                </tr>
                            ) : usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-muted">
                                        No hay usuarios para mostrar.
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((u) => (
                                    <tr key={u.DocumentoID} style={{ borderBottom: "1px solid #e3e8ee" }}>
                                        <td>
                                            <span className="badge bg-light text-dark px-2 py-1 shadow-sm">
                                                {u.DocumentoID}
                                            </span>
                                        </td>
                                        <td className="fw-medium">{u.Nombre}</td>
                                        <td>{u.Correo}</td>
                                        <td>{u.Direccion}</td>
                                        <td>{u.Telefono}</td>
                                        <td>
                                            <span className="badge bg-secondary px-2 py-2 shadow-sm">
                                                {u.RolID === 1 ? 'Administrador' : 'Cliente'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-1">
                                                <button
                                                    className="btn btn-outline-primary btn-sm rounded-circle"
                                                    title="Ver"
                                                    onClick={() => console.log("Ver usuario:", u)}
                                                >
                                                    <FaEye size={14} />
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning btn-sm rounded-circle"
                                                    title="Editar"
                                                    onClick={() => handleEditar(u)}
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm rounded-circle"
                                                    title="Eliminar"
                                                    onClick={() => handleEliminar(u.documentoID)}
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

export default Usuarios;