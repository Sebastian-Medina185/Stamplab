import { useEffect, useState } from "react";
import { Form, Button, Card, Row, Col, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createProducto } from "../../Services/api-productos/productos";
import { createVariante } from "../../Services/api-productos/variantes";
import { getColores, getTallas, getTelas } from "../../Services/api-productos/atributos";

const AgregarProducto = () => {
    const navigate = useNavigate();

    const [telas, setTelas] = useState([]);
    const [colores, setColores] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [mostrarVariantes, setMostrarVariantes] = useState(false);

    const [producto, setProducto] = useState({
        Nombre: "",
        Descripcion: "",
        TelaID: "",
    });

    const [variantes, setVariantes] = useState([]);
    const [nuevaVariante, setNuevaVariante] = useState({
        ColorID: "",
        TallaID: "",
        Stock: "",
        Imagen: "",
        Precio: "",
        Estado: true,
    });

    // 🔹 Cargar atributos (telas, colores, tallas)
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const respTelas = await getTelas();
                const respColores = await getColores();
                const respTallas = await getTallas();

                setTelas(Array.isArray(respTelas) ? respTelas : respTelas?.datos || []);
                setColores(Array.isArray(respColores) ? respColores : respColores?.datos || []);
                setTallas(Array.isArray(respTallas) ? respTallas : respTallas?.datos || []);
            } catch (error) {
                console.error("Error al cargar atributos:", error);
            }
        };
        cargarDatos();
    }, []);

    // 🔹 Actualizar datos del producto
    const handleProductoChange = (e) => {
        setProducto({ ...producto, [e.target.name]: e.target.value });
    };

    // 🔹 Actualizar datos de la nueva variante
    const handleVarianteChange = (e) => {
        setNuevaVariante({ ...nuevaVariante, [e.target.name]: e.target.value });
    };

    // 🔹 Agregar una variante
    const agregarVariante = () => {
        if (!nuevaVariante.ColorID || !nuevaVariante.TallaID) {
            alert("Por favor seleccione color y talla antes de agregar la variante.");
            return;
        }
        setVariantes([...variantes, nuevaVariante]);
        setNuevaVariante({
            ColorID: "",
            TallaID: "",
            Stock: "",
            Imagen: "",
            Precio: "",
            Estado: true,
        });
    };

    // Guardar producto y variantes
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productoData = {
                ...producto,
                TelaID: parseInt(producto.TelaID),
            };

            const productoCreado = await createProducto(productoData);
            const productoID = productoCreado.datos.ProductoID;

            for (let v of variantes) {
                await createVariante({ ...v, ProductoID: productoID });
            }

            alert("Producto y variantes guardados correctamente");
            navigate("/dashboard/productos");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar el producto.");
        }
    };


    return (
        <div className="container py-4">
            <Card className="shadow-lg p-4">
                <h3 className="text-center mb-4">Registrar Nuevo Producto</h3>

                <Form onSubmit={handleSubmit}>
                    {/* --- DATOS DEL PRODUCTO --- */}
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    name="Nombre"
                                    value={producto.Nombre}
                                    onChange={handleProductoChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    name="Descripcion"
                                    value={producto.Descripcion}
                                    onChange={handleProductoChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Tela</Form.Label>
                                <Form.Select
                                    name="TelaID"
                                    value={producto.TelaID}
                                    onChange={handleProductoChange}
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    {telas.map((t) => (
                                        <option key={t.TelaID} value={t.TelaID}>
                                            {t.Nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* --- BOTONES ANTES DE MOSTRAR VARIANTES --- */}
                    {!mostrarVariantes && (
                        <div className="d-flex justify-content-between mt-4">
                            <Button variant="secondary" onClick={() => navigate("/dashboard/productos")}>
                                Cancelar
                            </Button>
                            <Button variant="primary text-white" onClick={() => setMostrarVariantes(true)}>
                                Agregar Variantes
                            </Button>
                            <Button type="submit" variant="success">
                                Guardar Producto
                            </Button>
                        </div>
                    )}

                    {/* --- VARIANTES (SOLO SI SE HACE CLIC EN “AGREGAR VARIANTES”) --- */}
                    {mostrarVariantes && (
                        <>
                            <hr />
                            <h5>Variantes del producto</h5>
                            <Row className="align-items-end">
                                <Col md={2}>
                                    <Form.Label>Color</Form.Label>
                                    <Form.Select
                                        name="ColorID"
                                        value={nuevaVariante.ColorID}
                                        onChange={handleVarianteChange}
                                    >
                                        <option value="">Seleccione</option>
                                        {colores.map((c) => (
                                            <option key={c.ColorID} value={c.ColorID}>
                                                {c.Nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>

                                <Col md={2}>
                                    <Form.Label>Talla</Form.Label>
                                    <Form.Select
                                        name="TallaID"
                                        value={nuevaVariante.TallaID}
                                        onChange={handleVarianteChange}
                                    >
                                        <option value="">Seleccione</option>
                                        {tallas.map((t) => (
                                            <option key={t.TallaID} value={t.TallaID}>
                                                {t.Nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>

                                <Col md={2}>
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="Stock"
                                        value={nuevaVariante.Stock}
                                        onChange={handleVarianteChange}
                                    />
                                </Col>

                                <Col md={2}>
                                    <Form.Label>Precio</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="Precio"
                                        value={nuevaVariante.Precio}
                                        onChange={handleVarianteChange}
                                    />
                                </Col>

                                <Col md={2}>
                                    <Form.Label>Imagen URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Imagen"
                                        value={nuevaVariante.Imagen}
                                        onChange={handleVarianteChange}
                                    />
                                </Col>

                                <Col md={2}>
                                    <Button variant="primary" onClick={agregarVariante}>
                                        Agregar
                                    </Button>
                                </Col>
                            </Row>

                            {/* --- TABLA DE VARIANTES --- */}
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Color</th>
                                        <th>Talla</th>
                                        <th>Stock</th>
                                        <th>Precio</th>
                                        <th>Imagen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {variantes.map((v, idx) => (
                                        <tr key={idx}>
                                            <td>{colores.find((c) => c.ColorID == v.ColorID)?.Nombre}</td>
                                            <td>{tallas.find((t) => t.TallaID == v.TallaID)?.Nombre}</td>
                                            <td>{v.Stock}</td>
                                            <td>${v.Precio}</td>
                                            <td>{v.Imagen}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {/* --- BOTONES FINALES --- */}
                            <div className="d-flex justify-content-between mt-4">
                                <Button variant="secondary" onClick={() => navigate("/dashboard/productos")}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="success">
                                    Guardar Producto
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </Card>
        </div>
    );
};

export default AgregarProducto;
