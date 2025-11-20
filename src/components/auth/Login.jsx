import { useState } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { loginUsuario } from "../../Services/api-auth/auth";
import * as jose from 'jose';
import fondo from "../../assets/images/imagenfondo.png";
import NavbarComponent from "../landing/NavBarLanding";
import FooterComponent from "../landing/footer";

const LoginLanding = () => {
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // admin hardcodeado
            if (correo === "admin@gmail.com" && contraseña === "admin123") {

                // Generar token JWT válido usando jose
                const secret = new TextEncoder().encode('clave_secreta');
                const tokenAdmin = await new jose.SignJWT({ id: 'admin', rol: 1 })
                    .setProtectedHeader({ alg: 'HS256' })
                    .setIssuedAt()
                    .setExpirationTime('2h')
                    .sign(secret);

                // Guardar token válido
                localStorage.setItem("token", tokenAdmin);
                localStorage.setItem("user", JSON.stringify({
                    nombre: "Administrador",
                    rol: 1
                }));

                alert("Bienvenido Administrador");
                navigate("/dashboard");
                return;
            }

            // Login normal con la API para otros usuarios
            const res = await loginUsuario({
                Correo: correo,
                Contraseña: contraseña
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify({
                nombre: res.data.nombre,
                rol: res.data.rol
            }));

            if (res.data.rol === 1 || res.data.rol === "1") {
                alert(`Bienvenido Administrador ${res.data.nombre}`);
                navigate("/dashboard");
            } else {
                alert(`Bienvenido/a ${res.data.nombre}`);
                navigate("/landing");
            }

        } catch (err) {
            console.error("Error en login:", err);

            if (err.response?.data?.mensaje) {
                alert(err.response.data.mensaje);
            } else {
                alert("Error al iniciar sesión. Verifica tus credenciales.");
            }
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
                        width: "60rem",
                        backgroundColor: "#ffffff",
                        color: "#212529",
                        border: "1px solid #dee2e6",
                    }}
                    className="shadow-lg rounded-4 overflow-hidden"
                >
                    <Row className="g-0">
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

                        <Col md={6} className="p-5 d-flex flex-column justify-content-center">
                            <h4 className="text-center mb-4 fw-bold text-dark">
                                Formulario de Inicio de Sesión
                            </h4>

                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ingresa tu correo electrónico"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        className="rounded-3 shadow-sm"
                                        disabled={loading}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Ingresa tu contraseña"
                                        value={contraseña}
                                        onChange={(e) => setContraseña(e.target.value)}
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
                                                Iniciando sesión...
                                            </>
                                        ) : (
                                            'Iniciar Sesión'
                                        )}
                                    </Button>
                                </div>

                                <p className="text-center mb-0 text-secondary">
                                    ¿No tienes una cuenta?{" "}
                                    <Link
                                        to="/signup"
                                        className="fw-semibold text-primary text-decoration-none"
                                    >
                                        Registrarme
                                    </Link>
                                </p>

                                <br />
                                <p className="text-center mb-0 text-secondary">
                                    ¿Has olvidado tu contraseña? <br />
                                    <Link
                                        to="/recuperarcontraseña"
                                        className="fw-semibold text-primary text-decoration-none"
                                    >
                                        Recuperar contraseña
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

export default LoginLanding;