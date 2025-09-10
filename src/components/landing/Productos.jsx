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
            descripcion: "Camiseta roja",
            precio: 15000,
            estado: "Disponible",
            img: producto1,
        },
        {
            titulo: "Camisa",
            descripcion: "Camisa blanca",
            precio: 16000,
            estado: "Disponible",
            img: producto2,
        },
        {
            titulo: "Buzo",
            descripcion: "Buzo negro clásico",
            precio: 13000,
            estado: "Disponible",
            img: producto3,
        },
        {
            titulo: "Camisa",
            descripcion: "Camisa verde",
            precio: 20000,
            estado: "No disponible",
            img: producto4,
        },
        {
            titulo: "Pantalón",
            descripcion: "Pantalón negro",
            precio: 20000,
            estado: "Disponible",
            img: producto5,
        },
        {
            titulo: "Jeans",
            descripcion: "Jeans clásicos",
            precio: 20000,
            estado: "No disponible",
            img: producto6,
        },
    ];

    // Filtrar productos
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
                    {/* Título + filtros */}
                    <h3 className="fw-bold mb-0 text-center">Nuestros Productos</h3>
                    <br />
                    <div className="d-flex align-items-center justify-content-end gap-3 flex-wrap mb-4">
                        <div className="d-flex gap-2">
                            {/* Filtro por estado */}
                            <Form.Select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                style={{ maxWidth: 180 }}
                            >
                                <option value="Todos">Filtrar por estado</option>
                                <option value="Disponible">Disponible</option>
                                <option value="No disponible">No disponible</option>
                            </Form.Select>

                            {/* Buscador */}
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

                    {/* Grid de productos */}
                    <Row className="g-4">
                        {filtered.map((p, i) => (
                            <Col md={3} sm={6} xs={12} className="d-flex" key={i}>
                                <Card className="shadow-sm flex-fill h-100 text-center">
                                    {/* Imagen */}
                                    <div style={{ height: 280, overflow: "hidden" }}>
                                        <Card.Img
                                            src={p.img}
                                            alt={p.titulo}
                                            className="w-100 h-100"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>

                                    <Card.Body className="d-flex flex-column">
                                        {/* Estado */}
                                        <div className="mb-2">
                                            {p.estado === "Disponible" ? (
                                                <Badge bg="success">Disponible</Badge>
                                            ) : (
                                                <Badge bg="danger">No disponible</Badge>
                                            )}
                                        </div>

                                        {/* Nombre */}
                                        <Card.Title className="fw-bold">{p.titulo}</Card.Title>
                                        <Card.Text className="text-muted">{p.descripcion}</Card.Text>

                                        {/* Precio */}
                                        <Card.Text className="fw-bold mb-3">
                                            Precio: ${p.precio.toLocaleString()}
                                        </Card.Text>

                                        {/* Botón */}
                                        <Button
                                            className="btn btn-success"
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
