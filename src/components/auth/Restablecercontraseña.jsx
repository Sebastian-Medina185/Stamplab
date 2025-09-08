import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarComponent from "../landing/NavBarLanding";
import FooterComponent from "../landing/footer";

const RestablecerContraseña = () => {
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
                    <h5 className="text-center mb-4">Restablecer Contraseña</h5>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nueva Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Ingresa tu nueva contraseña" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="confirma tu nueva contraseña" />
                        </Form.Group>


                        {/* Botón que redirige */}
                        <div className="d-grid mb-3">
                            <Link to="/login">
                                <Button variant="info" className="text-white fw-bold w-100">
                                    Actualizar
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

export default RestablecerContraseña;
