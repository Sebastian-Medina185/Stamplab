import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarComponent from "../landing/NavBarLanding";
import FooterComponent from "../landing/footer";

const RecuperarContraseña = () => {
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
                    <h5 className="text-center mb-4">Recuperar Contraseña</h5>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Introduce tu correo electronico  asociado a tu cuenta para restablecer </Form.Label>
                            <Form.Control type="text" placeholder="Ingresa tu correo electronico" />
                        </Form.Group>

                        {/* Botón que redirige */}
                        <div className="d-grid mb-3">
                            <Link to="/restablecercontraseña">
                                <Button variant="info" className="text-white fw-bold w-100">
                                    Enviar
                                </Button>
                            </Link>
                        </div>

                    </Form>
                </Card>
            </div>

            <FooterComponent />
        </>
    );
};

export default RecuperarContraseña;
