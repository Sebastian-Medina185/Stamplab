import { useState } from "react";
import { Navbar, Nav, Container, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const NavbarComponent = () => {
    const [showPerfil, setShowPerfil] = useState(false);

    // Abrir/Cerrar modal perfil
    const handlePerfilOpen = () => setShowPerfil(true);
    const handlePerfilClose = () => setShowPerfil(false);

    return (
        <>
            {/* NAVBAR */}
            <Navbar bg="light" expand="lg" className="shadow-sm">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold">
                        Estampados Lies
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center gap-3">
                            <Nav.Link as={Link} to="/landing">Inicio</Nav.Link>
                            <Nav.Link as={Link} to="/cotizacionesLanding">Cotización</Nav.Link>
                            <Nav.Link as={Link} to="/productosLanding">Productos</Nav.Link>
                            <Nav.Link as={Link} to="/servicios">Servicios</Nav.Link>

                            {/* Icono Perfil */}
                            <FaUserCircle
                                size={34}
                                className="text-secondary"
                                style={{ cursor: "pointer" }}
                                onClick={handlePerfilOpen}
                            />

                            {/* Botón Cerrar Sesión */}
                            <Button as={Link} to="/login" variant="dark">
                                Cerrar Sesión
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* MODAL PERFIL */}
            <Modal show={showPerfil} onHide={handlePerfilClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Perfil de Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <FaUserCircle size={60} className="mb-3 text-secondary" />
                    <h6 className="fw-normal fst-italic">Pepito Ramírez</h6>
                    <p className="text-muted small">pepito@gmail.com</p>

                    {/* Botones del modal */}
                    <div className="d-flex justify-content-center gap-2 mt-3">
                        <Button variant="secondary" onClick={handlePerfilClose}>
                            Cerrar Sesión
                        </Button>
                        <Button as={Link} to="/editarperfil" variant="primary">
                            Editar Información
                        </Button>
                    </div>

                    <div className="mt-3">
                        <Button
                            as={Link}
                            to="/miscotizaciones"
                            variant="info"
                            className="w-100 text-white fw-bold"
                        >
                            Mis Cotizaciones
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default NavbarComponent;
