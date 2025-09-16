import { useState } from "react";
import { Navbar, Nav, Container, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
// Importa el logo
// <-- Ajusta la ruta según dónde guardes la imagen
import logo from "../../assets/logo.png"; 


const NavbarComponent = () => {
    const [showPerfil, setShowPerfil] = useState(false);

    // Abrir/Cerrar modal perfil
    const handlePerfilOpen = () => setShowPerfil(true);
    const handlePerfilClose = () => setShowPerfil(false);

    return (
        <>
            {/* NAVBAR */}
            <Navbar style={{ height: "85px" }} bg="light" expand="md" className="shadow-sm">
                <Container>
                    {/* Logo como Brand */}
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                        <img
                            src="src/assets/logostamplab.png"
                            alt="StampLab Logo"
                            style={{ height: "71px" }}
                            className="me-2"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto align-items-center gap-3">
                            {/* Inicio */}
                            <Nav.Link
                                as={Link}
                                to="/landing"
                                style={{
                                    color: "#384c6f", // Azul rey por defecto
                                    fontWeight: 650,
                                    transition: "all 0.2s ease-in-out",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = "#64b5f6"; // Azul claro al pasar
                                    e.target.style.fontWeight = "600";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = "#384c6f"; // Vuelve al azul rey
                                    e.target.style.fontWeight = "650";
                                }}
                            >
                                Inicio
                            </Nav.Link>

                            {/* Cotización */}
                            <Nav.Link
                                as={Link}
                                to="/cotizacionesLanding"
                                style={{
                                    color: "#384c6f",
                                    fontWeight: 650,
                                    transition: "all 0.2s ease-in-out",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = "#64b5f6";
                                    e.target.style.fontWeight = "600";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = "#384c6f";
                                    e.target.style.fontWeight = "650";
                                }}
                            >
                                Cotización
                            </Nav.Link>

                            {/* Productos */}
                            <Nav.Link
                                as={Link}
                                to="/productosLanding"
                                style={{
                                    color: "#384c6f",
                                    fontWeight: 650,
                                    transition: "all 0.2s ease-in-out",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = "#64b5f6";
                                    e.target.style.fontWeight = "600";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = "#384c6f";
                                    e.target.style.fontWeight = "650";
                                }}
                            >
                                Productos
                            </Nav.Link>

                            {/* Servicios */}
                            <Nav.Link
                                as={Link}
                                to="/servicios"
                                style={{
                                    color: "#384c6f",
                                    fontWeight: 650,
                                    transition: "all 0.2s ease-in-out",
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = "#64b5f6";
                                    e.target.style.fontWeight = "600";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = "#384c6f";
                                    e.target.style.fontWeight = "650";
                                }}
                            >
                                Servicios
                            </Nav.Link>

                            {/* Icono Perfil */}
                            <FaUserCircle
                                size={30}
                                className="text-secondary"
                                style={{ cursor: "pointer" }}
                                onClick={handlePerfilOpen}
                            />

                            {/* Botón Cerrar Sesión */}
                            <Button as={Link} to="/login" variant="dark" size="sm">
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
