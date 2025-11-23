import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Table, Modal, Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash, FaPlus, FaShoppingCart } from "react-icons/fa";

const FormularioCompra = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const producto = location.state?.producto;

    // ===== ESTADOS PRINCIPALES =====
    const [colorID, setColorID] = useState("");
    const [tallaID, setTallaID] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [telaID, setTelaID] = useState("");
    const [traePrenda, setTraePrenda] = useState(false);
    const [prendaDescripcion, setPrendaDescripcion] = useState("");
    const [observacionesGenerales, setObservacionesGenerales] = useState("");

    // ===== DATOS DE CATÁLOGOS =====
    const [colores, setColores] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [telas, setTelas] = useState([]);
    const [tecnicas, setTecnicas] = useState([]);
    const [partes, setPartes] = useState([]);

    // ===== DISEÑOS =====
    const [disenos, setDisenos] = useState([]);
    const [tecnicaID, setTecnicaID] = useState("");
    const [parteID, setParteID] = useState("");
    const [subparteDescripcion, setSubparteDescripcion] = useState("");
    const [archivoDiseno, setArchivoDiseno] = useState(null);
    const [observacionDiseno, setObservacionDiseno] = useState("");
    const [editandoIndex, setEditandoIndex] = useState(null);

    // ===== MODALES Y UI =====
    const [showProductPreview, setShowProductPreview] = useState(false);
    const [showDesignPreview, setShowDesignPreview] = useState(false);
    const [previewSrc, setPreviewSrc] = useState(null);
    const [cargando, setCargando] = useState(false);

    // ===== CARGAR DATOS INICIALES =====
    useEffect(() => {
        if (!producto) {
            navigate("/productosLanding");
            return;
        }
        cargarCatalogos();
    }, [producto, navigate]);

    const cargarCatalogos = async () => {
        try {
            // Aquí deberías llamar a tus servicios reales
            // import { getColores, getTallas, getTelas } from "../../Services/api-productos/atributos";
            // import { getTecnicas } from "../../Services/api-tecnicas/tecnicas";
            // import { getPartes } from "../../Services/api-partes/partes";
            
            // Por ahora, datos de ejemplo:
            setColores([
                { ColorID: 1, Nombre: "Blanco" },
                { ColorID: 2, Nombre: "Negro" },
                { ColorID: 3, Nombre: "Azul" },
                { ColorID: 4, Nombre: "Rojo" },
                { ColorID: 5, Nombre: "Verde" }
            ]);

            setTallas([
                { TallaID: 1, Nombre: "S", Precio: 25000 },
                { TallaID: 2, Nombre: "M", Precio: 25000 },
                { TallaID: 3, Nombre: "L", Precio: 28000 },
                { TallaID: 4, Nombre: "XL", Precio: 30000 },
                { TallaID: 5, Nombre: "XXL", Precio: 35000 },
                { TallaID: 6, Nombre: "XXXL", Precio: 40000 }
            ]);

            setTelas([
                { InsumoID: 1, Nombre: "Algodón", PrecioTela: 5000 },
                { InsumoID: 2, Nombre: "Poliéster", PrecioTela: 4000 },
                { InsumoID: 3, Nombre: "Jersey", PrecioTela: 6000 },
                { InsumoID: 4, Nombre: "Denim", PrecioTela: 8000 }
            ]);

            setTecnicas([
                { TecnicaID: 1, Nombre: "Sublimación", Descripcion: "Impresión por calor" },
                { TecnicaID: 2, Nombre: "Bordado", Descripcion: "Bordado con hilo" },
                { TecnicaID: 3, Nombre: "Vinilo", Descripcion: "Aplicación de vinilo textil" },
                { TecnicaID: 4, Nombre: "Serigrafía", Descripcion: "Impresión por pantalla" }
            ]);

            setPartes([
                { ParteID: 1, Nombre: "Frente" },
                { ParteID: 2, Nombre: "Espalda" },
                { ParteID: 3, Nombre: "Manga Derecha" },
                { ParteID: 4, Nombre: "Manga Izquierda" },
                { ParteID: 5, Nombre: "Lateral Derecho" },
                { ParteID: 6, Nombre: "Lateral Izquierdo" },
                { ParteID: 7, Nombre: "Cuello" }
            ]);

        } catch (error) {
            console.error("Error al cargar catálogos:", error);
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
            alert("Por favor selecciona una técnica y una parte");
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
            Observaciones: observacionDiseno
        };

        if (editandoIndex !== null) {
            setDisenos(prev => prev.map((d, i) => i === editandoIndex ? nuevoDiseno : d));
        } else {
            setDisenos(prev => [...prev, nuevoDiseno]);
        }

        resetCamposDiseno();
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
        if (!window.confirm("¿Eliminar este diseño?")) return;
        setDisenos(prev => prev.filter((_, i) => i !== index));
    };

    const handlePreviewDiseno = (archivo) => {
        if (!archivo) {
            alert("No hay archivo para previsualizar");
            return;
        }
        const url = URL.createObjectURL(archivo);
        setPreviewSrc(url);
        setShowDesignPreview(true);
    };

    // ===== CÁLCULO DE PRECIO =====
    const calcularPrecioTotal = () => {
        const talla = tallas.find(t => t.TallaID === parseInt(tallaID));
        const tela = telas.find(t => t.InsumoID === parseInt(telaID));

        let precioBase = 0;
        
        // Precio de la talla (incluye producto base)
        if (talla) {
            precioBase += talla.Precio;
        }

        // Precio de la tela (si no trae prenda)
        if (!traePrenda && tela) {
            precioBase += tela.PrecioTela;
        }

        // Multiplicar por cantidad
        const subtotal = precioBase * parseInt(cantidad || 1);

        return {
            precioBase,
            precioTalla: talla?.Precio || 0,
            precioTela: (!traePrenda && tela) ? tela.PrecioTela : 0,
            cantidadUnidades: parseInt(cantidad || 1),
            subtotal
        };
    };

    // ===== ENVIAR COTIZACIÓN =====
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!traePrenda && (!colorID || !tallaID || !telaID)) {
            alert("Por favor completa todos los campos obligatorios");
            return;
        }

        if (traePrenda && !prendaDescripcion.trim()) {
            alert("Por favor describe la prenda que traerás");
            return;
        }

        const precios = calcularPrecioTotal();

        const cotizacion = {
            // Datos del producto
            ProductoID: producto.ProductoID,
            ProductoNombre: producto.Nombre,
            ColorID: traePrenda ? null : parseInt(colorID),
            TallaID: traePrenda ? null : parseInt(tallaID),
            TelaID: traePrenda ? null : parseInt(telaID),
            Cantidad: parseInt(cantidad),
            
            // Prenda propia
            TraePrenda: traePrenda,
            PrendaDescripcion: traePrenda ? prendaDescripcion : null,
            
            // Diseños
            Disenos: disenos.map(d => ({
                TecnicaID: d.TecnicaID,
                ParteID: d.ParteID,
                SubparteDescripcion: d.SubparteDescripcion,
                ImagenDiseño: d.Archivo, // Aquí deberías convertir a base64 o subirlo
                Observaciones: d.Observaciones
            })),
            
            // Observaciones generales
            ObservacionesGenerales: observacionesGenerales,
            
            // Precios calculados (para referencia, el admin puede ajustarlos)
            PrecioEstimado: precios.subtotal,
            DetallePrecio: precios
        };

        console.log("Cotización a enviar:", cotizacion);

        setCargando(true);
        try {
            // Aquí llamarías a tu servicio real
            // await crearCotizacion(cotizacion);
            
            // Simulación
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert("¡Cotización creada! Te contactaremos pronto con el precio final.");
            navigate("/misCotizaciones");
        } catch (error) {
            console.error("Error al crear cotización:", error);
            alert("Error al crear la cotización. Intenta nuevamente.");
        } finally {
            setCargando(false);
        }
    };

    if (!producto) return null;

    const precios = calcularPrecioTotal();
    const tallaSeleccionada = tallas.find(t => t.TallaID === parseInt(tallaID));
    const telaSeleccionada = telas.find(t => t.InsumoID === parseInt(telaID));

    return (
        <Container className="py-4" style={{ maxWidth: '1200px' }}>
            <h3 className="text-center mb-4 fw-bold" style={{ color: '#2c3e50' }}>
                Solicitar Cotización: {producto.Nombre}
            </h3>

            <Form onSubmit={handleSubmit}>
                <Row>
                    {/* COLUMNA IZQUIERDA - Imagen y Resumen */}
                    <Col lg={4}>
                        <div className="sticky-top" style={{ top: '20px' }}>
                            {/* Imagen del producto */}
                            <div 
                                className="text-center mb-3 p-3 rounded shadow-sm"
                                style={{ backgroundColor: '#fff', cursor: 'pointer' }}
                                onClick={() => {
                                    setPreviewSrc(producto.ImagenProducto);
                                    setShowProductPreview(true);
                                }}
                            >
                                <img
                                    src={producto.ImagenProducto}
                                    alt={producto.Nombre}
                                    style={{ 
                                        maxWidth: '100%', 
                                        maxHeight: '280px',
                                        borderRadius: '8px',
                                        objectFit: 'contain'
                                    }}
                                />
                                <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
                                    Click para ampliar
                                </p>
                            </div>

                            {/* Resumen de Precio */}
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h6 className="mb-0">Resumen de Cotización</h6>
                                </div>
                                <div className="card-body">
                                    {!traePrenda ? (
                                        <>
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
                                            <small>
                                                Traes tu prenda. El administrador calculará el precio según los diseños aplicados.
                                            </small>
                                        </Alert>
                                    )}

                                    {disenos.length > 0 && (
                                        <Alert variant="warning" className="mt-3 mb-0">
                                            <small>
                                                + Costo de {disenos.length} diseño(s)<br />
                                                (Se calculará según técnicas)
                                            </small>
                                        </Alert>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* COLUMNA DERECHA - Formulario */}
                    <Col lg={8}>
                        {/* Sección 1: ¿Traes tu prenda? */}
                        <div className="card shadow-sm mb-3">
                            <div className="card-header bg-light">
                                <h6 className="mb-0">Tipo de Prenda</h6>
                            </div>
                            <div className="card-body">
                                <Form.Check
                                    type="switch"
                                    id="traePrenda"
                                    label="Traigo mi propia prenda"
                                    checked={traePrenda}
                                    onChange={(e) => {
                                        setTraePrenda(e.target.checked);
                                        if (e.target.checked) {
                                            setColorID("");
                                            setTallaID("");
                                            setTelaID("");
                                        } else {
                                            setPrendaDescripcion("");
                                        }
                                    }}
                                    style={{ fontSize: '1.05rem', fontWeight: '500' }}
                                />

                                {traePrenda && (
                                    <div className="mt-3">
                                        <Form.Group>
                                            <Form.Label className="fw-medium">
                                                Describe tu prenda <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={prendaDescripcion}
                                                onChange={(e) => setPrendaDescripcion(e.target.value)}
                                                placeholder="Ej: Camiseta blanca, talla M, manga corta, 100% algodón"
                                                required={traePrenda}
                                            />
                                            <Form.Text className="text-muted">
                                                Incluye: tipo de prenda, color, talla, material
                                            </Form.Text>
                                        </Form.Group>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sección 2: Características de la prenda (si NO trae prenda) */}
                        {!traePrenda && (
                            <div className="card shadow-sm mb-3">
                                <div className="card-header bg-light">
                                    <h6 className="mb-0">Características de la Prenda</h6>
                                </div>
                                <div className="card-body">
                                    <Row className="g-3">
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="fw-medium">
                                                    Color <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    value={colorID}
                                                    onChange={(e) => setColorID(e.target.value)}
                                                    required={!traePrenda}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {colores.map(c => (
                                                        <option key={c.ColorID} value={c.ColorID}>
                                                            {c.Nombre}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="fw-medium">
                                                    Talla <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    value={tallaID}
                                                    onChange={(e) => setTallaID(e.target.value)}
                                                    required={!traePrenda}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {tallas.map(t => (
                                                        <option key={t.TallaID} value={t.TallaID}>
                                                            {t.Nombre} - ${t.Precio.toLocaleString()}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label className="fw-medium">
                                                    Cantidad <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="1"
                                                    value={cantidad}
                                                    onChange={(e) => setCantidad(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={12}>
                                            <Form.Group>
                                                <Form.Label className="fw-medium">
                                                    Tipo de Tela <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Select
                                                    value={telaID}
                                                    onChange={(e) => setTelaID(e.target.value)}
                                                    required={!traePrenda}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {telas.map(t => (
                                                        <option key={t.InsumoID} value={t.InsumoID}>
                                                            {t.Nombre} - +${t.PrecioTela.toLocaleString()}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        )}

                        {/* Sección 3: Diseños */}
                        <div className="card shadow-sm mb-3">
                            <div className="card-header bg-light">
                                <h6 className="mb-0">Diseños Personalizados</h6>
                            </div>
                            <div className="card-body">
                                {/* Formulario de diseño */}
                                <div className="p-3 rounded mb-3" style={{ backgroundColor: '#f8f9fa', border: '2px dashed #dee2e6' }}>
                                    <h6 className="mb-3">{editandoIndex !== null ? "Editar" : "Nuevo"} Diseño</h6>
                                    
                                    <Row className="g-3 mb-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-medium">Técnica</Form.Label>
                                                <Form.Select
                                                    value={tecnicaID}
                                                    onChange={(e) => setTecnicaID(e.target.value)}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {tecnicas.map(t => (
                                                        <option key={t.TecnicaID} value={t.TecnicaID}>
                                                            {t.Nombre}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-medium">Parte de la prenda</Form.Label>
                                                <Form.Select
                                                    value={parteID}
                                                    onChange={(e) => setParteID(e.target.value)}
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {partes.map(p => (
                                                        <option key={p.ParteID} value={p.ParteID}>
                                                            {p.Nombre}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-medium">Subparte (opcional)</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={subparteDescripcion}
                                                    onChange={(e) => setSubparteDescripcion(e.target.value)}
                                                    placeholder="Ej: Superior izquierdo, centrado"
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-medium">Archivo del diseño</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setArchivoDiseno(e.target.files[0])}
                                                />
                                                {archivoDiseno && (
                                                    <small className="text-success d-block mt-1">
                                                        ✓ {archivoDiseno.name}
                                                    </small>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Col md={12}>
                                            <Form.Group>
                                                <Form.Label className="fw-medium">Observaciones del diseño</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    value={observacionDiseno}
                                                    onChange={(e) => setObservacionDiseno(e.target.value)}
                                                    placeholder="Ej: El logo debe ser azul marino, tamaño 10cm x 10cm"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="d-flex gap-2">
                                        {editandoIndex !== null && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={resetCamposDiseno}
                                            >
                                                Cancelar
                                            </Button>
                                        )}
                                        <Button
                                            variant={editandoIndex !== null ? "warning" : "success"}
                                            size="sm"
                                            onClick={handleAgregarOActualizarDiseno}
                                        >
                                            <FaPlus className="me-1" />
                                            {editandoIndex !== null ? "Actualizar" : "Agregar"} diseño
                                        </Button>
                                    </div>
                                </div>

                                {/* Tabla de diseños agregados */}
                                {disenos.length > 0 ? (
                                    <Table striped bordered hover size="sm" responsive>
                                        <thead className="table-light">
                                            <tr>
                                                <th>Técnica</th>
                                                <th>Parte</th>
                                                <th>Subparte</th>
                                                <th>Diseño</th>
                                                <th>Observaciones</th>
                                                <th className="text-center">Acciones</th>
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
                                                            <span className="text-success">
                                                                ✓ {d.Archivo.name}
                                                            </span>
                                                        ) : (
                                                            <span className="text-muted">Sin archivo</span>
                                                        )}
                                                    </td>
                                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {d.Observaciones || "—"}
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-flex justify-content-center gap-1">
                                                            <Button
                                                                variant="outline-primary"
                                                                size="sm"
                                                                onClick={() => handlePreviewDiseno(d.Archivo)}
                                                                disabled={!d.Archivo}
                                                                title="Ver diseño"
                                                            >
                                                                <FaEye />
                                                            </Button>
                                                            <Button
                                                                variant="outline-warning"
                                                                size="sm"
                                                                onClick={() => handleEditarDiseno(i)}
                                                                title="Editar"
                                                            >
                                                                <FaEdit />
                                                            </Button>
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleEliminarDiseno(i)}
                                                                title="Eliminar"
                                                            >
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
                                        <small>No hay diseños agregados. Si no necesitas diseño personalizado, puedes continuar sin agregar ninguno.</small>
                                    </Alert>
                                )}
                            </div>
                        </div>

                        {/* Sección 4: Observaciones Generales */}
                        <div className="card shadow-sm mb-3">
                            <div className="card-header bg-light">
                                <h6 className="mb-0">Observaciones Adicionales</h6>
                            </div>
                            <div className="card-body">
                                <Form.Group>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={observacionesGenerales}
                                        onChange={(e) => setObservacionesGenerales(e.target.value)}
                                        placeholder="Escribe cualquier detalle adicional, fecha de entrega deseada, etc."
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="d-flex gap-3 justify-content-end">
                            <Button
                                variant="secondary"
                                onClick={() => navigate("/productosLanding")}
                                disabled={cargando}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="success"
                                type="submit"
                                disabled={cargando}
                                className="d-flex align-items-center gap-2"
                            >
                                {cargando ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <FaShoppingCart />
                                        Enviar Cotización
                                    </>
                                )}
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Form>

            {/* Modal Vista Previa Producto */}
            <Modal 
                show={showProductPreview} 
                onHide={() => setShowProductPreview(false)} 
                centered 
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{producto?.Nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {previewSrc && (
                        <img 
                            src={previewSrc} 
                            alt="Vista previa producto" 
                            style={{ maxWidth: '100%', maxHeight: '70vh' }} 
                        />
                    )}
                </Modal.Body>
            </Modal>

            {/* Modal Vista Previa Diseño */}
            <Modal 
                show={showDesignPreview} 
                onHide={() => {
                    if (previewSrc) URL.revokeObjectURL(previewSrc);
                    setShowDesignPreview(false);
                }} 
                centered 
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Vista Previa del Diseño</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {previewSrc ? (
                        <img 
                            src={previewSrc} 
                            alt="Vista previa diseño" 
                            style={{ maxWidth: '100%', maxHeight: '70vh' }} 
                        />
                    ) : (
                        <p>No hay preview disponible</p>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default FormularioCompra;