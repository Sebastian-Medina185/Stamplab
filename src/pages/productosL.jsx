import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

const Products = () => {
    return (
        <section className="p-5 bg-light">
            <Container>
                <h4 className="text-center fw-bold mb-4">Nuestros Productos</h4>
                <Row>
                    {/* Producto 1 */}
                    <Col md={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Img variant="top" src="URL_DE_TU_IMAGEN" />
                            <Card.Body className="text-center">
                                <Badge bg="success" className="mb-2">
                                    Disponible
                                </Badge>
                                <h5>Camiseta</h5>
                                <p>Camiseta blanca</p>
                                <p className="fw-bold">Precio: $15.000</p>
                                <Button variant="success" className="w-100">
                                    Comprar Producto
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Producto 2 */}
                    <Col md={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Img variant="top" src="URL_DE_TU_IMAGEN" />
                            <Card.Body className="text-center">
                                <Badge bg="danger" className="mb-2">
                                    No disponible
                                </Badge>
                                <h5>Camisa</h5>
                                <p>Camisa negra</p>
                                <p className="fw-bold">Precio: $16.000</p>
                                <Button variant="success" className="w-100" disabled>
                                    Comprar Producto
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Producto 3 */}
                    <Col md={4} className="mb-4">
                        <Card className="shadow-sm h-100">
                            <Card.Img variant="top" src="URL_DE_TU_IMAGEN" />
                            <Card.Body className="text-center">
                                <Badge bg="success" className="mb-2">
                                    Disponible
                                </Badge>
                                <h5>Buzo</h5>
                                <p>Buzo negro clásico</p>
                                <p className="fw-bold">Precio: $13.000</p>
                                <Button variant="success" className="w-100">
                                    Comprar Producto
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Products;