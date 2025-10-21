// src/pages/formularios_dash/usuariosForm.jsx
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
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
                Contraseña: "",
                RolID: usuario.RolID ? usuario.RolID.toString() : "",
            });
        }
    }, [usuario]);

    const loadRoles = async () => {
        try {
            setLoadingRoles(true);
            const result = await getRoles();

            if (result.estado && Array.isArray(result.datos)) {
                const rolesFormateados = result.datos.map(rol => ({
                    ...rol,
                    RolID: rol.RolID.toString()
                }));
                setRoles(rolesFormateados);
            } else {
                setRoles([]);
            }
        } catch (error) {
            console.error("Error al cargar roles:", error);
            setRoles([]);
        } finally {
            setLoadingRoles(false);
        }
    };

    // Validaciones individuales por campo
    const validarDocumento = (documento) => {
        const doc = documento.trim();
        if (!doc) return "El número de documento es obligatorio";
        if (!/^\d+$/.test(doc)) return "El documento solo puede contener números";
        if (doc.length < 4) return "El documento debe tener al menos 4 dígitos";
        if (doc.length > 10) return "El documento no puede tener más de 10 dígitos";
        return "";
    };

    const validarNombre = (nombre) => {
        const nom = nombre.trim();
        if (!nom) return "El nombre es obligatorio y no puede estar vacío";
        if (nom.length < 3) return "El nombre debe tener al menos 3 caracteres";
        if (nom.length > 30) return "El nombre no puede tener más de 30 caracteres";
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/.test(nom)) return "El nombre solo puede contener letras y espacios";
        return "";
    };

    const validarCorreo = (correo) => {
        const cor = correo.trim();
        if (!cor) return "El correo electrónico es obligatorio";
        if (cor.length < 6) return "El correo debe tener al menos 6 caracteres";
        if (cor.length > 40) return "El correo no puede tener más de 40 caracteres";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cor)) return "Formato de correo electrónico inválido";
        return "";
    };

    const validarTelefono = (telefono) => {
        const tel = telefono.trim();
        if (!tel) return "El teléfono es obligatorio";
        if (!/^\d+$/.test(tel)) return "El teléfono solo puede contener números";
        if (tel.length < 7) return "El teléfono debe tener al menos 7 dígitos";
        if (tel.length > 10) return "El teléfono no puede tener más de 10 dígitos";
        return "";
    };

    const validarDireccion = (direccion) => {
        const dir = direccion.trim();
        if (!dir) return "La dirección es obligatoria";
        if (dir.length < 8) return "La dirección debe tener al menos 8 caracteres";
        if (dir.length > 80) return "La dirección no puede tener más de 80 caracteres";
        return "";
    };

    const validarContraseña = (contraseña, esEdicion) => {
        if (esEdicion && !contraseña) return ""; // En edición es opcional
        if (!contraseña) return "La contraseña es obligatoria";
        if (contraseña.length < 8) return "La contraseña debe tener al menos 8 caracteres";
        if (contraseña.length > 50) return "La contraseña no puede tener más de 50 caracteres";
        if (!/[A-Z]/.test(contraseña)) return "Debe contener al menos una letra mayúscula";
        if (!/[a-z]/.test(contraseña)) return "Debe contener al menos una letra minúscula";
        if (!/[0-9]/.test(contraseña)) return "Debe contener al menos un número";
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(contraseña)) return "Debe contener al menos un carácter especial (!@#$%^&*...)";
        return "";
    };

    const validarRol = (rolID) => {
        if (!rolID || rolID === "") return "Debe seleccionar un rol";
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Validar en tiempo real
        let error = "";
        switch (name) {
            case "DocumentoID":
                error = validarDocumento(value);
                break;
            case "Nombre":
                error = validarNombre(value);
                break;
            case "Correo":
                error = validarCorreo(value);
                break;
            case "Telefono":
                error = validarTelefono(value);
                break;
            case "Direccion":
                error = validarDireccion(value);
                break;
            case "Contraseña":
                error = validarContraseña(value, !!usuario);
                break;
            case "RolID":
                error = validarRol(value);
                break;
            default:
                break;
        }

        setErrors({
            ...errors,
            [name]: error
        });
    };

    const validateForm = () => {
        const newErrors = {
            DocumentoID: validarDocumento(formData.DocumentoID),
            Nombre: validarNombre(formData.Nombre),
            Correo: validarCorreo(formData.Correo),
            Telefono: validarTelefono(formData.Telefono),
            Direccion: validarDireccion(formData.Direccion),
            Contraseña: validarContraseña(formData.Contraseña, !!usuario),
            RolID: validarRol(formData.RolID),
        };

        // Filtrar solo los errores que tienen valor
        const filteredErrors = {};
        Object.keys(newErrors).forEach(key => {
            if (newErrors[key]) {
                filteredErrors[key] = newErrors[key];
            }
        });

        return filteredErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            Swal.fire({
                icon: 'error',
                title: 'Errores en el formulario',
                text: 'Por favor corrija los errores antes de continuar',
            });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const dataToSend = { ...formData };

            // Si estamos editando y no se cambió la contraseña, no enviarla
            if (usuario && !dataToSend.Contraseña.trim()) {
                delete dataToSend.Contraseña;
            }

            let result;

            if (usuario) {
                result = await updateUsuario(usuario.DocumentoID, dataToSend);
            } else {
                result = await createUsuario(dataToSend);
            }

            if (result.estado) {
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
                    title: usuario ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente'
                });

                onSave();
            } else {
                throw new Error(result.mensaje || 'Error al guardar usuario');
            }

        } catch (error) {
            console.error('Error al guardar usuario:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Error al guardar el usuario'
            });
        } finally {
            setLoading(false);
        }
    };

    const tieneErrores = Object.values(errors).some(error => error !== "");

    return (
        <div className="card shadow-sm border-0 p-4 mx-4">
            <div className="position-relative mb-4 text-center">
                <p className="fw-bold fs-3 mb-0">
                    {usuario ? 'Editar Usuario' : 'Crear Usuario'}
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-warning btn-sm shadow-sm position-absolute top-0 end-0"
                    disabled={loading}
                >
                    <FaTimes />
                </button>
            </div>

            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-6">
                    <label className="form-label fw-bold">Documento</label>
                    <input
                        type="text"
                        className={`form-control ${errors.DocumentoID ? 'is-invalid' : ''}`}
                        name="DocumentoID"
                        value={formData.DocumentoID}
                        onChange={handleChange}
                        disabled={loading || !!usuario}
                        readOnly={!!usuario}
                        placeholder="Ej: 123456789"
                        required
                    />
                    {errors.DocumentoID && (
                        <div className="invalid-feedback">{errors.DocumentoID}</div>
                    )}
                    {/* {!usuario && (
                        <small className="form-text text-muted">
                            Entre 4 y 10 dígitos. Solo números.
                        </small>
                    )} */}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-bold">Nombre Completo</label>
                    <input
                        type="text"
                        className={`form-control ${errors.Nombre ? 'is-invalid' : ''}`}
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Ej: Juan Pérez"
                        required
                    />
                    {errors.Nombre && (
                        <div className="invalid-feedback">{errors.Nombre}</div>
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-bold">Correo Electrónico</label>
                    <input
                        type="email"
                        className={`form-control ${errors.Correo ? 'is-invalid' : ''}`}
                        name="Correo"
                        value={formData.Correo}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="correo@ejemplo.com"
                        required
                    />
                    {errors.Correo && (
                        <div className="invalid-feedback">{errors.Correo}</div>
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-bold">Teléfono</label>
                    <input
                        type="text"
                        className={`form-control ${errors.Telefono ? 'is-invalid' : ''}`}
                        name="Telefono"
                        value={formData.Telefono}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="3001234567"
                        required
                    />
                    {errors.Telefono && (
                        <div className="invalid-feedback">{errors.Telefono}</div>
                    )}
                </div>

                <div className="col-12">
                    <label className="form-label fw-bold">Dirección</label>
                    <input
                        type="text"
                        className={`form-control ${errors.Direccion ? 'is-invalid' : ''}`}
                        name="Direccion"
                        value={formData.Direccion}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Calle 123 #45-67, Barrio, Ciudad"
                        required
                    />
                    {errors.Direccion && (
                        <div className="invalid-feedback">{errors.Direccion}</div>
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-bold">
                        Contraseña
                        {usuario && <small className="text-muted"> (opcional - dejar vacío para mantener)</small>}
                    </label>
                    <input
                        type="password"
                        className={`form-control ${errors.Contraseña ? 'is-invalid' : ''}`}
                        name="Contraseña"
                        value={formData.Contraseña}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="********"
                        required={!usuario}
                    />
                    {errors.Contraseña && (
                        <div className="invalid-feedback">{errors.Contraseña}</div>
                    )}
                </div>

                <div className="col-md-6">
                    <label className="form-label fw-bold">Rol</label>
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

                <div className="col-12 d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary shadow-sm"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary shadow-sm"
                        disabled={loading || loadingRoles || tieneErrores}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                {usuario ? 'Actualizando...' : 'Guardando...'}
                            </>
                        ) : (
                            usuario ? 'Actualizar' : 'Guardar'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UsuariosForm;