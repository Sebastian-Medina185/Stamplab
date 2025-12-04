import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import * as api from "../../Services/api-cotizacion-landing/cotizacion-landing.js";

const CotizacionLanding = () => {
  // Usuario
  const [usuario, setUsuario] = useState(null);
  const [mostrarLoginModal, setMostrarLoginModal] = useState(false);

  // Estados principales
  const [traePrenda, setTraePrenda] = useState("no");
  const [showDiseno, setShowDiseno] = useState(false);

  // Catálogos
  const [productos, setProductos] = useState([]);
  const [tecnicas, setTecnicas] = useState([]);
  const [partes, setPartes] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [telas, setTelas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Modal de selección de productos
  const [mostrarModalProductos, setMostrarModalProductos] = useState(false);

  // Formulario del producto (cuando NO trae prenda)
  const [formProducto, setFormProducto] = useState({
    TipoTela: "",
    Cantidad: 1,
    ColorID: "",
    TallaID: ""
  });

  // Formulario cuando SÍ trae prenda
  const [prendaDescripcion, setPrendaDescripcion] = useState("");

  // Diseño actual (para agregar al detalle del diseño)
  const [disenoActual, setDisenoActual] = useState({
    TecnicaID: "",
    ParteID: "",
    Subparte: "",
    ImagenDiseno: null,
    Observacion: ""
  });

  // Listas de detalles
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [disenosAgregados, setDisenosAgregados] = useState([]);

  // Mensajes de éxito
  const [mostrarExito, setMostrarExito] = useState(false);
  const [numeroCotizacion, setNumeroCotizacion] = useState(null);

  // ==================== EFECTOS ====================
  useEffect(() => {
    verificarAutenticacion();
    cargarDatos();
  }, []);

  // ==================== FUNCIONES ====================
  const verificarAutenticacion = () => {
    const usuarioStorage = localStorage.getItem("usuario");
    
    console.log('🔍 Verificando autenticación...');
    console.log('👤 Usuario en storage:', usuarioStorage);
    
    if (!usuarioStorage) {
      console.warn('⚠️ No hay usuario en localStorage');
      setMostrarLoginModal(true);
      return;
    }
    
    const usuarioParseado = JSON.parse(usuarioStorage);
    console.log('✅ Usuario cargado:', usuarioParseado);
    setUsuario(usuarioParseado);
  };

  const handleIniciarSesion = () => {
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = "/login";
  };

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [prodData, tecData, partData, colData, tallData, telData] = await Promise.all([
        api.getProductos(),
        api.getTecnicas(),
        api.getPartes(),
        api.getColores(),
        api.getTallas(),
        api.getTelas()
      ]);

      setProductos(prodData || []);
      setTecnicas(tecData || []);
      setPartes(partData || []);
      setColores(colData || []);
      setTallas(tallData || []);
      setTelas(telData || []);
    } catch (error) {
      Swal.fire("Error", error?.message || "Error cargando catálogos", "error");
    } finally {
      setCargando(false);
    }
  };

  // ==================== AGREGAR PARTE (DISEÑO) ====================
  const handleAgregarParte = () => {
    if (!disenoActual.TecnicaID || !disenoActual.ParteID) {
      Swal.fire("Atención", "Selecciona técnica y parte", "warning");
      return;
    }

    const disenoCompleto = {
      ...disenoActual,
      id: Date.now(),
      tecnica: tecnicas.find(t => t.TecnicaID == disenoActual.TecnicaID),
      parte: partes.find(p => p.ParteID == disenoActual.ParteID),
      ImagenNombre: disenoActual.ImagenDiseno?.name || "Sin archivo"
    };

    setDisenosAgregados(prev => [...prev, disenoCompleto]);

    setDisenoActual({
      TecnicaID: "",
      ParteID: "",
      Subparte: "",
      ImagenDiseno: null,
      Observacion: ""
    });

    Swal.fire({
      icon: "success",
      title: "Parte agregada",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleEliminarDiseno = (id) => {
    setDisenosAgregados(prev => prev.filter(d => d.id !== id));
  };

  // ==================== AGREGAR PRODUCTO ====================
  const handleAbrirModalProductos = () => {
    if (traePrenda === "si") {
      if (!prendaDescripcion.trim()) {
        Swal.fire("Atención", "Describe la prenda que traes", "warning");
        return;
      }
    } else {
      if (!formProducto.TipoTela || !formProducto.ColorID || !formProducto.TallaID) {
        Swal.fire("Atención", "Completa todos los campos (Tela, Color, Talla)", "warning");
        return;
      }
    }
    
    setMostrarModalProductos(true);
  };

  const handleSeleccionarProducto = (producto) => {
    const productoCompleto = {
      id: Date.now(),
      ProductoID: producto.ProductoID,
      producto: producto,
      Cantidad: formProducto.Cantidad,
      TraePrenda: traePrenda === "si",
      PrendaDescripcion: traePrenda === "si" ? prendaDescripcion : "",
      TipoTela: traePrenda === "no" ? formProducto.TipoTela : "",
      ColorID: traePrenda === "no" ? formProducto.ColorID : "",
      TallaID: traePrenda === "no" ? formProducto.TallaID : "",
      tela: traePrenda === "no" ? telas.find(t => t.InsumoID == formProducto.TipoTela) : null,
      color: traePrenda === "no" ? colores.find(c => c.ColorID == formProducto.ColorID) : null,
      talla: traePrenda === "no" ? tallas.find(t => t.TallaID == formProducto.TallaID) : null
    };

    setProductosAgregados(prev => [...prev, productoCompleto]);
    setMostrarModalProductos(false);

    if (traePrenda === "si") {
      setPrendaDescripcion("");
    } else {
      setFormProducto({
        TipoTela: "",
        Cantidad: 1,
        ColorID: "",
        TallaID: ""
      });
    }

    Swal.fire({
      icon: "success",
      title: "Producto agregado",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleEliminarProducto = (id) => {
    setProductosAgregados(prev => prev.filter(p => p.id !== id));
  };

  // ==================== GENERAR COTIZACIÓN ====================
  const handleGenerarCotizacion = async (e) => {
    if (e) e.preventDefault();

    if (!usuario) {
      console.error('❌ No hay usuario');
      setMostrarLoginModal(true);
      return;
    }

    const tienePrendaPropia = traePrenda === "si" && prendaDescripcion.trim();
    const tieneProductosAgregados = productosAgregados.length > 0;

    if (!tienePrendaPropia && !tieneProductosAgregados) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Debes agregar al menos un producto o describir la prenda que traes",
      });
      return;
    }

    if (tienePrendaPropia && !tieneProductosAgregados && disenosAgregados.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Atención",
        text: "Debes agregar al menos un diseño para tu prenda",
      });
      return;
    }

    try {
      let detalles = [];

      if (tienePrendaPropia && !tieneProductosAgregados) {
        const productoGenerico = productos.length > 0 ? productos[0] : { ProductoID: 1 };
        
        detalles = [{
          ProductoID: productoGenerico.ProductoID,
          Cantidad: 1,
          TraePrenda: true,
          PrendaDescripcion: prendaDescripcion,
          tallas: [],
          colores: [],
          insumos: [],
          tecnicas: disenosAgregados.map(dis => ({
            TecnicaID: dis.TecnicaID,
            ParteID: dis.ParteID,
            ImagenDiseño: dis.ImagenNombre,
            Observaciones: `${dis.Subparte ? 'Subparte: ' + dis.Subparte + ' - ' : ''}${dis.Observacion}`,
            CostoTecnica: 0
          }))
        }];
      } else {
        detalles = productosAgregados.map(prod => ({
          ProductoID: prod.ProductoID,
          Cantidad: prod.Cantidad,
          TraePrenda: prod.TraePrenda,
          PrendaDescripcion: prod.PrendaDescripcion,

          tallas: !prod.TraePrenda && prod.TallaID ? [{
            TallaID: prod.TallaID,
            Cantidad: prod.Cantidad,
            PrecioTalla: prod.talla?.Precio || 0
          }] : [],

          colores: !prod.TraePrenda && prod.ColorID ? [{
            ColorID: prod.ColorID,
            Cantidad: prod.Cantidad
          }] : [],

          insumos: !prod.TraePrenda && prod.TipoTela ? [{
            InsumoID: prod.TipoTela,
            CantidadRequerida: prod.Cantidad
          }] : [],

          tecnicas: disenosAgregados.map(dis => ({
            TecnicaID: dis.TecnicaID,
            ParteID: dis.ParteID,
            ImagenDiseño: dis.ImagenNombre,
            Observaciones: `${dis.Subparte ? 'Subparte: ' + dis.Subparte + ' - ' : ''}${dis.Observacion}`,
            CostoTecnica: 0
          }))
        }));
      }

      const cotizacionData = {
        DocumentoID: usuario.DocumentoID,
        FechaCotizacion: new Date().toISOString(),
        ValorTotal: 0,
        EstadoID: 1,
        detalles
      };

      const response = await api.createCotizacionCompleta(cotizacionData);

      setNumeroCotizacion(response?.cotizacion?.CotizacionID || response?.CotizacionID || null);
      setMostrarExito(true);

      setProductosAgregados([]);
      setDisenosAgregados([]);
      setTraePrenda("no");
      setShowDiseno(false);
      setPrendaDescripcion("");
      setFormProducto({
        TipoTela: "",
        Cantidad: 1,
        ColorID: "",
        TallaID: ""
      });

    } catch (error) {
      console.error('❌ Error:', error);
      Swal.fire("Error", "❌ " + (error?.message || "Error generando la cotización"), "error");
    }
  };

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {mostrarLoginModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🔐 Autenticación Requerida</h5>
              </div>
              <div className="modal-body text-center">
                <p className="mb-4">Debes iniciar sesión para cotizar productos</p>
                <button className="btn btn-primary" onClick={handleIniciarSesion}>
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarExito && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">✅ ¡Cotización Generada!</h5>
              </div>
              <div className="modal-body text-center">
                <h3 className="text-success mb-3">🎉 ¡Éxito!</h3>
                <p className="fs-5 mb-2"><strong>Ya estamos cotizando tu producto</strong></p>
                <p className="mb-3">Número de cotización: <strong className="text-primary">#{numeroCotizacion}</strong></p>
                <p className="text-muted">Pronto recibirás una respuesta</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setMostrarExito(false)}>
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarModalProductos && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🛍️ Selecciona un Producto</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModalProductos(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {productos.map(producto => (
                    <div key={producto.ProductoID} className="col-md-6">
                      <div className="card h-100 shadow-sm" style={{ cursor: "pointer" }}
                        onClick={() => handleSeleccionarProducto(producto)}>
                        <img src={producto.ImagenProducto || "https://via.placeholder.com/150"} 
                          className="card-img-top" alt={producto.Nombre}
                          style={{ height: "200px", objectFit: "cover" }} />
                        <div className="card-body">
                          <h6 className="card-title">{producto.Nombre}</h6>
                          <p className="card-text text-muted small">{producto.Descripcion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-4">
        <h2 className="fw-bold" style={{ color: "#1976d2" }}>Formulario de Cotización</h2>
        {usuario && <p className="text-muted">👤 Usuario: {usuario.Nombre}</p>}
      </div>

      <div className="p-4 rounded shadow" style={{ backgroundColor: "#f5f5fa" }}>
        <div className="mb-4 text-center">
          <label className="form-label me-3 fw-bold fs-5">¿Traes la prenda?</label>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="traePrenda" id="si" value="si"
              checked={traePrenda === "si"} onChange={(e) => setTraePrenda(e.target.value)} />
            <label className="form-check-label" htmlFor="si">Sí</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="traePrenda" id="no" value="no"
              checked={traePrenda === "no"} onChange={(e) => setTraePrenda(e.target.value)} />
            <label className="form-check-label" htmlFor="no">No</label>
          </div>
        </div>

        {traePrenda === "si" ? (
          <div className="mb-3">
            <label className="form-label fw-bold">Descripción de la prenda:</label>
            <textarea className="form-control" rows="3"
              placeholder="Describe tu prenda: tipo (camiseta, gorra, etc.), color, talla, material..."
              value={prendaDescripcion} onChange={(e) => setPrendaDescripcion(e.target.value)} />
            <small className="text-muted">
              💡 Describe tu prenda y luego agrega el diseño que deseas aplicarle
            </small>
          </div>
        ) : (
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-bold">Tipo Tela:</label>
              <select className="form-select" value={formProducto.TipoTela}
                onChange={(e) => setFormProducto({ ...formProducto, TipoTela: e.target.value })}>
                <option value="">Seleccione...</option>
                {telas.map(t => (
                  <option key={t.InsumoID} value={t.InsumoID}>
                    {t.Nombre} {t.PrecioTela ? `- $${t.PrecioTela}/m` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Cantidad:</label>
              <input type="number" className="form-control" min="1" value={formProducto.Cantidad}
                onChange={(e) => setFormProducto({ ...formProducto, Cantidad: parseInt(e.target.value) || 1 })} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Color:</label>
              <select className="form-select" value={formProducto.ColorID}
                onChange={(e) => setFormProducto({ ...formProducto, ColorID: e.target.value })}>
                <option value="">Seleccione...</option>
                {colores.map(c => (
                  <option key={c.ColorID} value={c.ColorID}>{c.Nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Talla:</label>
              <select className="form-select" value={formProducto.TallaID}
                onChange={(e) => setFormProducto({ ...formProducto, TallaID: e.target.value })}>
                <option value="">Seleccione...</option>
                {tallas.map(t => (
                  <option key={t.TallaID} value={t.TallaID}>
                    {t.Nombre} {t.Precio ? `(+$${t.Precio})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" id="diseno" checked={showDiseno}
            onChange={(e) => setShowDiseno(e.target.checked)} />
          <label className="form-check-label fw-bold fs-5" htmlFor="diseno">Aplicar diseño</label>
        </div>

        {showDiseno && (
          <div className="p-3 mb-3 rounded" style={{ backgroundColor: "#e9e6f3" }}>
            <h5 className="text-center mb-3">Configurar Diseño</h5>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Técnica:</label>
                <select className="form-select" value={disenoActual.TecnicaID}
                  onChange={(e) => setDisenoActual({ ...disenoActual, TecnicaID: e.target.value })}>
                  <option value="">Seleccione...</option>
                  {tecnicas.map(t => (
                    <option key={t.TecnicaID} value={t.TecnicaID}>{t.Nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Parte:</label>
                <select className="form-select" value={disenoActual.ParteID}
                  onChange={(e) => setDisenoActual({ ...disenoActual, ParteID: e.target.value })}>
                  <option value="">Seleccione...</option>
                  {partes.map(p => (
                    <option key={p.ParteID} value={p.ParteID}>{p.Nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Subparte:</label>
                <input type="text" className="form-control" placeholder="Ej: Manga izquierda"
                  value={disenoActual.Subparte}
                  onChange={(e) => setDisenoActual({ ...disenoActual, Subparte: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Diseño (Imagen):</label>
                <input type="file" className="form-control" accept="image/*"
                  onChange={(e) => setDisenoActual({ ...disenoActual, ImagenDiseno: e.target.files[0] })} />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">Observación:</label>
                <textarea className="form-control" rows="2" value={disenoActual.Observacion}
                  onChange={(e) => setDisenoActual({ ...disenoActual, Observacion: e.target.value })} />
              </div>
            </div>
            <div className="text-end">
              <button type="button" className="btn btn-success" onClick={handleAgregarParte}>
                + Agregar Parte
              </button>
            </div>

            {disenosAgregados.length > 0 && (
              <div className="table-responsive mt-3">
                <table className="table table-sm table-bordered bg-white">
                  <thead className="table-light">
                    <tr>
                      <th>Técnica</th>
                      <th>Parte</th>
                      <th>Subparte</th>
                      <th>Diseño</th>
                      <th>Observación</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disenosAgregados.map(dis => (
                      <tr key={dis.id}>
                        <td>{dis.tecnica?.Nombre}</td>
                        <td>{dis.parte?.Nombre}</td>
                        <td>{dis.Subparte || "-"}</td>
                        <td>{dis.ImagenNombre}</td>
                        <td>{dis.Observacion || "-"}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => handleEliminarDiseno(dis.id)}>
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div className="mb-3">
          <button type="button" className="btn btn-primary px-4" onClick={handleAbrirModalProductos}>
            + Agregar Producto
          </button>
        </div>

        {productosAgregados.length > 0 && (
          <div className="table-responsive mb-3">
            <table className="table table-bordered table-striped bg-white">
              <thead className="table-dark">
                <tr>
                  <th>Producto</th>
                  <th>Tela</th>
                  <th>Cant.</th>
                  <th>Color</th>
                  <th>Talla</th>
                  <th>Descripción</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {productosAgregados.map(prod => (
                  <tr key={prod.id}>
                    <td>{prod.producto?.Nombre}</td>
                    <td>{prod.TraePrenda ? "Trae prenda" : prod.tela?.Nombre}</td>
                    <td>{prod.Cantidad}</td>
                    <td>{prod.TraePrenda ? "-" : prod.color?.Nombre}</td>
                    <td>{prod.TraePrenda ? "-" : prod.talla?.Nombre}</td>
                    <td>{prod.PrendaDescripcion || "-"}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleEliminarProducto(prod.id)}>
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="d-flex justify-content-center gap-3">
          <button type="button" className="btn btn-success btn-lg px-5" onClick={handleGenerarCotizacion}
            disabled={!(productosAgregados.length > 0 || (traePrenda === "si" && prendaDescripcion.trim()))}>
            Generar Cotización
          </button>
          <button type="button" className="btn btn-secondary btn-lg px-4"
            onClick={() => {
              setProductosAgregados([]);
              setDisenosAgregados([]);
              setTraePrenda("no");
              setShowDiseno(false);
              setPrendaDescripcion("");
              setFormProducto({ TipoTela: "", Cantidad: 1, ColorID: "", TallaID: "" });
            }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CotizacionLanding;