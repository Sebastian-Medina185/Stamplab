import { useState, useEffect } from "react";
import { Form, Card, Button } from "react-bootstrap";
import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUsuarioById, updateUsuario } from "../../Services/api-usuarios/usuarios";

const EditarPerfil = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        DocumentoID: "",
        Nombre: "",
        Correo: "",
        Telefono: "",
        Direccion: "",
        Contraseña: "",
    });

    useEffect(() => {
        cargarDatosUsuario();
    }, []);

    const cargarDatosUsuario = async () => {
        try {
            const user = localStorage.getItem("usuario");
            if (!user) {
                Swal.fire({
                    icon: "warning",
                    title: "No autenticado",
                    text: "Debes iniciar sesión para acceder a esta página",
                }).then(() => {
                    navigate("/login");
                });
                return;
            }

            const userData = JSON.parse(user);
            console.log("Datos del usuario en localStorage:", userData); // Para depurar
            
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            // Verificar que exista documentoID
            if (!userData.DocumentoID) {
                console.error("No se encontró documentoID en localStorage");
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hay un problema con tu sesión. Por favor inicia sesión nuevamente.",
                }).then(() => {
                    localStorage.clear();
                    navigate("/login");
                });
                return;
            }

            console.log("Cargando usuario con ID:", userData.DocumentoID); // Para depurar

            // Obtener datos completos del usuario desde la API
            const response = await getUsuarioById(userData.DocumentoID);

            console.log("Respuesta de la API:", response); // Para depurar

            if (response) {
                setFormData({
                    DocumentoID: response.DocumentoID || "",
                    Nombre: response.Nombre || "",
                    Correo: response.Correo || "",
                    Telefono: response.Telefono || "",
                    Direccion: response.Direccion || "",
                    Contraseña: "",
                });
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
            console.error("Detalles del error:", error.response); // Para ver más detalles
            
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.mensaje || error.message || "No se pudieron cargar tus datos",
            });
        } finally {
            setLoading(false);
        }
    };

    // Validaciones simplificadas
    const validarNombre = (nombre) => {
        const nom = String(nombre || "").trim();
        if (!nom) return "El nombre es obligatorio";
        if (nom.length < 3 || nom.length > 50) return "Entre 3 y 50 caracteres";
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/.test(nom)) return "Solo letras";
        return "";
    };

    const validarCorreo = (correo) => {
        const cor = String(correo || "").trim();
        if (!cor) return "El correo es obligatorio";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cor)) return "Correo inválido";
        return "";
    };

    const validarTelefono = (telefono) => {
        const tel = String(telefono || "").trim();
        if (!tel) return "El teléfono es obligatorio";
        if (!/^\d+$/.test(tel)) return "Solo números";
        if (tel.length < 7 || tel.length > 10) return "Entre 7 y 10 dígitos";
        return "";
    };

    const validarDireccion = (direccion) => {
        const dir = String(direccion || "").trim();
        if (!dir) return "La dirección es obligatoria";
        return "";
    };

    const validarContraseña = (contraseña) => {
        if (!contraseña) return ""; // Opcional
        if (contraseña.length < 4) return "Mínimo 4 caracteres";
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
                error = validarContraseña(value);
                break;
            default:
                break;
        }

        setErrors({
            ...errors,
            [name]: error,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar todos los campos
        const erroresValidacion = {
            Nombre: validarNombre(formData.Nombre),
            Correo: validarCorreo(formData.Correo),
            Telefono: validarTelefono(formData.Telefono),
            Direccion: validarDireccion(formData.Direccion),
            Contraseña: validarContraseña(formData.Contraseña),
        };

        const erroresActivos = Object.entries(erroresValidacion)
            .filter(([_, valor]) => valor !== "")
            .reduce((acc, [clave, valor]) => ({ ...acc, [clave]: valor }), {});

        if (Object.keys(erroresActivos).length > 0) {
            setErrors(erroresActivos);
            Swal.fire({
                icon: "error",
                title: "Errores en el formulario",
                text: "Por favor corrige los errores antes de continuar",
            });
            return;
        }

        try {
            setLoading(true);

            const dataToSend = {
                Nombre: formData.Nombre.trim(),
                Correo: formData.Correo.trim(),
                Telefono: formData.Telefono.trim(),
                Direccion: formData.Direccion.trim(),
            };

            // Solo enviar contraseña si se ingresó una nueva
            if (formData.Contraseña && formData.Contraseña.trim()) {
                dataToSend.Contraseña = formData.Contraseña.trim();
            }

            const response = await updateUsuario(formData.DocumentoID, dataToSend);

            if (response.estado) {
                Swal.fire({
                    icon: "success",
                    title: "¡Perfil actualizado!",
                    text: "Por seguridad, debes iniciar sesión nuevamente",
                    confirmButtonColor: "#3085d6",
                }).then(() => {
                    // Cerrar sesión
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    navigate("/login");
                });
            } else {
                throw new Error(response.mensaje || "Error al actualizar perfil");
            }
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.mensaje || error.message || "Error al actualizar el perfil",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <NavbarComponent />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="text-muted">Cargando tus datos...</p>
                    </div>
                </div>
                <FooterComponent />
            </>
        );
    }

    return (
        <>
            <NavbarComponent />

            <div className="d-flex justify-content-center align-items-center py-5 bg-light">
                <Card
                    style={{
                        width: "32rem",
                        backgroundColor: "#ffffff",
                        color: "#212529",
                        border: "1px solid #dee2e6",
                    }}
                    className="p-4 shadow-lg rounded-4"
                >
                    <h4 className="text-center mb-4 fw-bold text-dark">
                        Editar Perfil
                    </h4>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="Nombre"
                                value={formData.Nombre}
                                onChange={handleChange}
                                className={`rounded-3 shadow-sm ${errors.Nombre ? "is-invalid" : ""}`}
                                disabled={loading}
                                required
                            />
                            {errors.Nombre && (
                                <div className="invalid-feedback">{errors.Nombre}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Número documento</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.DocumentoID}
                                className="rounded-3 shadow-sm bg-light"
                                disabled
                                readOnly
                            />
                            <small className="text-muted">El documento no puede ser modificado</small>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="Correo"
                                value={formData.Correo}
                                onChange={handleChange}
                                className={`rounded-3 shadow-sm ${errors.Correo ? "is-invalid" : ""}`}
                                disabled={loading}
                                required
                            />
                            {errors.Correo && (
                                <div className="invalid-feedback">{errors.Correo}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="Telefono"
                                value={formData.Telefono}
                                onChange={handleChange}
                                className={`rounded-3 shadow-sm ${errors.Telefono ? "is-invalid" : ""}`}
                                disabled={loading}
                                required
                            />
                            {errors.Telefono && (
                                <div className="invalid-feedback">{errors.Telefono}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="Direccion"
                                value={formData.Direccion}
                                onChange={handleChange}
                                className={`rounded-3 shadow-sm ${errors.Direccion ? "is-invalid" : ""}`}
                                disabled={loading}
                                required
                            />
                            {errors.Direccion && (
                                <div className="invalid-feedback">{errors.Direccion}</div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">
                                Nueva Contraseña <small className="text-muted">(Opcional)</small>
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="Contraseña"
                                value={formData.Contraseña}
                                onChange={handleChange}
                                placeholder="Dejar vacío para mantener la actual"
                                className={`rounded-3 shadow-sm ${errors.Contraseña ? "is-invalid" : ""}`}
                                disabled={loading}
                            />
                            {errors.Contraseña && (
                                <div className="invalid-feedback">{errors.Contraseña}</div>
                            )}
                            <small className="text-muted">Mínimo 4 caracteres</small>
                        </Form.Group>

                        <div className="d-flex justify-content-center gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate("/landing")}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="success"
                                className="fw-bold rounded-pill shadow-sm"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Guardando...
                                    </>
                                ) : (
                                    "Guardar Cambios"
                                )}
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>

            <FooterComponent />
        </>
    );
};

export default EditarPerfil;