import { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Badge,
    InputGroup,
    Form,
    Spinner,
} from "react-bootstrap";
import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";
import { useNavigate } from "react-router-dom";
import { getProductos } from "../../Services/api-productos/productos"; // Importar el servicio
import { getTallas } from "../../Services/api-productos/atributos";

const ProductosLanding = () => {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("Todos");
    const [productos, setProductos] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    // Cargar productos y tallas desde el backend
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setCargando(true);
        try {
            const [productosRes, tallasRes] = await Promise.all([
                getProductos(),
                getTallas()
            ]);

            const productosData = productosRes.datos || productosRes;
            setProductos(productosData);
            setTallas(tallasRes.datos || tallasRes);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        } finally {
            setCargando(false);
        }
    };

    // Función para obtener tallas únicas de un producto
    const obtenerTallasProducto = (producto) => {
        if (!producto.inventario || producto.inventario.length === 0) return [];
        
        const tallasUnicas = [...new Set(
            producto.inventario.map(inv => inv.talla?.Nombre).filter(Boolean)
        )];
        return tallasUnicas;
    };

    // Función para obtener colores únicos de un producto
    const obtenerColoresProducto = (producto) => {
        if (!producto.inventario || producto.inventario.length === 0) return [];
        
        const coloresUnicos = [...new Set(
            producto.inventario.map(inv => inv.color?.Nombre).filter(Boolean)
        )];
        return coloresUnicos;
    };

    // Función para obtener el precio del producto (basado en la talla más pequeña)
    const obtenerPrecioProducto = (producto) => {
        if (!producto.inventario || producto.inventario.length === 0) return 0;
        
        // Obtener el precio de la primera talla disponible
        const tallaId = producto.inventario[0]?.TallaID;
        const talla = tallas.find(t => t.TallaID === tallaId);
        return talla?.Precio || 0;
    };

    // Función para determinar si el producto está disponible
    const estaDisponible = (producto) => {
        if (!producto.inventario || producto.inventario.length === 0) return false;
        
        // Verificar si hay al menos una variante con stock > 0 y Estado = 1
        return producto.inventario.some(inv => inv.Stock > 0 && inv.Estado);
    };

    // Mapeo de colores a códigos hexadecimales
    const coloresHex = {
        "Rojo": "#FF0000",
        "Azul": "#0000FF",
        "Verde": "#00FF00",
        "Amarillo": "#FFFF00",
        "Negro": "#000000",
        "Blanco": "#FFFFFF",
        "Rosa": "#FFC0CB",
        "Morado": "#800080",
        "Naranja": "#FFA500",
        "Gris": "#808080",
        "Café": "#8B4513",
    };

    const obtenerColorHex = (nombreColor) => {
        return coloresHex[nombreColor] || "#CCCCCC";
    };

    // Filtrar productos
    const filtered = productos.filter((p) => {
        const disponible = estaDisponible(p);
        const estadoTexto = disponible ? "Disponible" : "No disponible";
        
        return (
            (filter === "Todos" || estadoTexto === filter) &&
            p.Nombre.toLowerCase().includes(search.toLowerCase())
        );
    });

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

                    {cargando ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">Cargando productos...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-5">
                            <p className="text-muted">
                                {search || filter !== "Todos"
                                    ? "No se encontraron productos con ese criterio"
                                    : "No hay productos disponibles"}
                            </p>
                        </div>
                    ) : (
                        <Row className="g-4">
                            {filtered.map((p) => {
                                const tallasProducto = obtenerTallasProducto(p);
                                const coloresProducto = obtenerColoresProducto(p);
                                const precio = obtenerPrecioProducto(p);
                                const disponible = estaDisponible(p);

                                return (
                                    <Col md={3} sm={6} xs={12} className="d-flex" key={p.ProductoID}>
                                        <Card className="shadow-lg flex-fill h-75 product-card">
                                            <div
                                                className="card-img-container"
                                                style={{
                                                    position: "relative",
                                                    height: 370,
                                                    overflow: "hidden",
                                                }}
                                            >
                                                {p.ImagenProducto ? (
                                                    <Card.Img
                                                        src={p.ImagenProducto}
                                                        alt={p.Nombre}
                                                        className="w-100"
                                                        style={{
                                                            height: 182,
                                                            objectFit: "contain",
                                                            display: "block",
                                                            margin: "0 auto",
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center"
                                                        style={{ height: 182 }}
                                                    >
                                                        <span className="text-muted">Sin imagen</span>
                                                    </div>
                                                )}

                                                {/* Overlay */}
                                                <div className="overlay-info">
                                                    {tallasProducto.length > 0 && (
                                                        <p>
                                                            <strong>Tallas:</strong>{" "}
                                                            {tallasProducto.join(", ")}
                                                        </p>
                                                    )}
                                                    {coloresProducto.length > 0 && (
                                                        <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                                                            <strong>Colores:</strong>
                                                            <div className="d-flex gap-2">
                                                                {coloresProducto.map((color, idx) => (
                                                                    <span
                                                                        key={idx}
                                                                        className="color-circle"
                                                                        style={{
                                                                            backgroundColor:
                                                                                obtenerColorHex(color),
                                                                        }}
                                                                    ></span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Card.Body className="d-flex flex-column justify-content-between align-items-center text-center">
                                                <div>
                                                    <div className="mb-2">
                                                        {disponible ? (
                                                            <Badge bg="success">Disponible</Badge>
                                                        ) : (
                                                            <Badge bg="danger">No disponible</Badge>
                                                        )}
                                                    </div>

                                                    <Card.Title className="fw-bold">
                                                        {p.Nombre}
                                                    </Card.Title>
                                                    <Card.Text className="text-muted">
                                                        {p.Descripcion || "Sin descripción"}
                                                    </Card.Text>

                                                    <Card.Text className="fw-bold mb-3">
                                                        Precio: ${precio.toLocaleString()}
                                                    </Card.Text>
                                                </div>

                                                <Button
                                                    className="btn btn-primary mt-2"
                                                    disabled={!disponible}
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
                                );
                            })}
                        </Row>
                    )}
                </Container>
            </section>

            <FooterComponent />
        </>
    );
};

export default ProductosLanding;