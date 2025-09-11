import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
} from "react-bootstrap";
import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";
import Icon from "../Icon";

const FormularioCompra = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const producto = location.state?.producto ?? null;

  useEffect(() => {
    if (!producto) {
      // Si se entra directo sin producto, volver al listado
      navigate("/productosLanding");
    }
  }, [producto, navigate]);

  // Estado formulario general
  const [color, setColor] = useState("");
  const [talla, setTalla] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [tela, setTela] = useState("");
  const [aplicarDiseno, setAplicarDiseno] = useState(false);
  const [detalle, setDetalle] = useState("");

  // Estado diseños
  const [disenos, setDisenos] = useState([]);
  const [tecnica, setTecnica] = useState("");
  const [parte, setParte] = useState("");
  const [subparte, setSubparte] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [observacion, setObservacion] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // Modales de vista de imagen
  const [showProductPreview, setShowProductPreview] = useState(false);
  const [showDesignPreview, setShowDesignPreview] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);

  useEffect(() => {
    // si viene producto, podemos inicializar opciones por defecto si quieres
    if (producto) {
      // ejemplo: seleccionar primer color/talla/tela por defecto si lo tuvieras
    }
  }, [producto]);

  const handleFileChange = (e) => {
    setArchivo(e.target.files?.[0] ?? null);
  };

  const resetDesignFields = () => {
    setTecnica("");
    setParte("");
    setSubparte("");
    setArchivo(null);
    // reset file input value (handled in markup via key change if needed)
    setObservacion("");
    setEditingIndex(null);
  };

  const handleAgregarOActualizarDiseno = () => {
    if (!tecnica || !parte) {
      return alert("Por favor complete Técnica y Parte antes de agregar.");
    }

    const nuevo = {
      tecnica,
      parte,
      subparte,
      archivo, // File object (puede ser null)
      observacion,
    };

    if (editingIndex !== null) {
      // actualizar
      setDisenos((prev) => prev.map((d, i) => (i === editingIndex ? nuevo : d)));
      setEditingIndex(null);
    } else {
      // agregar
      setDisenos((prev) => [...prev, nuevo]);
    }

    resetDesignFields();
  };

  const handleEditarDiseno = (index) => {
    const d = disenos[index];
    setTecnica(d.tecnica);
    setParte(d.parte);
    setSubparte(d.subparte);
    setArchivo(d.archivo ?? null);
    setObservacion(d.observacion ?? "");
    setEditingIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" }); // opcional: scroll al top del formulario
  };

  const handleEliminarDiseno = (index) => {
    if (!confirm("¿Eliminar este diseño?")) return;
    setDisenos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePreviewDesign = (archivoFile) => {
    if (!archivoFile) {
      alert("No hay archivo para previsualizar.");
      return;
    }
    const url = URL.createObjectURL(archivoFile);
    setPreviewSrc(url);
    setShowDesignPreview(true);
  };

  const closeDesignPreview = () => {
    if (previewSrc) {
      URL.revokeObjectURL(previewSrc);
    }
    setPreviewSrc(null);
    setShowDesignPreview(false);
  };

  const handlePreviewProduct = () => {
    if (!producto?.img) return;
    setPreviewSrc(producto.img);
    setShowProductPreview(true);
  };

  const closeProductPreview = () => {
    setPreviewSrc(null);
    setShowProductPreview(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes armar el objeto final y enviarlo al backend o guardar en localStorage
    const compra = {
      producto: producto?.titulo,
      precio: producto?.precio,
      color,
      talla,
      cantidad,
      tela,
      aplicarDiseno,
      detalle,
      disenos,
    };

    console.log("Compra:", compra);
    alert("Compra registrada (demo). Revisa la consola.");
    navigate("/productosLanding");
  };

  if (!producto) return null;

  return (
    <>
      <NavbarComponent />

      <Container className="py-4">
        <h3 className="text-center mb-4">Comprar: {producto.titulo}</h3>

        <Form onSubmit={handleSubmit} className="p-4 rounded shadow" style={{ background: "#f9f9f9" }}>
          <Row>
            <Col md={4} className="text-center">
              <img
                src={producto.img}
                alt={producto.titulo}
                style={{ maxWidth: "220px", borderRadius: 8, cursor: "pointer" }}
                onClick={handlePreviewProduct}
              />
              <p className="fw-bold mt-2">Precio: ${producto.precio.toLocaleString()}</p>
              <p>Estado: <strong>{producto.estado}</strong></p>
            </Col>

            <Col md={8}>
              {/* Color, talla, cantidad, tela */}
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Color</Form.Label>
                    <Form.Select value={color} onChange={(e) => setColor(e.target.value)} required>
                      <option value="">Seleccione color</option>
                      <option value="Blanco">Blanco</option>
                      <option value="Negro">Negro</option>
                      <option value="Verde">Verde</option>
                      <option value="Azul">Azul</option>
                      <option value="Rosado">Rosado</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Talla</Form.Label>
                    <Form.Select value={talla} onChange={(e) => setTalla(e.target.value)} required>
                      <option value="">Seleccione talla</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Cantidad</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Tipo de tela</Form.Label>
                    <Form.Select value={tela} onChange={(e) => setTela(e.target.value)} required>
                      <option value="">Seleccione tela</option>
                      <option value="Algodón">Algodón</option>
                      <option value="Poliéster">Poliéster</option>
                      <option value="Lino">Lino</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Aplicar diseño"
                  checked={aplicarDiseno}
                  onChange={(e) => setAplicarDiseno(e.target.checked)}
                />
              </Form.Group>

              {/* Campos de diseño (si aplica) */}
              {aplicarDiseno && (
                <div className="p-3 mb-3 rounded" style={{ background: "#efeaf6", border: "1px solid #ddd" }}>
                  <h5 className="mb-3 text-center">Diseños</h5>

                  <Row className="mb-2">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Técnica</Form.Label>
                        <Form.Select value={tecnica} onChange={(e) => setTecnica(e.target.value)}>
                          <option value="">Seleccione opción</option>
                          <option value="Sublimación">Sublimación</option>
                          <option value="Bordado">Bordado</option>
                          <option value="Vinilo">Vinilo</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Parte</Form.Label>
                        <Form.Select value={parte} onChange={(e) => setParte(e.target.value)}>
                          <option value="">Seleccione parte</option>
                          <option value="Superior">Superior</option>
                          <option value="Inferior">Inferior</option>
                          <option value="Mangas">Mangas</option>
                          <option value="Lateral">Lateral</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-2">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Subparte Descripción</Form.Label>
                        <Form.Control
                          type="text"
                          value={subparte}
                          onChange={(e) => setSubparte(e.target.value)}
                          placeholder="Ej: lado izquierdo"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Diseño (archivo)</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                        {archivo && <small className="text-muted">{archivo.name}</small>}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-2">
                    <Form.Label>Observación</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={observacion}
                      onChange={(e) => setObservacion(e.target.value)}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between mt-2">
                    <Button variant="outline-primary" onClick={() => { resetDesignFields(); }}>
                      + Agregar parte
                    </Button>

                    <Button variant="success" onClick={handleAgregarOActualizarDiseno}>
                      {editingIndex !== null ? "Guardar cambios" : "+ Agregar diseño"}
                    </Button>
                  </div>

                  {/* Tabla de diseños */}
                  <Table striped bordered hover size="sm" className="mt-3">
                    <thead className="table-light">
                      <tr>
                        <th>Técnica</th>
                        <th>Parte</th>
                        <th>Subparte</th>
                        <th>Diseño</th>
                        <th>Observación</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {disenos.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center text-muted">No hay diseños agregados</td>
                        </tr>
                      ) : (
                        disenos.map((d, i) => (
                          <tr key={i}>
                            <td>{d.tecnica}</td>
                            <td>{d.parte}</td>
                            <td>{d.subparte}</td>
                            <td>{d.archivo?.name ?? "—"}</td>
                            <td>{d.observacion}</td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <Button variant="outline-primary" size="sm" onClick={() => {
                                  if (d.archivo) handlePreviewDesign(d.archivo);
                                  else alert("No hay archivo para previsualizar");
                                }}>
                                  <Icon name="ver" />
                                </Button>
                                <Button variant="outline-warning" size="sm" onClick={() => handleEditarDiseno(i)}>
                                  <Icon name="editar" />
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleEliminarDiseno(i)}>
                                  <Icon name="eliminar" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}

              {/* Detalle adicional y botones */}
              <Form.Group className="mb-3">
                <Form.Label>Detalle adicional</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                  placeholder="Notas, solicitar más productos, etc."
                />
              </Form.Group>

              <div className="d-flex gap-3">
                <Button type="submit" variant="success">Confirmar compra</Button>
                <Button variant="secondary" onClick={() => navigate("/productosLanding")}>Volver</Button>
              </div>
            </Col>
          </Row>
        </Form>

        {/* Tabla general (detalle del producto y acciones) */}
        <div className="mt-4">
          <h5>Detalles Generales</h5>
          <Table striped bordered hover size="sm" className="mt-2">
            <thead className="table-light">
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{producto.titulo}</td>
                <td>${producto.precio.toLocaleString()}</td>
                <td>{producto.estado}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <Button variant="outline-primary" size="sm" onClick={handlePreviewProduct}>
                      <Icon name="ver" />
                    </Button>
                    <Button variant="outline-warning" size="sm" onClick={() => navigate("/productosLanding")}>
                      <Icon name="editar" />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => alert("No puede eliminar el producto desde aquí")}>
                      <Icon name="eliminar" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Container>

      {/* Modal vista previa producto */}
      <Modal show={showProductPreview} onHide={closeProductPreview} centered size="lg">
        <Modal.Body className="text-center">
          {previewSrc && <img src={previewSrc} alt="Preview producto" style={{ maxWidth: "100%" }} />}
        </Modal.Body>
      </Modal>

      {/* Modal vista previa diseño (archivo) */}
      <Modal show={showDesignPreview} onHide={closeDesignPreview} centered size="lg">
        <Modal.Body className="text-center">
          {previewSrc ? (
            // si es blob url o ruta, lo mostramos; si no, mostramos nombre
            <img src={previewSrc} alt="Preview diseño" style={{ maxWidth: "100%" }} />
          ) : (
            <p>No hay preview disponible</p>
          )}
        </Modal.Body>
      </Modal>

      <FooterComponent />
    </>
  );
};

export default FormularioCompra;
