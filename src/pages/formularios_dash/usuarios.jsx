// src/pages/formularios_dash/usuariosForm.jsx
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { createUsuario, updateUsuario, getRoles } from "../../Services/api-usuarios/usuarios";

const UsuariosForm = ({ onClose, onSave, usuario = null }) => {
    const [formData, setFormData] = useState({
        DocumentoID: "",
        Nombre: "",
        Correo: "",
        Direccion: "",
        Telefono: "",
        Contraseña: "",
        RolID: "",
    });

    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [errors, setErrors] = useState({});

    // Cargar roles disponibles al montar el componente
    useEffect(() => {
        loadRoles();
    }, []);

    // Si hay un usuario para editar, cargar sus datos
    useEffect(() => {
        if (usuario) {
            setFormData({
                DocumentoID: usuario.DocumentoID || "",
                Nombre: usuario.Nombre || "",
                Correo: usuario.Correo || "",
                Direccion: usuario.Direccion || "",
                Telefono: usuario.Telefono || "",
                Contraseña: "", // No cargar contraseña por seguridad
                RolID: usuario.RolID ? usuario.RolID.toString() : "", // Asegurar que RolID sea string
            });
            console.log("Cargando usuario para editar:", usuario); // Para debugging
        }
    }, [usuario]);

    // Función para cargar roles desde la API
    // ...
    const loadRoles = async () => {
        try {
            setLoadingRoles(true);
            const result = await getRoles();

            if (result.estado && Array.isArray(result.datos)) {
                // Asegurarnos de que cada rol tenga RolID como string
                const rolesFormateados = result.datos.map(rol => ({
                    ...rol,
                    RolID: rol.RolID.toString()
                }));
                setRoles(rolesFormateados);
                console.log("Roles cargados:", rolesFormateados); // Para debugging
            } else {
                console.error("Respuesta inválida de roles:", result);
                setRoles([]);
            }
        } catch (error) {
            console.error("Error al cargar roles:", error);
            setRoles([]);
        } finally {
            setLoadingRoles(false);
        }
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    // Validaciones del formulario
    const validateForm = () => {
        const newErrors = {};

        // Validar DocumentoID
        if (!formData.DocumentoID.trim()) {
            newErrors.DocumentoID = "El documento es requerido";
        } else if (formData.DocumentoID.length > 15) {
            newErrors.DocumentoID = "El documento no puede tener más de 15 caracteres";
        }

        // Validar Nombre
        if (!formData.Nombre.trim()) {
            newErrors.Nombre = "El nombre es requerido";
        } else if (formData.Nombre.length > 50) {
            newErrors.Nombre = "El nombre no puede tener más de 50 caracteres";
        }

        // Validar Correo
        if (!formData.Correo.trim()) {
            newErrors.Correo = "El correo es requerido";
        } else if (formData.Correo.length > 100) {
            newErrors.Correo = "El correo no puede tener más de 100 caracteres";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.Correo)) {
                newErrors.Correo = "Formato de correo inválido";
            }
        }

        // Validar Dirección
        if (!formData.Direccion.trim()) {
            newErrors.Direccion = "La dirección es requerida";
        } else if (formData.Direccion.length > 150) {
            newErrors.Direccion = "La dirección no puede tener más de 150 caracteres";
        }

        // Validar Teléfono
        if (!formData.Telefono.trim()) {
            newErrors.Telefono = "El teléfono es requerido";
        } else if (formData.Telefono.length > 15) {
            newErrors.Telefono = "El teléfono no puede tener más de 15 caracteres";
        }

        // Validar Contraseña (solo para nuevos usuarios)
        if (!usuario && !formData.Contraseña.trim()) {
            newErrors.Contraseña = "La contraseña es requerida";
        } else if (formData.Contraseña && formData.Contraseña.length > 100) {
            newErrors.Contraseña = "La contraseña no puede tener más de 100 caracteres";
        }

        // Validar Rol
        if (!formData.RolID) {
            newErrors.RolID = "Debe seleccionar un rol";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar formulario
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            // Preparar datos para enviar
            const dataToSend = {
                ...formData,
                RolID: formData.RolID.toString().substring(0, 2) // Aseguramos que RolID sea string y máximo 2 caracteres
            };

            // Si estamos editando y no se cambió la contraseña, no enviarla
            if (usuario && !dataToSend.Contraseña.trim()) {
                delete dataToSend.Contraseña;
            }

            let result;

            if (usuario) {
                // Actualizar usuario existente
                result = await updateUsuario(usuario.DocumentoID, dataToSend);
            } else {
                // Crear nuevo usuario
                result = await createUsuario(dataToSend);
            }

            if (result.estado) {
                // Éxito - No mostramos alerta aquí, se manejará en el componente padre
                onSave(); // Llamar callback con los datos del usuario
            } else {
                throw new Error(result.mensaje || 'Error al guardar usuario');
            }

        } catch (error) {
            console.error('Error al guardar usuario:', error);
            throw error; // Propagar el error al componente padre
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            {/* Título */}
            <div className="position-relative mb-4 text-center">
                <p className="fw-bold fs-3 mb-0">
                    {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-danger btn-sm shadow-sm position-absolute top-0 end-0"
                    title="Cerrar"
                    disabled={loading}
                >
                    <FaTimes />
                </button>
            </div>

            {/* Formulario */}
            <form
                className="p-4 rounded shadow"
                style={{ backgroundColor: "#f5f5fa", color: "#2a273a" }}
                onSubmit={handleSubmit}
            >
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Documento:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.DocumentoID ? 'is-invalid' : ''}`}
                            name="DocumentoID"
                            value={formData.DocumentoID}
                            onChange={handleChange}
                            disabled={loading || !!usuario}
                            maxLength={15}
                            readOnly={!!usuario}
                            required
                        />
                        {errors.DocumentoID && (
                            <div className="invalid-feedback">{errors.DocumentoID}</div>
                        )}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Nombre:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.Nombre ? 'is-invalid' : ''}`}
                            name="Nombre"
                            value={formData.Nombre}
                            onChange={handleChange}
                            disabled={loading}
                            maxLength={50}
                            required
                        />
                        {errors.Nombre && (
                            <div className="invalid-feedback">{errors.Nombre}</div>
                        )}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Correo:</label>
                        <input
                            type="email"
                            className={`form-control ${errors.Correo ? 'is-invalid' : ''}`}
                            name="Correo"
                            value={formData.Correo}
                            onChange={handleChange}
                            disabled={loading}
                            maxLength={100}
                            required
                        />
                        {errors.Correo && (
                            <div className="invalid-feedback">{errors.Correo}</div>
                        )}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Teléfono:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.Telefono ? 'is-invalid' : ''}`}
                            name="Telefono"
                            value={formData.Telefono}
                            onChange={handleChange}
                            disabled={loading}
                            maxLength={15}
                            required
                        />
                        {errors.Telefono && (
                            <div className="invalid-feedback">{errors.Telefono}</div>
                        )}
                    </div>

                    <div className="col-12">
                        <label className="form-label">Dirección:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.Direccion ? 'is-invalid' : ''}`}
                            name="Direccion"
                            value={formData.Direccion}
                            onChange={handleChange}
                            disabled={loading}
                            maxLength={150}
                            required
                        />
                        {errors.Direccion && (
                            <div className="invalid-feedback">{errors.Direccion}</div>
                        )}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">
                            Contraseña:
                            {usuario && <small className="text-muted"> (dejar vacío para mantener actual)</small>}
                        </label>
                        <input
                            type="password"
                            className={`form-control ${errors.Contraseña ? 'is-invalid' : ''}`}
                            name="Contraseña"
                            value={formData.Contraseña}
                            onChange={handleChange}
                            disabled={loading}
                            maxLength={100}
                            required={!usuario} // Solo requerido para nuevos usuarios
                        />
                        {errors.Contraseña && (
                            <div className="invalid-feedback">{errors.Contraseña}</div>
                        )}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Rol:</label>
                        <select
                            className={`form-select ${errors.RolID ? 'is-invalid' : ''}`}
                            name="RolID"
                            value={formData.RolID}
                            onChange={handleChange}
                            disabled={loading || loadingRoles}
                            required
                        >
                            <option value="">
                                {loadingRoles ? 'Cargando roles...' : 'Seleccione un rol'}
                            </option>
                            {roles.map((rol) => (
                                <option key={rol.RolID} value={rol.RolID}>
                                    {rol.Nombre}
                                </option>
                            ))}
                        </select>
                        {errors.RolID && (
                            <div className="invalid-feedback">{errors.RolID}</div>
                        )}
                    </div>
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <button
                        type="submit"
                        className="btn btn-success px-4"
                        disabled={loading || loadingRoles}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {usuario ? 'Actualizando...' : 'Guardando...'}
                            </>
                        ) : (
                            usuario ? 'Actualizar Usuario' : 'Guardar Usuario'
                        )}
                    </button>

                    <button
                        type="button"
                        className="btn btn-danger px-4"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UsuariosForm;