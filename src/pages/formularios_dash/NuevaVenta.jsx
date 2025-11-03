// src/pages/formularios_dash/NuevaVenta.jsx
import React, { useState } from "react";
import {
    Container,
    Card,
    Row,
    Col,
    Form,
    Button,
    Modal,
    InputGroup,
    Table,
    Alert,
    Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

export default function NuevaVenta() {
    const navigate = useNavigate();

    // UI States
    const [showModalProducto, setShowModalProducto] = useState(false);
    const [busquedaProducto, setBusquedaProducto] = useState("");

    return (
        <Container className="py-4">
            <h3 className="text-center mb-4 text-primary fw-bold">
                FORMULARIO DE VENTA
            </h3>

            {/* <Alert variant="info" dismissible className="mb-3">
                Completa los datos del cliente y agrega productos a la venta
            </Alert> */}

            {/* Card principal */}
            <Card className="p-4 mb-4" style={{ background: "#f5f5fa" }}>
                {/* Fila 1: Cliente y Totales */}
                <Row className="mb-4 align-items-end">
                    <Col md={5}>
                        <Form.Group>
                            <Form.Label className="fw-bold">Cliente (Usuario) *</Form.Label>
                            <Form.Select>
                                <option value="">Seleccione un cliente...</option>
                                <option value="1">Juan Pérez - 1234567890</option>
                                <option value="2">María García - 0987654321</option>
                                <option value="3">Carlos López - 1122334455</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label className="fw-bold">Subtotal</Form.Label>
                            <Form.Control
                                readOnly
                                value="$0"
                                style={{ background: "#e9ecef", fontWeight: "600" }}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={2}>
                        <Form.Group>
                            <Form.Label className="fw-bold">Total</Form.Label>
                            <Form.Control
                                readOnly
                                value="$0"
                                style={{ background: "#d1e7dd", fontWeight: "700" }}
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3} className="d-flex justify-content-end gap-2">
                        <Button
                            variant="success"
                            className="px-3"
                        >
                            Generar Venta
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => navigate("/dashboard/ventas")}
                        >
                            Cancelar
                        </Button>
                    </Col>
                </Row>

                <hr className="my-4" />

                {/* Fila 2: Botón Elegir Producto */}
                <Row className="mb-3">
                    <Col className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Agregar Productos</h5>
                        <Button
                            variant="primary"
                            onClick={() => setShowModalProducto(true)}
                        >
                            + Elegir Producto
                        </Button>
                    </Col>
                </Row>

                {/* Fila 3: Datos del producto seleccionado */}
                <Card className="p-3 mb-3" style={{ background: "#ffffff", border: "1px solid #dee2e6" }}>
                    <Row className="g-3 align-items-end">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Producto Seleccionado</Form.Label>
                                <Form.Control
                                    readOnly
                                    value="Seleccione un producto..."
                                    style={{ background: "#f8f9fa" }}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Técnica *</Form.Label>
                                <Form.Select>
                                    <option value="">Seleccione técnica...</option>
                                    <option value="1">Estampado Digital</option>
                                    <option value="2">Serigrafía</option>
                                    <option value="3">Bordado</option>
                                    <option value="4">Sublimación</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Cantidad *</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    defaultValue="1"
                                />
                            </Form.Group>
                        </Col>

                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Precio Unit.</Form.Label>
                                <Form.Control
                                    type="number"
                                    readOnly
                                    value="0"
                                    style={{ background: "#f8f9fa" }}
                                />
                            </Form.Group>
                        </Col>

                        <Col md={1} className="d-grid">
                            <Button variant="primary" size="lg">
                                +
                            </Button>
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col className="d-flex gap-2">
                            <Button variant="outline-secondary" size="sm">
                                Limpiar
                            </Button>
                        </Col>
                    </Row>
                </Card>
            </Card>

            {/* Tabla de productos agregados */}
            <Card className="p-3 mb-4">
                <h5 className="mb-3">Productos Agregados</h5>
                <Table striped bordered hover responsive>
                    <thead className="table-primary text-center">
                        <tr>
                            <th>#</th>
                            <th>Producto</th>
                            <th>Técnica</th>
                            <th>Cantidad</th>
                            <th>Precio Unit.</th>
                            <th>Subtotal</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center">1</td>
                            <td>Camiseta Básica Blanca</td>
                            <td>Estampado Digital</td>
                            <td className="text-center">5</td>
                            <td className="text-end">$25,000</td>
                            <td className="text-end fw-bold">$125,000</td>
                            <td className="text-center">
                                <Button variant="outline-danger" size="sm">
                                    <X size={16} />
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">2</td>
                            <td>Sudadera con Capucha Negra</td>
                            <td>Bordado</td>
                            <td className="text-center">3</td>
                            <td className="text-end">$45,000</td>
                            <td className="text-end fw-bold">$135,000</td>
                            <td className="text-center">
                                <Button variant="outline-danger" size="sm">
                                    <X size={16} />
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={7} className="text-center text-muted">
                                <em>Ejemplo de productos agregados</em>
                            </td>
                        </tr>
                    </tbody>
                </Table>

                <div className="d-flex justify-content-end mt-3">
                    <div className="text-end">
                        <h6 className="mb-1">Subtotal: <span className="text-primary">$260,000</span></h6>
                        <h5 className="mb-0">Total: <Badge bg="success" className="fs-6">$260,000</Badge></h5>
                    </div>
                </div>
            </Card>

            {/* MODAL: Seleccionar Producto */}
            <Modal
                show={showModalProducto}
                onHide={() => setShowModalProducto(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Seleccionar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-4">
                        <InputGroup.Text>
                            <Search size={18} />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Buscar producto por nombre..."
                            value={busquedaProducto}
                            onChange={(e) => setBusquedaProducto(e.target.value)}
                        />
                    </InputGroup>

                    <Row>
                        {/* Card Producto 1 */}
                        <Col md={4} className="mb-3">
                            <Card
                                className="h-100 shadow-sm"
                                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <div style={{
                                    height: 180,
                                    background: "#f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <span style={{ fontSize: 14, color: "#999" }}>Imagen del producto</span>
                                </div>
                                <Card.Body>
                                    <Card.Title style={{ fontSize: 16 }}>Camiseta Básica Blanca</Card.Title>
                                    <Card.Text>
                                        <strong>Precio:</strong> $25,000<br />
                                        <strong>Stock:</strong> <Badge bg="success">Disponible</Badge>
                                    </Card.Text>
                                    <Button variant="primary" className="w-100">
                                        Seleccionar
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Card Producto 2 */}
                        <Col md={4} className="mb-3">
                            <Card
                                className="h-100 shadow-sm"
                                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <div style={{
                                    height: 180,
                                    background: "#f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <span style={{ fontSize: 14, color: "#999" }}>Imagen del producto</span>
                                </div>
                                <Card.Body>
                                    <Card.Title style={{ fontSize: 16 }}>Sudadera Negra</Card.Title>
                                    <Card.Text>
                                        <strong>Precio:</strong> $45,000<br />
                                        <strong>Stock:</strong> <Badge bg="success">Disponible</Badge>
                                    </Card.Text>
                                    <Button variant="primary" className="w-100">
                                        Seleccionar
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Card Producto 3 */}
                        <Col md={4} className="mb-3">
                            <Card
                                className="h-100 shadow-sm"
                                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                            >
                                <div style={{
                                    height: 180,
                                    background: "#f0f0f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <span style={{ fontSize: 14, color: "#999" }}>Imagen del producto</span>
                                </div>
                                <Card.Body>
                                    <Card.Title style={{ fontSize: 16 }}>Polo Deportivo</Card.Title>
                                    <Card.Text>
                                        <strong>Precio:</strong> $35,000<br />
                                        <strong>Stock:</strong> <Badge bg="warning">Pocas unidades</Badge>
                                    </Card.Text>
                                    <Button variant="primary" className="w-100">
                                        Seleccionar
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalProducto(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}