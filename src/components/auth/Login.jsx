import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import fondo from '../../assets/images/imagenfondo.png'; 
import NavbarComponent from "../landing/NavBarLanding";
import FooterComponent from "../landing/footer";

const LoginLanding = () => {
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
                                Formulario de Inicio de Sesión
                            </h4>

                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ingresa tu correo electrónico"
                                        className="rounded-3 shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Ingresa tu contraseña"
                                        className="rounded-3 shadow-sm"
                                    />
                                </Form.Group>

                                {/* Botón que redirige */}
                                <div className="d-grid mb-3">
                                    <Link to="/dashboard/roles">
                                        <Button
                                            variant="primary"
                                            className="fw-bold w-100 rounded-pill shadow-sm"
                                        >
                                            Iniciar Sesión
                                        </Button>
                                    </Link>
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
