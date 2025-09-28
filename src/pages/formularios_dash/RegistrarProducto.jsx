import { useEffect, useState } from "react";
import { Form, Button, Card, Row, Col, Table } from "react-bootstrap";
import { createProducto } from "../../Services/api-productos/productos";
import { createVariante } from "../../Services/api-productos/variantes"; 
import { getColores, getTallas, getTelas } from "../../Services/api-productos/atributos";

const RegistrarProducto = () => {
  const [telas, setTelas] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);

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

  // ✅ Cargar atributos al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      setTelas(await getTelas());
      setColores(await getColores());
      setTallas(await getTallas());
    };
    cargarDatos();
  }, []);

  // ✅ Actualizar campos del producto
  const handleProductoChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  // ✅ Actualizar campos de la variante
  const handleVarianteChange = (e) => {
    setNuevaVariante({ ...nuevaVariante, [e.target.name]: e.target.value });
  };

  // ✅ Agregar variante a la tabla
  const agregarVariante = () => {
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

  // ✅ Guardar producto y variantes en la base de datos
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Crear producto
      const productoCreado = await createProducto(producto);
      const productoID = productoCreado.datos.ProductoID;

      // 2️⃣ Crear cada variante
      for (let v of variantes) {
        await createVariante({ ...v, ProductoID: productoID });
      }

      alert("✅ Producto y variantes guardados correctamente");
      setProducto({ Nombre: "", Descripcion: "", TelaID: "" });
      setVariantes([]);
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      alert("Error al guardar el producto.");
    }
  };

  return (
    <div className="container py-4">
      <Card className="shadow-lg p-4">
        <h3 className="text-center mb-4">📦 Registrar Nuevo Producto</h3>
        <Form onSubmit={handleSubmit}>
          {/* 🧵 Datos del producto */}
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

          <hr />

          {/* 🧬 Variantes */}
          <h5>🧬 Variantes del producto</h5>
          <Row className="align-items-end">
            <Col md={2}>
              <Form.Label>Color</Form.Label>
              <Form.Select name="ColorID" value={nuevaVariante.ColorID} onChange={handleVarianteChange}>
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
              <Form.Select name="TallaID" value={nuevaVariante.TallaID} onChange={handleVarianteChange}>
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
                ➕ Agregar
              </Button>
            </Col>
          </Row>

          {/* 📊 Tabla de variantes */}
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
                  <td>{colores.find(c => c.ColorID == v.ColorID)?.Nombre}</td>
                  <td>{tallas.find(t => t.TallaID == v.TallaID)?.Nombre}</td>
                  <td>{v.Stock}</td>
                  <td>${v.Precio}</td>
                  <td>{v.Imagen}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="text-end">
            <Button type="submit" variant="success" className="mt-3">
              💾 Guardar Producto
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegistrarProducto;
