import { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { registrarUsuario } from "../../Services/api-auth/auth";
import fondo from "../../assets/images/imagenfondo.png";
import NavbarComponent from "../landing/NavBarLanding";
import FooterComponent from "../landing/footer";
import Swal from "sweetalert2";

const RegistroLanding = () => {
    const [nombre, setNombre] = useState("");
    const [documento, setDocumento] = useState("");
    const [correo, setCorreo] = useState("");
    const [telefono, setTelefono] = useState("");
    const [direccion, setDireccion] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegistro = async (e) => {
        e.preventDefault();

        if (contraseña !== confirmar) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Las contraseñas no coinciden",
            });
            return;
        }

        if (contraseña.length < 4) {
            Swal.fire({
                icon: "error",
                title: "Contraseña débil",
                text: "La contraseña debe tener al menos 4 caracteres",
            });
            return;
        }

        setLoading(true);

        try {
            const datos = {
                DocumentoID: documento.trim(),
                Nombre: nombre.trim(),
                Correo: correo.trim(),
                Telefono: telefono.trim(),
                Direccion: direccion.trim(),
                Contraseña: contraseña,
                RolID: 2, // Cliente
            };

            const response = await registrarUsuario(datos);

            // El backend puede devolver estado o no, manejamos ambos casos
            const registroExitoso = response.data?.estado !== false;

            if (registroExitoso) {
                Swal.fire({
                    icon: "success",
                    title: "¡Registro exitoso!",
                    text: "Tu cuenta ha sido creada. Por favor inicia sesión.",
                    confirmButtonColor: "#3085d6",
                }).then(() => {
                    navigate("/login");
                });
            } else {
                throw new Error(response.data?.mensaje || "Error al registrar usuario");
            }
        } catch (err) {
            console.error("Error en registro:", err);
            Swal.fire({
                icon: "error",
                title: "Error al registrarse",
                text: err.response?.data?.mensaje || err.message || "Verifica los datos e intenta nuevamente",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavbarComponent />

            <div className="d-flex justify-content-center align-items-center py-5 bg-light">
                <Card
                    style={{
                        width: "65rem",
                        backgroundColor: "#ffffff",
                        color: "#212529",
                        border: "1px solid #dee2e6",
                    }}
                    className="shadow-lg rounded-4 overflow-hidden"
                >
                    <Row className="g-0">
                        {/* Columna Izquierda - Imagen */}
                        <Col md={6} className="d-none d-md-block">
                            <div
                                style={{
                                    backgroundImage: `url(${fondo})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    height: "100%",
                                    width: "100%",
                                }}
                            ></div>
                        </Col>

                        {/* Columna Derecha - Formulario */}
                        <Col md={6} className="p-5 d-flex flex-column justify-content-center">
                            <h4 className="text-center mb-4 fw-bold text-dark">
                                Formulario de Registro
                            </h4>

                            <Form onSubmit={handleRegistro}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Nombre</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ingresa tu nombre"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                className="rounded-3 shadow-sm"
                                                disabled={loading}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Número documento</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Número de documento"
                                                value={documento}
                                                onChange={(e) => setDocumento(e.target.value)}
                                                className="rounded-3 shadow-sm"
                                                disabled={loading}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                placeholder="Correo"
                                                value={correo}
                                                onChange={(e) => setCorreo(e.target.value)}
                                                className="rounded-3 shadow-sm"
                                                disabled={loading}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Teléfono</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Teléfono"
                                                value={telefono}
                                                onChange={(e) => setTelefono(e.target.value)}
                                                className="rounded-3 shadow-sm"
                                                disabled={loading}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Dirección</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Dirección"
                                                value={direccion}
                                                onChange={(e) => setDireccion(e.target.value)}
                                                className="rounded-3 shadow-sm"
                                                disabled={loading}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Contraseña"
                                                value={contraseña}
                                                onChange={(e) => setContraseña(e.target.value)}
                                                className="rounded-3 shadow-sm"
                                                disabled={loading}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Confirmar contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirmar contraseña"
                                        value={confirmar}
                                        onChange={(e) => setConfirmar(e.target.value)}
                                        className="rounded-3 shadow-sm"
                                        disabled={loading}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid mb-3">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="fw-bold w-100 rounded-pill shadow-sm"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Registrando...
                                            </>
                                        ) : (
                                            "Registrar"
                                        )}
                                    </Button>
                                </div>

                                <p className="text-center mb-0 text-secondary">
                                    ¿Ya tienes cuenta?{" "}
                                    <Link
                                        to="/login"
                                        className="fw-semibold text-primary text-decoration-none"
                                    >
                                        Inicia sesión
                                    </Link>
                                </p>
                            </Form>
                        </Col>
                    </Row>
                </Card>
            </div>

            <FooterComponent />
        </>
    );
};

export default RegistroLanding;