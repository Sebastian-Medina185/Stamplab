import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const NavAdmin = () => {
    const [showPerfil, setShowPerfil] = useState(false);
    const [showEditar, setShowEditar] = useState(false);

    // Abrir modal de perfil
    const handlePerfilOpen = () => setShowPerfil(true);
    const handlePerfilClose = () => setShowPerfil(false);

    // Abrir modal de editar
    const handleEditarOpen = () => {
        setShowPerfil(false);
        setShowEditar(true);
    };
    const handleEditarClose = () => setShowEditar(false);

    return (
        <>
            {/* Navbar */}
            <header
                className="d-flex justify-content-between align-items-center px-4"
                style={{
                    height: "64px",
                    backgroundColor: "#fff",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                }}
            >
                {/* Nombre aplicativo */}
                <h1 className="fw-bold fs-3 ms-3 mt-1">Stamlab</h1>

                {/* Administrador + Perfil */}
                <div className="d-flex align-items-center gap-3">
                    <span className="fw-medium">Administrador</span>
                    <FaUserCircle
                        size={35}
                        className="text-secondary"
                        style={{ cursor: "pointer" }}
                        onClick={handlePerfilOpen}
                    />
                    <Link to="/login" className="btn btn-dark px-3 py-1 me-2">
                        Cerrar Sesión
                    </Link>
                </div>
            </header>

            {/* Modal Perfil */}
            <Modal show={showPerfil} onHide={handlePerfilClose} centered>
                <Modal.Body className="text-center">
                    <FaUserCircle size={50} className="mb-3" />
                    <h6 className="fw-normal fst-italic">pepito ramirez</h6>
                    <p className="text-muted small">pepito@gmail.com</p>
                    <Button variant="primary" onClick={handleEditarOpen}>
                        Editar Información
                    </Button>
                </Modal.Body>
                <Button
                    variant="danger"
                    className="position-absolute top-0 end-0 m-2"
                    onClick={handlePerfilClose}
                >
                    X
                </Button>
            </Modal>


            {/* Modal Editar Perfil */}
            <Modal show={showEditar} onHide={handleEditarClose} centered>
                <Modal.Header closeButton className="justify-content-center">
                    <Modal.Title className="w-100 text-center">Editar Perfil</Modal.Title>
                </Modal.Header>

                
                <Modal.Body style={{ backgroundColor: "#1d1a2b", color: "#fff" }}>
                    <Form>
                        <div className="row">
                            <Form.Group className="mb-3 col-6">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" defaultValue="pepito perez" />
                            </Form.Group>

                            <Form.Group className="mb-3 col-6">
                                <Form.Label>Número documento</Form.Label>
                                <Form.Control type="text" defaultValue="129292929202020" />
                            </Form.Group>
                        </div>

                        <div className="row">
                            <Form.Group className="mb-3 col-6">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control type="email" defaultValue="pepito@gmail.com" />
                            </Form.Group>

                            <Form.Group className="mb-3 col-6">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control type="text" defaultValue="31077532414" />
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" defaultValue="12345678" />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button variant="info" className="text-white fw-bold w-50">
                                Guardar Cambios
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="danger" onClick={handleEditarClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>


        </>
    );
};

export default NavAdmin;
