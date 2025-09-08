import { Form, Button, Card } from "react-bootstrap";
import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";
import { Link } from "react-router-dom";

const EditarPerfil = () => {
    return (
        <>
            <NavbarComponent />

            <div className="d-flex justify-content-center align-items-center py-5 bg-light">
                <Card
                    style={{
                        width: "28rem",
                        backgroundColor: "#1d1a2b",
                        color: "#fff",
                    }}
                    className="p-4 shadow-lg rounded-4"
                >
                    <h4 className="text-center mb-4">Editar Perfil</h4>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control type="text" defaultValue="pepito perez" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Número documento</Form.Label>
                            <Form.Control type="text" defaultValue="129292929202020" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control type="email" defaultValue="pepito@gmail.com" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control type="text" defaultValue="31077532414" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" defaultValue="12345678" />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Link to='/login' className="btn btn-info text-white fw-bold w-50">
                                Guardar Cambios
                            </Link>
                        </div>
                    </Form>
                </Card>
            </div>

            <FooterComponent />
        </>
    );
};

export default EditarPerfil;
