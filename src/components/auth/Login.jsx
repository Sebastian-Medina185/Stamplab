import { Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavbarComponent from "../landing/NavBarLanding";
import FooterComponent from "../landing/footer";

const LoginLanding = () => {
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
                    <h5 className="text-center mb-4">Formulario de Inicio de Sesión</h5>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control type="text" placeholder="Ingresa tu nombre" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="text" placeholder="Ingresa tu contraseña" />
                        </Form.Group>


                        {/* Botón que redirige */}
                        <div className="d-grid mb-3">
                            <Link to="/usuarios">
                                <Button variant="info" className="text-white fw-bold w-100">
                                    Iniciar Sesión
                                </Button>
                            </Link>
                        </div>

                        <p className="text-center mb-0">
                            ¿No tienes una Cuenta? <Link to='/signup' className="text-decoration-none">Registrarme</Link>
                        </p> <br />
                        <p className="text-center mb-0">
                            ¿Has olvidado tu contraseña? <br />
                            <Link to='/recuperarcontraseña' className="text-decoration-none">Recuperar contraseña</Link>
                        </p>
                    </Form>
                </Card>
            </div>

            <FooterComponent />
        </>
    );
};

export default LoginLanding;
