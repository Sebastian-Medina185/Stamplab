import { useState, useEffect } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import UsuariosForm from "./formularios_dash/usuarios";
import { getUsuarios, deleteUsuario } from "../Services/api-usuarios/usuarios";
import VerDetalles from "../components/modals/verdetalle-usuarios";

const Usuarios = () => {
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);
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
            setError(null);
            const response = await getUsuarios();
            if (response.estado) {
                setUsuarios(response.datos);
            } else {
                setError(response.mensaje || "Error al cargar usuarios");
            }
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
            setError("Error de conexión al servidor");
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

    // Función para manejar guardado exitoso
    const handleSaveSuccess = async () => {
        // Recargar la lista de usuarios
        await loadUsuarios();
        handleCloseForm();
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

    // Función para ver detalles del usuario
   const handleVer = (usuario) => {
        // Preparar los datos para el modal
        const data = [
            { label: "Documento", value: usuario.DocumentoID },
            { label: "Nombre", value: usuario.Nombre },
            { label: "Correo", value: usuario.Correo },
            { label: "Rol", value: getRoleName(usuario) },
            { label: "Direccion", value: usuario.Direccion },
            { label: "Telefono", value: usuario.Telefono },
            { label: "Contraseña", value: "********" }
        ];
        
        setModalData(data);
        setShowModal(true);
    };
    // Función para obtener el nombre del rol
    const getRoleName = (usuario) => {
        if (usuario.RolNombre) {
            return usuario.RolNombre;
        }

        // Mapeo de roles por ID si no viene el nombre
        const rolesMap = {
            'AD': 'Administrador',
            'CL': 'Cliente',
            'EM': 'Empleado',
            '1': 'Administrador',
            '2': 'Cliente',
            '3': 'Empleado'
        };

        return rolesMap[usuario.RolID] || usuario.RolID;
    };

    // Si el formulario está abierto, mostrar solo el formulario
    if (showForm) {
        return (
            <UsuariosForm
                onClose={handleCloseForm}
                onSave={handleSaveSuccess}
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
                    disabled={loading}
                >
                    <FaPlusCircle size={18} />
                    Agregar Usuario
                </button>
            </div>

           

            {/* Mensaje de error */}
            {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <span className="me-2">⚠️</span>
                    <div>
                        {error}
                        <button
                            className="btn btn-sm btn-outline-danger ms-2"
                            onClick={loadUsuarios}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            )}

            {/* Tabla con scroll interno */}
            <div className="flex-grow-1" style={{ overflow: "auto", minHeight: 0 }}>
                <div
                    className="table-responsive rounded-4 shadow-sm"
                    style={{ background: "#fff" }}
                >
                    <table className="table table-sm table-hover align-middle mb-0">
                        <thead
                            style={{
                                background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                                color: "#fff",
                                fontSize: "0.85rem",
                            }}
                        >
                            <tr>
                                <th style={{ borderTopLeftRadius: 12, minWidth: 120 }}>Documento</th>
                                <th style={{ minWidth: 150 }}>Nombre</th>
                                <th style={{ minWidth: 180 }}>Correo</th>
                                <th style={{ minWidth: 200 }}>Dirección</th>
                                <th style={{ minWidth: 120 }}>Teléfono</th>
                                <th style={{ minWidth: 100 }}>Rol</th>
                                <th style={{ width: 160, borderTopRightRadius: 12 }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center">
                                            <div className="spinner-border spinner-border-sm text-primary mb-2" role="status">
                                                <span className="visually-hidden">Cargando...</span>
                                            </div>
                                            <span className="text-muted">Cargando usuarios...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5 text-danger">
                                        <div className="d-flex flex-column align-items-center">
                                            <span className="mb-2">❌ Error al cargar datos</span>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={loadUsuarios}
                                            >
                                                Reintentar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : usuarios.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-5">
                                        <div className="d-flex flex-column align-items-center text-muted">
                                            <span className="mb-2">📝 No hay usuarios registrados</span>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={handleAgregar}
                                            >
                                                Crear primer usuario
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                usuarios.map((usuario) => (
                                    <tr key={usuario.DocumentoID} style={{ borderBottom: "1px solid #e3e8ee" }}>
                                        <td>
                                            <span className="badge bg-light text-dark px-2 py-1 shadow-sm">
                                                {usuario.DocumentoID}
                                            </span>
                                        </td>
                                        <td className="fw-medium">{usuario.Nombre}</td>
                                        <td>
                                            <small className="text-muted">{usuario.Correo}</small>
                                        </td>
                                        <td>
                                            <small className="text-muted">
                                                {usuario.Direccion.length > 40
                                                    ? usuario.Direccion.substring(0, 40) + '...'
                                                    : usuario.Direccion
                                                }
                                            </small>
                                        </td>
                                        <td>{usuario.Telefono}</td>
                                        <td>
                                            <span className="badge bg-secondary px-2 py-1 shadow-sm">
                                                {getRoleName(usuario)}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex justify-content-center gap-1">
                                                <button
                                                    className="btn btn-outline-primary btn-sm rounded-circle"
                                                    title="Ver detalles"
                                                    onClick={() => handleVer(usuario)}
                                                >
                                                    <FaEye size={14} />
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning btn-sm rounded-circle"
                                                    title="Editar usuario"
                                                    onClick={() => handleEditar(usuario)}
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm rounded-circle"
                                                    title="Eliminar usuario"
                                                    onClick={() => handleEliminar(usuario.DocumentoID)}
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
            {/* Modal de ver detalles */}
            <VerDetalles
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Detalle del usuario"
                data={modalData}
            />
            
        </div>
      
        
    );
};

export default Usuarios;