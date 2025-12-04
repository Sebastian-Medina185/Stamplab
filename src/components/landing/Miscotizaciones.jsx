import React, { useState, useEffect } from "react";
import { Table, Badge, Button, Modal, Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaEye, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";
import { getCotizaciones } from "../../Services/api-cotizaciones/cotizaciones";

const MisCotizaciones = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [cotizaciones, setCotizaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);

    useEffect(() => {
        verificarAutenticacion();
        cargarCotizaciones();
    }, []);

    const verificarAutenticacion = () => {
        const usuarioStorage = localStorage.getItem("usuario");
        if (!usuarioStorage) {
            Swal.fire({
                icon: "warning",
                title: "Autenticación requerida",
                text: "Debes iniciar sesión para ver tus cotizaciones",
            }).then(() => {
                navigate("/login");
            });
            return;
        }
        setUsuario(JSON.parse(usuarioStorage));
    };

    // En MisCotizaciones.jsx - Corregir el mapeo de cotizaciones

    const cargarCotizaciones = async () => {
        setCargando(true);
        try {
            const usuarioStorage = localStorage.getItem("usuario");
            if (!usuarioStorage) return;

            const usuarioData = JSON.parse(usuarioStorage);
            const response = await getCotizaciones();
            const data = Array.isArray(response) ? response : (response?.datos || []);

            // Filtrar correctamente por DocumentoID del usuario
            const misCotizaciones = data.filter(c => {
                const docID = c.usuario?.DocumentoID || c.DocumentoID;
                return docID === usuarioData.DocumentoID;
            });

            const cotizacionesMapeadas = misCotizaciones.map(c => {
                // Obtener el primer detalle correctamente
                const primerDetalle = c.detalles?.[0] || {};
                const producto = primerDetalle.producto || {};

                return {
                    CotizacionID: c.CotizacionID,
                    FechaCotizacion: c.FechaCotizacion,
                    EstadoID: c.EstadoID || c.estado?.EstadoID || 1,
                    // Solo el nombre del estado, no el objeto completo
                    Estado: c.estado?.Nombre || "Pendiente",
                    ValorTotal: c.ValorTotal || 0,
                    Producto: {
                        Nombre: producto.Nombre || "Sin producto",
                        // Usar imagen local en lugar de placeholder
                        ImagenProducto: producto.ImagenProducto || "/placeholder-product.png"
                    },
                    Cantidad: primerDetalle.Cantidad || 0,
                    TraePrenda: primerDetalle.TraePrenda || false,
                    PrendaDescripcion: primerDetalle.PrendaDescripcion || "",
                    // Mapear diseños correctamente
                    Disenos: (primerDetalle.tecnicas || []).map(t => ({
                        TecnicaNombre: t.tecnica?.Nombre || "N/A",
                        ParteNombre: t.parte?.Nombre || "N/A"
                    })),
                    Detalles: c.detalles || []
                };
            });

            setCotizaciones(cotizacionesMapeadas);
        } catch (error) {
            console.error("Error al cargar cotizaciones:", error);
            Swal.fire("Error", "No se pudieron cargar tus cotizaciones", "error");
        } finally {
            setCargando(false);
        }
    };

    const handleVerDetalle = (cotizacion) => {
        setCotizacionSeleccionada(cotizacion);
        setShowModal(true);
    };

    const obtenerBadgeEstado = (estado) => {
        switch (estado) {
            case "Pendiente":
                return <Badge bg="warning" className="px-3 py-2">
                    <FaClock className="me-1" /> Pendiente
                </Badge>;
            case "Aprobada":
                return <Badge bg="success" className="px-3 py-2">
                    <FaCheckCircle className="me-1" /> Aprobada
                </Badge>;
            case "Rechazada":
                return <Badge bg="danger" className="px-3 py-2">
                    <FaTimesCircle className="me-1" /> Rechazada
                </Badge>;
            default:
                return <Badge bg="secondary" className="px-3 py-2">{estado}</Badge>;
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <>
            <NavbarComponent />

            <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold mb-0">Mis Cotizaciones</h3>
                        {usuario && (
                            <p className="text-muted mb-0">
                                Bienvenido, {usuario.Nombre}
                            </p>
                        )}
                    </div>
                    <Button variant="primary" href="/productosLanding">
                        + Nueva Cotización
                    </Button>
                </div>

                {cargando ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3 text-muted">Cargando cotizaciones...</p>
                    </div>
                ) : cotizaciones.length === 0 ? (
                    <Alert variant="info" className="text-center py-5">
                        <h5>No tienes cotizaciones registradas</h5>
                        <p className="mb-3">Explora nuestros productos y solicita tu primera cotización</p>
                        <Button variant="primary" href="/productosLanding">
                            Ver Productos
                        </Button>
                    </Alert>
                ) : (
                    <div className="table-responsive shadow-sm">
                        <Table hover className="mb-0 align-middle">
                            <thead style={{ backgroundColor: '#f8f9fa' }}>
                                <tr>
                                    <th>ID</th>
                                    <th>Producto</th>
                                    <th>Fecha</th>
                                    <th>Cantidad</th>
                                    <th className="text-center">Estado</th>
                                    <th className="text-end">Valor Total</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cotizaciones.map((cot) => (
                                    <tr key={cot.CotizacionID}>
                                        <td className="fw-medium">#{cot.CotizacionID}</td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <img
                                                    src={cot.Producto.ImagenProducto}
                                                    alt={cot.Producto.Nombre}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                        borderRadius: '6px'
                                                    }}
                                                />
                                                <span className="fw-medium">{cot.Producto.Nombre}</span>
                                            </div>
                                        </td>
                                        <td>{formatearFecha(cot.FechaCotizacion)}</td>
                                        <td>
                                            <Badge bg="secondary">{cot.Cantidad} unidades</Badge>
                                        </td>
                                        <td className="text-center">
                                            {obtenerBadgeEstado(cot.Estado)}
                                        </td>
                                        <td className="text-end fw-bold">
                                            {cot.ValorTotal ? (
                                                <span className="text-success">
                                                    ${cot.ValorTotal.toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="text-muted">Por calcular</span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleVerDetalle(cot)}
                                            >
                                                <FaEye className="me-1" /> Ver Detalle
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Modal Detalle de Cotización */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Detalle de Cotización #{cotizacionSeleccionada?.CotizacionID}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {cotizacionSeleccionada && (
                        <>
                            {/* Estado y Fecha */}
                            <Row className="mb-4">
                                <Col md={6}>
                                    <div className="d-flex align-items-center gap-2">
                                        <strong>Estado:</strong>
                                        {obtenerBadgeEstado(cotizacionSeleccionada.Estado)}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <strong>Fecha:</strong> {formatearFecha(cotizacionSeleccionada.FechaCotizacion)}
                                </Col>
                            </Row>

                            {/* Producto */}
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h6 className="card-title fw-bold">Producto</h6>
                                    <div className="d-flex align-items-center gap-3">
                                        <img
                                            src={cotizacionSeleccionada.Producto.ImagenProducto}
                                            alt={cotizacionSeleccionada.Producto.Nombre}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <div>
                                            <h5 className="mb-2">{cotizacionSeleccionada.Producto.Nombre}</h5>
                                            <p className="mb-1">
                                                <strong>Cantidad:</strong> {cotizacionSeleccionada.Cantidad} unidades
                                            </p>
                                            {cotizacionSeleccionada.TraePrenda && (
                                                <Badge bg="info">Traes tu propia prenda</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Prenda Propia */}
                            {cotizacionSeleccionada.TraePrenda && cotizacionSeleccionada.PrendaDescripcion && (
                                <Alert variant="info" className="mb-3">
                                    <strong>Descripción de tu prenda:</strong>
                                    <p className="mb-0 mt-2">{cotizacionSeleccionada.PrendaDescripcion}</p>
                                </Alert>
                            )}

                            {/* Diseños */}
                            {cotizacionSeleccionada.Disenos && cotizacionSeleccionada.Disenos.length > 0 && (
                                <div className="card mb-3">
                                    <div className="card-body">
                                        <h6 className="card-title fw-bold">Diseños Solicitados</h6>
                                        <Table size="sm" bordered>
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Técnica</th>
                                                    <th>Parte</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cotizacionSeleccionada.Disenos.map((d, i) => (
                                                    <tr key={i}>
                                                        <td>{d.TecnicaNombre || d.tecnica?.Nombre || "N/A"}</td>
                                                        <td>{d.ParteNombre || d.parte?.Nombre || "N/A"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            )}

                            {/* Valor Total */}
                            <div className="card bg-light">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 fw-bold">Valor Total:</h5>
                                        <h4 className="mb-0">
                                            {cotizacionSeleccionada.ValorTotal ? (
                                                <span className="text-success">
                                                    ${cotizacionSeleccionada.ValorTotal.toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="text-warning">Pendiente de cálculo</span>
                                            )}
                                        </h4>
                                    </div>

                                    {cotizacionSeleccionada.Estado === "Pendiente" && (
                                        <Alert variant="warning" className="mt-3 mb-0">
                                            <small>
                                                <FaClock className="me-2" />
                                                Tu cotización está siendo revisada. Te contactaremos pronto con el precio final.
                                            </small>
                                        </Alert>
                                    )}

                                    {cotizacionSeleccionada.Estado === "Aprobada" && (
                                        <Alert variant="success" className="mt-3 mb-0">
                                            <small>
                                                <FaCheckCircle className="me-2" />
                                                Cotización aprobada. Contáctanos para proceder con la compra.
                                            </small>
                                        </Alert>
                                    )}

                                    {cotizacionSeleccionada.Estado === "Rechazada" && (
                                        <Alert variant="danger" className="mt-3 mb-0">
                                            <small>
                                                <FaTimesCircle className="me-2" />
                                                Esta cotización fue rechazada. Contáctanos para más información.
                                            </small>
                                        </Alert>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    {cotizacionSeleccionada?.Estado === "Aprobada" && (
                        <Button variant="success" onClick={() => {
                            Swal.fire({
                                icon: "info",
                                title: "Próximamente",
                                text: "La funcionalidad de compra estará disponible pronto. Por favor contáctanos para finalizar tu pedido."
                            });
                        }}>
                            Contactar para Comprar
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

            <FooterComponent />
        </>
    );
};

export default MisCotizaciones;