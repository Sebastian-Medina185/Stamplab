import { Form, Card } from "react-bootstrap";
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

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue="pepito perez"
                                className="rounded-3 shadow-sm"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Número documento</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue="129292929202020"
                                className="rounded-3 shadow-sm"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Correo electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                defaultValue="pepito@gmail.com"
                                className="rounded-3 shadow-sm"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue="31077532414"
                                className="rounded-3 shadow-sm"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                defaultValue="12345678"
                                className="rounded-3 shadow-sm"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Link
                                to="/login"
                                className="btn btn-success fw-bold w-50 rounded-pill shadow-sm"
                            >
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
