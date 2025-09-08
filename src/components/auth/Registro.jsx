import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarComponent from "../landing/NavBarLanding";
import FooterComponent from "../landing/footer";

const RegistroLanding = () => {
    return (
        <>
            <NavbarComponent />

            <div className="d-flex justify-content-center align-items-center py-5 bg-light">
                <Card
                    style={{
                        width: "22rem",
                        backgroundColor: "#1d1a2b",
                        color: "#fff",
                    }}
                    className="p-4 shadow-lg rounded-4"
                >
                    <h5 className="text-center mb-4">Formulario de registro</h5>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" placeholder="Ingresa tu nombre" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Número documento</Form.Label>
                            <Form.Control type="text" placeholder="Número de documento" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control type="email" placeholder="Correo" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control type="text" placeholder="Teléfono" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control type="text" placeholder="Dirección" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Contraseña" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Confirmar contraseña" />
                        </Form.Group>

                        {/* Botón que redirige */}
                        <div className="d-grid mb-3">
                            <Link to="/login">
                                <Button variant="info" className="text-white fw-bold w-100">
                                    Registrar
                                </Button>
                            </Link>
                        </div>

                        <p className="text-center mb-0">
                            ¿Ya tienes cuenta? <Link to='/login' className="text-decoration-none">Inicia sesión</Link>
                        </p>
                    </Form>
                </Card>
            </div>

            <FooterComponent />
        </>
    );
};

export default RegistroLanding;
