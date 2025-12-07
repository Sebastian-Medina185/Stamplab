import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table, Modal, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import * as api from "../../Services/api-cotizacion-landing/cotizacion-landing.js";
import { createCotizacionInteligente } from "../../Services/api-cotizaciones/cotizaciones.js";
import NavbarComponent from "../landing/NavBarLanding";
import FooterComponent from "../landing/footer";

const CotizacionLanding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const producto = location.state?.producto;

    // Usuario
    const [usuario, setUsuario] = useState(null);

    // Estados principales
    const [colorID, setColorID] = useState("");
    const [tallaID, setTallaID] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [telaID, setTelaID] = useState("");
    const [traePrenda, setTraePrenda] = useState(false);
    const [prendaDescripcion, setPrendaDescripcion] = useState("");

    // Catálogos
    const [colores, setColores] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [telas, setTelas] = useState([]);
    const [tecnicas, setTecnicas] = useState([]);
    const [partes, setPartes] = useState([]);

    // Diseños
    const [disenos, setDisenos] = useState([]);
    const [tecnicaID, setTecnicaID] = useState("");
    const [parteID, setParteID] = useState("");
    const [subparteDescripcion, setSubparteDescripcion] = useState("");
    const [archivoDiseno, setArchivoDiseno] = useState(null);
    const [observacionDiseno, setObservacionDiseno] = useState("");
    const [editandoIndex, setEditandoIndex] = useState(null);

    // Modales
    const [showProductPreview, setShowProductPreview] = useState(false);
    const [showDesignPreview, setShowDesignPreview] = useState(false);
    const [previewSrc, setPreviewSrc] = useState(null);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        verificarAutenticacion();
        if (!producto) {
            navigate("/productosLanding");
            return;
        }
        cargarCatalogos();
    }, [producto, navigate]);

    const verificarAutenticacion = () => {
        const usuarioStorage = localStorage.getItem("usuario");
        if (!usuarioStorage) {
            Swal.fire({
                icon: "warning",
                title: "Autenticación requerida",
                text: "Debes iniciar sesión para cotizar productos",
            }).then(() => {
                navigate("/login");
            });
            return;
        }
        setUsuario(JSON.parse(usuarioStorage));
    };

    const cargarCatalogos = async () => {
        try {
            const [colData, tallData, telData, tecData, partData] = await Promise.all([
                api.getColores(),
                api.getTallas(),
                api.getTelas(),
                api.getTecnicas(),
                api.getPartes()
            ]);

            setColores(colData || []);
            setTallas(tallData || []);
            setTelas(telData || []);
            setTecnicas(tecData || []);
            setPartes(partData || []);
        } catch (error) {
            console.error("Error al cargar catálogos:", error);
            Swal.fire("Error", "No se pudieron cargar los catálogos", "error");
        }
    };

    // ===== MANEJO DE DISEÑOS =====
    const resetCamposDiseno = () => {
        setTecnicaID("");
        setParteID("");
        setSubparteDescripcion("");
        setArchivoDiseno(null);
        setObservacionDiseno("");
        setEditandoIndex(null);
    };

    const handleAgregarOActualizarDiseno = () => {
        if (!tecnicaID || !parteID) {
            Swal.fire("Atención", "Selecciona una técnica y una parte", "warning");
            return;
        }

        const tecnica = tecnicas.find(t => t.TecnicaID === parseInt(tecnicaID));
        const parte = partes.find(p => p.ParteID === parseInt(parteID));

        const nuevoDiseno = {
            TecnicaID: parseInt(tecnicaID),
            TecnicaNombre: tecnica?.Nombre,
            ParteID: parseInt(parteID),
            ParteNombre: parte?.Nombre,
            SubparteDescripcion: subparteDescripcion,
            Archivo: archivoDiseno,
            ImagenNombre: archivoDiseno?.name || "Sin archivo",
            Observaciones: observacionDiseno
        };

        if (editandoIndex !== null) {
            setDisenos(prev => prev.map((d, i) => i === editandoIndex ? nuevoDiseno : d));
        } else {
            setDisenos(prev => [...prev, nuevoDiseno]);
        }

        resetCamposDiseno();
        Swal.fire({
            icon: "success",
            title: editandoIndex !== null ? "Diseño actualizado" : "Diseño agregado",
            timer: 1500,
            showConfirmButton: false
        });
    };

    const handleEditarDiseno = (index) => {
        const d = disenos[index];
        setTecnicaID(d.TecnicaID.toString());
        setParteID(d.ParteID.toString());
        setSubparteDescripcion(d.SubparteDescripcion || "");
        setArchivoDiseno(d.Archivo);
        setObservacionDiseno(d.Observaciones || "");
        setEditandoIndex(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleEliminarDiseno = (index) => {
        Swal.fire({
            title: "¿Eliminar este diseño?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                setDisenos(prev => prev.filter((_, i) => i !== index));
            }
        });
    };

    const handlePreviewDiseno = (archivo) => {
        if (!archivo) {
            Swal.fire("Atención", "No hay archivo para previsualizar", "info");
            return;
        }
        const url = URL.createObjectURL(archivo);
        setPreviewSrc(url);
        setShowDesignPreview(true);
    };

    // ===== CÁLCULO DE PRECIO =====
    const calcularPrecioTotal = () => {
        if (traePrenda) {
            return {
                precioBase: 0,
                precioTalla: 0,
                precioTela: 0,
                cantidadUnidades: parseInt(cantidad) || 1,
                subtotal: 0
            };
        }

        const tallaObj = tallas.find(t => t.TallaID === parseInt(tallaID));
        const precioTalla = parseFloat(tallaObj?.Precio) || 0;

        const telaObj = telas.find(t => t.InsumoID === parseInt(telaID));
        const precioTela = parseFloat(telaObj?.PrecioTela) || 0;

        const precioBaseProducto = parseFloat(producto?.PrecioBase) || 0;
        const precioBase = precioBaseProducto + precioTalla + precioTela;

        const cantidadUnidades = parseInt(cantidad) || 1;
        const subtotal = precioBase * cantidadUnidades;

        return {
            precioBaseProducto,
            precioBase,
            precioTalla,
            precioTela,
            cantidadUnidades,
            subtotal
        };
    };

    // ===== ENVIAR COTIZACIÓN INTELIGENTE =====
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!usuario) {
            Swal.fire("Error", "No hay usuario autenticado", "error");
            return;
        }

        if (!traePrenda && (!colorID || !tallaID || !telaID)) {
            Swal.fire("Atención", "Completa todos los campos obligatorios", "warning");
            return;
        }

        if (traePrenda && !prendaDescripcion.trim()) {
            Swal.fire("Atención", "Describe la prenda que traerás", "warning");
            return;
        }

        setCargando(true);
        try {
            const detalles = [{
                ProductoID: producto.ProductoID,
                Cantidad: parseInt(cantidad),
                TraePrenda: traePrenda,
                PrendaDescripcion: traePrenda ? prendaDescripcion : "",

                tallas: !traePrenda && tallaID ? [{
                    TallaID: parseInt(tallaID),
                    Cantidad: parseInt(cantidad),
                    PrecioTalla: tallas.find(t => t.TallaID === parseInt(tallaID))?.Precio || 0
                }] : [],

                colores: !traePrenda && colorID ? [{
                    ColorID: parseInt(colorID),
                    Cantidad: parseInt(cantidad)
                }] : [],

                insumos: !traePrenda && telaID ? [{
                    InsumoID: parseInt(telaID),
                    CantidadRequerida: parseInt(cantidad)
                }] : [],

                tecnicas: disenos.map(dis => ({
                    TecnicaID: dis.TecnicaID,
                    ParteID: dis.ParteID,
                    ImagenDiseño: dis.ImagenNombre,
                    Observaciones: `${dis.SubparteDescripcion ? 'Subparte: ' + dis.SubparteDescripcion + ' - ' : ''}${dis.Observaciones}`,
                    CostoTecnica: 0
                }))
            }];

            const cotizacionData = {
                DocumentoID: usuario.DocumentoID,
                FechaCotizacion: new Date().toISOString(),
                detalles
            };

            // 🎯 LLAMADA AL ENDPOINT INTELIGENTE
            const response = await createCotizacionInteligente(cotizacionData);

            // Manejar respuesta según el tipo
            if (response.tipo === 'cotizacion') {
                Swal.fire({
                    icon: "success",
                    title: "¡Cotización creada!",
                    html: `
                        <p><strong>Número de cotización:</strong> #${response.cotizacion?.CotizacionID}</p>
                        <p class="text-muted mt-2">${response.mensaje}</p>
                    `,
                    confirmButtonText: "Entendido"
                }).then(() => {
                    navigate("/productosLanding");
                });
            } else if (response.tipo === 'venta') {
                Swal.fire({
                    icon: "success",
                    title: "¡Pedido registrado!",
                    html: `
                        <p><strong>Número de pedido:</strong> #${response.venta?.VentaID}</p>
                        <p class="text-muted mt-2">${response.mensaje}</p>
                        <p class="mt-3"><strong>Total:</strong> $${(response.venta?.Total || 0).toLocaleString()}</p>
                    `,
                    confirmButtonText: "Entendido"
                }).then(() => {
                    navigate("/productosLanding");
                });
            }
        } catch (error) {
            console.error("Error al crear solicitud:", error);
            Swal.fire("Error", error?.message || "Error al procesar tu solicitud", "error");
        } finally {
            setCargando(false);
        }
    };

    if (!producto) return null;

    const precios = calcularPrecioTotal();

    return (
        <>
            <NavbarComponent />

            <Container className="py-4" style={{ maxWidth: '1200px' }}>
                <h3 className="text-center mb-4 fw-bold" style={{ color: '#2c3e50' }}>
                    Solicitar Cotización: {producto.Nombre}
                </h3>

                <Form onSubmit={handleSubmit}>
                    <Row>
                        {/* COLUMNA IZQUIERDA - RESUMEN */}
                        <Col lg={4}>
                            <div className="sticky-top" style={{ top: '20px' }}>
                                {/* Imagen del producto */}
                                <div className="text-center mb-3 p-3 rounded shadow-sm"
                                    style={{ backgroundColor: '#fff', cursor: 'pointer' }}
                                    onClick={() => {
                                        setPreviewSrc(producto.ImagenProducto);
                                        setShowProductPreview(true);
                                    }}>
                                    <img src={producto.ImagenProducto} alt={producto.Nombre}
                                        style={{ maxWidth: '100%', maxHeight: '280px', borderRadius: '8px', objectFit: 'contain' }} />
                                    <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
                                        Click para ampliar
                                    </p>
                                </div>

                                {/* Resumen de cotización */}
                                <div className="card shadow-sm">
                                    <div className="card-header bg-primary text-white">
                                        <h6 className="mb-0">Resumen de Cotización</h6>
                                    </div>
                                    <div className="card-body">
                                        {!traePrenda ? (
                                            <>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Precio base producto:</span>
                                                    <strong>${(precios.precioBaseProducto || 0).toLocaleString()}</strong>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Precio talla:</span>
                                                    <strong>${precios.precioTalla.toLocaleString()}</strong>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Precio tela:</span>
                                                    <strong>${precios.precioTela.toLocaleString()}</strong>
                                                </div>
                                                <hr />
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Precio unitario:</span>
                                                    <strong>${precios.precioBase.toLocaleString()}</strong>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Cantidad:</span>
                                                    <strong>x {precios.cantidadUnidades}</strong>
                                                </div>
                                                <hr />
                                                <div className="d-flex justify-content-between">
                                                    <span className="fw-bold">Subtotal estimado:</span>
                                                    <strong className="text-success" style={{ fontSize: '1.2rem' }}>
                                                        ${precios.subtotal.toLocaleString()}
                                                    </strong>
                                                </div>
                                            </>
                                        ) : (
                                            <Alert variant="info" className="mb-0">
                                                <small>Traes tu prenda. El precio se calculará según los diseños aplicados.</small>
                                            </Alert>
                                        )}

                                        {disenos.length > 0 && (
                                            <Alert variant="warning" className="mt-3 mb-0">
                                                <small>+ Costo de {disenos.length} diseño(s)<br />(Se calculará según técnicas)</small>
                                            </Alert>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* COLUMNA DERECHA - FORMULARIO */}
                        <Col lg={8}>
                            {/* Tipo de Prenda */}
                            <div className="card shadow-sm mb-3">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">Tipo de Prenda</h6>
                                </div>
                                <div className="card-body">
                                    <Form.Check type="switch" id="traePrenda" label="Traigo mi propia prenda"
                                        checked={traePrenda} onChange={(e) => {
                                            setTraePrenda(e.target.checked);
                                            if (e.target.checked) {
                                                setColorID(""); setTallaID(""); setTelaID("");
                                            } else {
                                                setPrendaDescripcion("");
                                            }
                                        }}
                                        style={{ fontSize: '1.05rem', fontWeight: '500' }} />

                                    {traePrenda && (
                                        <div className="mt-3">
                                            <Form.Group>
                                                <Form.Label className="fw-medium">
                                                    Describe tu prenda <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control as="textarea" rows={3} value={prendaDescripcion}
                                                    onChange={(e) => setPrendaDescripcion(e.target.value)}
                                                    placeholder="Ej: Camiseta blanca, talla M, manga corta, 100% algodón"
                                                    required={traePrenda} />
                                            </Form.Group>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Características */}
                            {!traePrenda && (
                                <div className="card shadow-sm mb-3">
                                    <div className="card-header bg-light">
                                        <h6 className="mb-0">Características de la Prenda</h6>
                                    </div>
                                    <div className="card-body">
                                        <Row className="g-3">
                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label className="fw-medium">Color <span className="text-danger">*</span></Form.Label>
                                                    <Form.Select value={colorID} onChange={(e) => setColorID(e.target.value)} required>
                                                        <option value="">Seleccionar...</option>
                                                        {colores.map(c => (
                                                            <option key={c.ColorID} value={c.ColorID}>{c.Nombre}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label className="fw-medium">Talla <span className="text-danger">*</span></Form.Label>
                                                    <Form.Select value={tallaID} onChange={(e) => setTallaID(e.target.value)} required>
                                                        <option value="">Seleccionar...</option>
                                                        {tallas.map(t => (
                                                            <option key={t.TallaID} value={t.TallaID}>
                                                                {t.Nombre} - +${t.Precio?.toLocaleString()}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group>
                                                    <Form.Label className="fw-medium">Cantidad <span className="text-danger">*</span></Form.Label>
                                                    <Form.Control type="number" min="1" value={cantidad}
                                                        onChange={(e) => setCantidad(e.target.value)} required />
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label className="fw-medium">Tipo de Tela <span className="text-danger">*</span></Form.Label>
                                                    <Form.Select value={telaID} onChange={(e) => setTelaID(e.target.value)} required>
                                                        <option value="">Seleccionar...</option>
                                                        {telas.map(t => (
                                                            <option key={t.InsumoID} value={t.InsumoID}>
                                                                {t.Nombre} - +${t.PrecioTela?.toLocaleString()}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            )}

                            {/* Diseños */}
                            <div className="card shadow-sm mb-3">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">Diseños Personalizados</h6>
                                </div>
                                <div className="card-body">
                                    <div className="p-3 rounded mb-3" style={{ backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6' }}>
                                        <h6 className="mb-3">{editandoIndex !== null ? "Editar" : "Nuevo"} Diseño</h6>

                                        <Row className="g-3 mb-3">
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-medium">Técnica</Form.Label>
                                                    <Form.Select value={tecnicaID} onChange={(e) => setTecnicaID(e.target.value)}>
                                                        <option value="">Seleccionar...</option>
                                                        {tecnicas.map(t => (
                                                            <option key={t.TecnicaID} value={t.TecnicaID}>{t.Nombre}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-medium">Parte de la prenda</Form.Label>
                                                    <Form.Select value={parteID} onChange={(e) => setParteID(e.target.value)}>
                                                        <option value="">Seleccionar...</option>
                                                        {partes.map(p => (
                                                            <option key={p.ParteID} value={p.ParteID}>{p.Nombre}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-medium">Subparte (opcional)</Form.Label>
                                                    <Form.Control type="text" value={subparteDescripcion}
                                                        onChange={(e) => setSubparteDescripcion(e.target.value)}
                                                        placeholder="Ej: Superior izquierdo" />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group>
                                                    <Form.Label className="fw-medium">Archivo del diseño</Form.Label>
                                                    <Form.Control type="file" accept="image/*"
                                                        onChange={(e) => setArchivoDiseno(e.target.files[0])} />
                                                    {archivoDiseno && (
                                                        <small className="text-success d-block mt-1">✓ {archivoDiseno.name}</small>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col md={12}>
                                                <Form.Group>
                                                    <Form.Label className="fw-medium">Observaciones</Form.Label>
                                                    <Form.Control as="textarea" rows={2} value={observacionDiseno}
                                                        onChange={(e) => setObservacionDiseno(e.target.value)}
                                                        placeholder="Ej: Logo azul marino, tamaño 10cm x 10cm" />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <div className="d-flex gap-2">
                                            {editandoIndex !== null && (
                                                <Button variant="secondary" size="sm" onClick={resetCamposDiseno}>Cancelar</Button>
                                            )}
                                            <Button variant={editandoIndex !== null ? "warning" : "success"} size="sm"
                                                onClick={handleAgregarOActualizarDiseno}>
                                                <FaPlus className="me-1" />
                                                {editandoIndex !== null ? "Actualizar" : "Agregar"} diseño
                                            </Button>
                                        </div>
                                    </div>

                                    {disenos.length > 0 ? (
                                        <Table striped bordered hover size="sm" responsive>
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Técnica</th>
                                                    <th>Parte</th>
                                                    <th>Subparte</th>
                                                    <th>Diseño</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {disenos.map((d, i) => (
                                                    <tr key={i}>
                                                        <td>{d.TecnicaNombre}</td>
                                                        <td>{d.ParteNombre}</td>
                                                        <td>{d.SubparteDescripcion || "—"}</td>
                                                        <td>
                                                            {d.Archivo ? (
                                                                <span className="text-success">✓ {d.Archivo.name}</span>
                                                            ) : (
                                                                <span className="text-muted">Sin archivo</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <Button variant="outline-primary" size="sm"
                                                                    onClick={() => handlePreviewDiseno(d.Archivo)} disabled={!d.Archivo}>
                                                                    <FaEye />
                                                                </Button>
                                                                <Button variant="outline-warning" size="sm"
                                                                    onClick={() => handleEditarDiseno(i)}>
                                                                    <FaEdit />
                                                                </Button>
                                                                <Button variant="outline-danger" size="sm"
                                                                    onClick={() => handleEliminarDiseno(i)}>
                                                                    <FaTrash />
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <Alert variant="info" className="mb-0">
                                            <small>No hay diseños agregados. Puedes continuar sin diseño personalizado.</small>
                                        </Alert>
                                    )}
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="d-flex gap-3 justify-content-end">
                                <Button variant="secondary" onClick={() => navigate("/productosLanding")} disabled={cargando}>
                                    Cancelar
                                </Button>
                                <Button variant="success" type="submit" disabled={cargando}>
                                    {cargando ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Enviando...
                                        </>
                                    ) : (
                                        "Enviar Cotización"
                                    )}
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>

                {/* Modales */}
                <Modal show={showProductPreview} onHide={() => setShowProductPreview(false)} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{producto?.Nombre}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {previewSrc && <img src={previewSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70vh' }} />}
                    </Modal.Body>
                </Modal>

                <Modal show={showDesignPreview} onHide={() => {
                    if (previewSrc) URL.revokeObjectURL(previewSrc);
                    setShowDesignPreview(false);
                }} centered size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Vista Previa del Diseño</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                        {previewSrc && <img src={previewSrc} alt="Preview diseño" style={{ maxWidth: '100%', maxHeight: '70vh' }} />}
                    </Modal.Body>
                </Modal>
            </Container>

            <FooterComponent />
        </>
    );
};

export default CotizacionLanding;