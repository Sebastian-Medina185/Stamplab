import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import fondo from "../../assets/images/imagenfondo.png"; // ✅ imagen importada
import NavbarComponent from "../landing/NavBarLanding";
import FooterComponent from "../landing/footer";

const RegistroLanding = () => {
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

                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Nombre</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ingresa tu nombre"
                                                className="rounded-3 shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Número documento</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Número de documento"
                                                className="rounded-3 shadow-sm"
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
                                                className="rounded-3 shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Teléfono</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Teléfono"
                                                className="rounded-3 shadow-sm"
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
                                                className="rounded-3 shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-semibold">Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                placeholder="Contraseña"
                                                className="rounded-3 shadow-sm"
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-semibold">Confirmar contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirmar contraseña"
                                        className="rounded-3 shadow-sm"
                                    />
                                </Form.Group>

                                {/* Botón que redirige */}
                                <div className="d-grid mb-3">
                                    <Link to="/login">
                                        <Button
                                            variant="primary"
                                            className="fw-bold w-100 rounded-pill shadow-sm"
                                        >
                                            Registrar
                                        </Button>
                                    </Link>
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
