import { useState } from "react";
import producto1 from '../../assets/images/camisablanca.png';
import producto2 from '../../assets/images/camisaverde.png';
import producto3 from '../../assets/images/buzo.png';
import producto4 from '../../assets/images/camisarosa.png';
import producto5 from '../../assets/images/camisanegra.png';
import producto6 from '../../assets/images/jeans.jpeg';

import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    InputGroup,
    Form,
} from "react-bootstrap";
import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";
import { useNavigate } from "react-router-dom";

const ProductosLanding = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Todos");
    const navigate = useNavigate();

    const productos = [
        {
            titulo: "Camiseta",
            descripcion: "Camiseta blanca",
            precio: 15000,
            estado: "Disponible",
            img: producto1,
            tallas: ["S", "M", "L"],
            colores: ["#FF0000", "#FF5555"],
            tela: "Algodón"
        },
        {
            titulo: "Camisa",
            descripcion: "Camisa verde",
            precio: 16000,
            estado: "Disponible",
            img: producto2,
            tallas: ["M", "L", "XL"],
            colores: ["#FFFFFF", "#FF0000"],
            tela: "Lino"
        },
        {
            titulo: "Buzo",
            descripcion: "Buzo negro",
            precio: 13000,
            estado: "Disponible",
            img: producto3,
            tallas: ["S", "M", "L", "XL"],
            colores: ["#000000", "#139bd1ff"],
            tela: "Poliéster"
        },
        {
            titulo: "Pantalón",
            descripcion: "Pantalón azul",
            precio: 20000,
            estado: "Disponible",
            img: producto6,
            tallas: ["M", "L", "XL"],
            colores: ["#000000"],
            tela: "Algodón"
        },
    ];

    const filtered = productos.filter(
        (p) =>
            (filter === "Todos" || p.estado === filter) &&
            p.titulo.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <NavbarComponent />

            <section className="py-5 bg-light" id="productos">
                <Container>
                    <h3 className="fw-bold mb-0 text-center">Nuestros Productos</h3>
                    <br />
                    <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap mb-4">
                        <div className="d-flex gap-2">
                            <Form.Select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                style={{ maxWidth: 180 }}
                            >
                                <option value="Todos">Filtrar por estado</option>
                                <option value="Disponible">Disponible</option>
                                <option value="No disponible">No disponible</option>
                            </Form.Select>

                            <InputGroup style={{ maxWidth: 250 }}>
                                <Form.Control
                                    placeholder="Buscar por nombre"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <InputGroup.Text>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.415l-3.85-3.85h-.017zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                    </svg>
                                </InputGroup.Text>
                            </InputGroup>
                        </div>
                    </div>

                    <Row className="g-4">
                        {filtered.map((p, i) => (
                            <Col md={3} sm={6} xs={12} className="d-flex" key={i}>
                                <Card className="shadow-lg flex-fill h-75 product-card">
                                    <div className="card-img-container" style={{ position: "relative", height: 370, overflow: "hidden" }}>
                                        <Card.Img
                                            src={p.img}
                                            alt={p.titulo}
                                            className="w-100"
                                            style={{
                                                height: 182,        // altura fija
                                                objectFit: "contain", // mantiene toda la imagen sin recortar
                                                display: "block",
                                                margin: "0 auto",    // centra horizontalmente
                                            }}
                                        />


                                        {/* Overlay */}
                                        <div className="overlay-info">
                                            {p.tallas && <p><strong>Tallas:</strong> {p.tallas.join(", ")}</p>}
                                            {p.colores && (
                                                <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                                                    <strong>Colores:</strong>
                                                    <div className="d-flex gap-2">
                                                        {p.colores.map((color, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="color-circle"
                                                                style={{ backgroundColor: color }}
                                                            ></span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {p.tela && <p><strong>Tela:</strong> {p.tela}</p>}
                                        </div>
                                    </div>

                                    <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center">
                                        <div>
                                            <div className="mb-2">
                                                {p.estado === "Disponible" ? (
                                                    <Badge bg="success">Disponible</Badge>
                                                ) : (
                                                    <Badge bg="danger">No disponible</Badge>
                                                )}
                                            </div>

                                            <Card.Title className="fw-bold">{p.titulo}</Card.Title>
                                            <Card.Text className="text-muted">{p.descripcion}</Card.Text>

                                            <Card.Text className="fw-bold mb-3">
                                                Precio: ${p.precio.toLocaleString()}
                                            </Card.Text>
                                        </div>

                                        <Button
                                            className="btn btn-primary mt-2"
                                            disabled={p.estado !== "Disponible"}
                                            onClick={() =>
                                                navigate("/formularioCompra", {
                                                    state: { producto: p },
                                                })
                                            }
                                        >
                                            Comprar Producto
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            <FooterComponent />
        </>
    );
};

export default ProductosLanding;
