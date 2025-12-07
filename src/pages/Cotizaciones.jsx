import React, { useState, useEffect } from "react";
import { FaEye, FaCheck, FaTimes, FaSearch, FaPlus, FaDollarSign, FaImage, FaExchangeAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { getCotizaciones, updateCotizacion, getCotizacionById } from "../Services/api-cotizaciones/cotizaciones";
import axios from "axios";
import ModalFormularioCotizacion from './formularios_dash/FormularioCotizacion';

const Cotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [imagenModal, setImagenModal] = useState(null);
  const [mostrarImagenModal, setMostrarImagenModal] = useState(false);

  useEffect(() => {
    cargarCotizaciones();
  }, []);

  const cargarCotizaciones = async () => {
    setCargando(true);
    try {
      const response = await getCotizaciones();
      const data = Array.isArray(response) ? response : (response?.datos || []);
      setCotizaciones(data);
    } catch (error) {
      console.error("Error al cargar cotizaciones:", error);
      Swal.fire("Error", "No se pudieron cargar las cotizaciones", "error");
    } finally {
      setCargando(false);
    }
  };

  const cotizacionesFiltradas = cotizaciones.filter(c => {
    const matchBusqueda =
      c.CotizacionID?.toString().includes(busqueda) ||
      c.usuario?.Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.usuario?.DocumentoID?.toString().includes(busqueda);
    const estadoNombre = c.estado?.Nombre || "Pendiente";
    const matchEstado = filtroEstado === "Todos" || estadoNombre === filtroEstado;
    return matchBusqueda && matchEstado;
  });

  const handleVerDetalle = async (cotizacionID) => {
    try {
      const response = await getCotizacionById(cotizacionID);
      setCotizacionSeleccionada(response);
      setMostrarDetalle(true);
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar el detalle", "error");
    }
  };

  const handleCerrarModales = () => {
    setMostrarDetalle(false);
    setMostrarFormulario(false);
    setCotizacionSeleccionada(null);
    cargarCotizaciones();
  };

  const handleCambiarEstado = async (cotizacionID, nuevoEstado) => {
    const estadoID = nuevoEstado === "Aprobada" ? 2 : nuevoEstado === "Rechazada" ? 3 : 1;
    try {
      await updateCotizacion(cotizacionID, { EstadoID: estadoID });
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        timer: 1500,
        showConfirmButton: false
      });
      cargarCotizaciones();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el estado", "error");
    }
  };

  // 🆕 CONVERTIR COTIZACIÓN A VENTA
  const handleConvertirAVenta = async (cotizacionID) => {
    const result = await Swal.fire({
      title: '¿Convertir cotización a venta?',
      html: `
        <p>Esta acción:</p>
        <ul style="text-align: left;">
          <li>Creará una venta pendiente</li>
          <li>Descontará el stock de los productos</li>
          <li>Marcará la cotización como procesada</li>
        </ul>
        <p><strong>¿Deseas continuar?</strong></p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, convertir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`http://localhost:3000/api/cotizaciones/${cotizacionID}/convertir-a-venta`);
        
        Swal.fire({
          icon: 'success',
          title: '¡Conversión exitosa!',
          html: `
            <p>La cotización se ha convertido en venta</p>
            <p><strong>Venta ID:</strong> ${response.data.venta.VentaID}</p>
            <p class="text-muted">El stock ha sido descontado automáticamente</p>
          `,
          confirmButtonText: 'Entendido'
        });

        cargarCotizaciones();
      } catch (error) {
        console.error('Error al convertir:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al convertir',
          text: error.response?.data?.message || error.message || 'Error desconocido'
        });
      }
    }
  };

  const handleVerImagen = (url) => {
    setImagenModal(url);
    setMostrarImagenModal(true);
  };

  const handleCerrarImagenModal = () => {
    setMostrarImagenModal(false);
    setImagenModal(null);
  };

  const obtenerBadgeEstado = (estado) => {
    const estadoNombre = estado?.Nombre || estado || "Pendiente";
    const estilos = {
      Pendiente: { bg: "#ffc107", color: "#000" },
      Aprobada: { bg: "#28a745", color: "#fff" },
      Rechazada: { bg: "#dc3545", color: "#fff" }
    };
    const estilo = estilos[estadoNombre] || { bg: "#6c757d", color: "#fff" };
    return (
      <span style={{
        backgroundColor: estilo.bg,
        color: estilo.color,
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "600"
      }}>
        {estadoNombre}
      </span>
    );
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const obtenerPrimerProducto = (detalles) => {
    if (!Array.isArray(detalles) || detalles.length === 0) {
      return { Nombre: "Sin producto", ImagenProducto: "https://via.placeholder.com/45", Cantidad: 0 };
    }
    const primerDetalle = detalles[0];
    const producto = primerDetalle.producto || {};
    return {
      Nombre: producto.Nombre || "Producto",
      ImagenProducto: producto.ImagenProducto || "https://via.placeholder.com/45",
      Cantidad: primerDetalle.Cantidad || 0
    };
  };

  return (
    <>
      {mostrarImagenModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.7)", display: "flex",
          justifyContent: "center", alignItems: "center", zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "white", padding: "20px", borderRadius: "12px",
            width: "75%", maxWidth: "400px", maxHeight: "90vh",
            display: "flex", flexDirection: "column", alignItems: "center",
            boxShadow: "0 4px 25px rgba(0,0,0,0.3)"
          }}>
            <img src={imagenModal} alt="Imagen del producto"
              style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "8px" }} />
            <button className="w-75 btn btn-danger"
              onClick={handleCerrarImagenModal}
              style={{
                marginTop: "15px", padding: "8px 20px",
                color: "white", border: "none", borderRadius: "6px",
                cursor: "pointer", fontWeight: "600"
              }}>
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ffffff 0%, #fafcff 100%)", padding: "20px 30px" }}>
        {mostrarDetalle && cotizacionSeleccionada && (
          <ModalDetalleCotizacion 
            cotizacion={cotizacionSeleccionada} 
            onClose={handleCerrarModales} 
            onActualizar={cargarCotizaciones}
            onConvertirAVenta={handleConvertirAVenta}
          />
        )}

        {mostrarFormulario && (
          <ModalFormularioCotizacion onClose={handleCerrarModales} onActualizar={cargarCotizaciones} />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2', margin: 0 }}>
            Gestión de Cotizaciones
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setMostrarFormulario(true)} style={{
              backgroundColor: '#28a745', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '6px', fontSize: '0.9rem',
              fontWeight: '600', cursor: 'pointer', display: 'flex',
              alignItems: 'center', gap: '8px'
            }}>
              <FaPlus /> Nueva Cotización
            </button>
            <span style={{
              backgroundColor: '#ffc107', color: '#000', padding: '8px 15px',
              borderRadius: '20px', fontSize: '0.9rem', fontWeight: '600'
            }}>
              {cotizaciones.filter(c => (c.estado?.Nombre || "Pendiente") === "Pendiente").length} Pendientes
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '15px', flexWrap: 'wrap' }}>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} style={{
            padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem'
          }}>
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Rechazada">Rechazada</option>
          </select>

          <div style={{ position: 'relative', maxWidth: '350px', flex: 1 }}>
            <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input type="text" placeholder="Buscar..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={{
              width: '100%', padding: '8px 12px 8px 35px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '0.9rem'
            }} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {cargando ? (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <div className="spinner-border text-primary" />
              <p style={{ marginTop: '15px', color: '#6c757d' }}>Cargando...</p>
            </div>
          ) : cotizacionesFiltradas.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6c757d' }}>
              <p>No hay cotizaciones</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table mb-0" style={{ minWidth: '1200px' }}>
                <thead style={{ background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)', color: '#fff' }}>
                  <tr>
                    <th style={{ padding: '15px' }}>ID</th>
                    <th style={{ padding: '15px' }}>Cliente</th>
                    <th style={{ padding: '15px' }}>Producto</th>
                    <th style={{ padding: '15px' }}>Cantidad</th>
                    <th style={{ padding: '15px' }}>Fecha</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Estado</th>
                    <th style={{ padding: '15px', textAlign: 'right' }}>Valor Total</th>
                    <th style={{ padding: '15px', textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cotizacionesFiltradas.map((cot) => {
                    const producto = obtenerPrimerProducto(cot.detalles);
                    const estadoNombre = cot.estado?.Nombre || "Pendiente";
                    return (
                      <tr key={cot.CotizacionID} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '15px', fontWeight: '600' }}>{cot.CotizacionID}</td>
                        <td style={{ padding: '15px' }}>
                          <div style={{ fontWeight: '600', marginBottom: '3px' }}>{cot.usuario?.Nombre || "Sin nombre"}</div>
                          <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>CC: {cot.usuario?.DocumentoID || "N/A"}</div>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <div className="text-center" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{producto.Nombre}</span>
                            <button onClick={() => handleVerImagen(producto.ImagenProducto)} style={{
                              padding: '6px', backgroundColor: '#1976d2', color: 'white',
                              border: 'none', borderRadius: '4px', cursor: 'pointer',
                              fontSize: '0.75rem', fontWeight: '600', width: '120px'
                            }}>
                              Ver imagen
                            </button>
                          </div>
                        </td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ backgroundColor: '#f0f0f0', padding: '4px 10px', borderRadius: '4px', fontSize: '0.85rem' }}>
                            {producto.Cantidad} uds
                          </span>
                        </td>
                        <td style={{ padding: '15px', fontSize: '0.9rem', color: '#555' }}>{formatearFecha(cot.FechaCotizacion)}</td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>{obtenerBadgeEstado(cot.estado)}</td>
                        <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>
                          <span style={{ color: '#28a745', fontSize: '1rem' }}>
                            ${(cot.ValorTotal || 0).toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => handleVerDetalle(cot.CotizacionID)} style={{
                              padding: '6px 12px', backgroundColor: '#1976d2', color: 'white',
                              border: 'none', borderRadius: '4px', cursor: 'pointer',
                              fontSize: '0.8rem', fontWeight: '600',
                              display: 'inline-flex', alignItems: 'center', gap: '4px'
                            }}>
                              <FaEye /> Detalle
                            </button>
                            {estadoNombre === "Pendiente" && (
                              <>
                                <button onClick={() => handleCambiarEstado(cot.CotizacionID, "Aprobada")} style={{
                                  padding: '6px 12px', backgroundColor: '#28a745', color: 'white',
                                  border: 'none', borderRadius: '4px', cursor: 'pointer',
                                  fontSize: '0.8rem', fontWeight: '600',
                                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                                }}>
                                  <FaCheck /> Aprobar
                                </button>
                                <button onClick={() => handleCambiarEstado(cot.CotizacionID, "Rechazada")} style={{
                                  padding: '6px 12px', backgroundColor: '#dc3545', color: 'white',
                                  border: 'none', borderRadius: '4px', cursor: 'pointer',
                                  fontSize: '0.8rem', fontWeight: '600',
                                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                                }}>
                                  <FaTimes /> Rechazar
                                </button>
                              </>
                            )}
                            {estadoNombre === "Aprobada" && (
                              <button onClick={() => handleConvertirAVenta(cot.CotizacionID)} style={{
                                padding: '6px 12px', backgroundColor: '#17a2b8', color: 'white',
                                border: 'none', borderRadius: '4px', cursor: 'pointer',
                                fontSize: '0.8rem', fontWeight: '600',
                                display: 'inline-flex', alignItems: 'center', gap: '4px'
                              }}>
                                <FaExchangeAlt /> Convertir
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// MODAL DETALLE (actualizado con botón convertir)
const ModalDetalleCotizacion = ({ cotizacion, onClose, onActualizar, onConvertirAVenta }) => {
  const handleAsignarCostoTecnica = async (tecnicaID) => {
    const estadoNombre = cotizacion.estado?.Nombre || "Pendiente";

    if (estadoNombre === "Aprobada" || estadoNombre === "Rechazada" || estadoNombre === "Cancelada") {
      Swal.fire({
        icon: "warning",
        title: "Acción no permitida",
        text: `No se puede modificar el costo de técnicas en cotizaciones con estado: ${estadoNombre}`
      });
      return;
    }

    const tecnicaActual = cotizacion.detalles.flatMap(d => d.tecnicas || []).find(t => t.CotizacionTecnicaID === tecnicaID);
    const { value: costo } = await Swal.fire({
      title: "Asignar Costo de Técnica",
      input: "number",
      inputLabel: "Costo en pesos (COP)",
      inputPlaceholder: "Ej: 25000",
      inputValue: tecnicaActual?.CostoTecnica || 0,
      showCancelButton: true,
      confirmButtonText: "Guardar"
    });

    if (costo !== undefined) {
      try {
        await axios.put(`http://localhost:3000/api/cotizaciontecnicas/${tecnicaID}`, { CostoTecnica: parseFloat(costo) });
        Swal.fire({ icon: "success", title: "Costo asignado", text: "Total recalculado", timer: 2000, showConfirmButton: false });
        onActualizar();
        onClose();
      } catch (error) {
        Swal.fire("Error", "No se pudo asignar el costo", "error");
      }
    }
  };

  const estadoNombre = cotizacion.estado?.Nombre || "Pendiente";
  const puedeEditarCostos = estadoNombre !== "Rechazada";
  const esAprobada = estadoNombre === "Aprobada";

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
      overflow: "auto", padding: "20px"
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '12px',
        maxWidth: '1200px', margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{
          background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
          color: 'white', padding: '20px 30px',
          borderRadius: '12px 12px 0 0', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
              Cotización #{cotizacion.CotizacionID}
            </h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
              {new Date(cotizacion.FechaCotizacion).toLocaleDateString('es-CO', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
          <button onClick={onClose} style={{
            backgroundColor: 'transparent', border: '2px solid white',
            color: 'white', width: '40px', height: '40px',
            borderRadius: '50%', cursor: 'pointer',
            fontSize: '1.2rem', fontWeight: 'bold'
          }}>×</button>
        </div>

        <div style={{ padding: '30px' }}>
          {/* Cliente */}
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
            <h5 style={{ color: '#333', marginBottom: '15px', fontWeight: 'bold' }}>
              Información del Cliente
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <div>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Nombre</p>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>
                  {cotizacion.usuario?.Nombre || "N/A"}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Documento</p>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>
                  {cotizacion.usuario?.DocumentoID || "N/A"}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Correo</p>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>
                  {cotizacion.usuario?.Correo || "N/A"}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Teléfono</p>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1rem' }}>
                  {cotizacion.usuario?.Telefono || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Resumen con botón convertir */}
          <div style={{
            backgroundColor: estadoNombre === "Aprobada" ? '#d4edda' :
              estadoNombre === "Rechazada" ? '#f8d7da' : '#fff3cd',
            border: `2px solid ${estadoNombre === "Aprobada" ? '#28a745' :
              estadoNombre === "Rechazada" ? '#dc3545' : '#ffc107'}`,
            padding: '20px', borderRadius: '8px', marginBottom: '25px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>Estado</p>
              <p style={{
                margin: '5px 0 0 0', fontSize: '1.3rem', fontWeight: 'bold',
                color: estadoNombre === "Aprobada" ? '#155724' :
                  estadoNombre === "Rechazada" ? '#721c24' : '#856404'
              }}>{estadoNombre}</p>
              {esAprobada && (
                <button onClick={() => onConvertirAVenta(cotizacion.CotizacionID)} style={{
                  marginTop: '10px', padding: '8px 16px',
                  backgroundColor: '#17a2b8', color: 'white',
                  border: 'none', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '0.9rem',
                  fontWeight: '600', display: 'flex',
                  alignItems: 'center', gap: '6px'
                }}>
                  <FaExchangeAlt /> Convertir a Venta
                </button>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>
                Valor Total
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#28a745' }}>
                ${(cotizacion.ValorTotal || 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Resto del modal (productos, diseños, etc.) */}
          <h5 style={{ color: '#333', marginBottom: '20px', fontWeight: 'bold' }}>
            Detalles de Productos
          </h5>
          {cotizacion.detalles && cotizacion.detalles.length > 0 ? (
            cotizacion.detalles.map((detalle, index) => (
              <div key={detalle.DetalleCotizacionID} style={{
                border: '1px solid #ddd', borderRadius: '8px',
                padding: '20px', marginBottom: '20px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'flex-start' }}>
                  <img src={detalle.producto?.ImagenProducto || "https://via.placeholder.com/100"}
                    alt={detalle.producto?.Nombre} style={{
                      width: '100px', height: '100px', objectFit: 'cover',
                      borderRadius: '8px', border: '1px solid #ddd'
                    }} />
                  <div style={{ flex: 1 }}>
                    <h6 style={{ color: '#1976d2', fontWeight: 'bold', marginBottom: '10px' }}>
                      Producto {index + 1}: {detalle.producto?.Nombre || "Sin nombre"}
                    </h6>
                    <p style={{ margin: '5px 0', color: '#555' }}>
                      <strong>Cantidad:</strong> {detalle.Cantidad} unidades
                    </p>
                    {detalle.TraePrenda && (
                      <p style={{ margin: '5px 0', color: '#555' }}>
                        <strong>Prenda propia:</strong> {detalle.PrendaDescripcion || "Sí"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Diseños */}
                {detalle.tecnicas && detalle.tecnicas.length > 0 && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                    <h6 style={{ fontWeight: 'bold', marginBottom: '15px', color: '#6f42c1' }}>
                      Diseños Aplicados ({detalle.tecnicas.length})
                    </h6>
                    {detalle.tecnicas.map((tec, idx) => (
                      <div key={tec.CotizacionTecnicaID} style={{
                        backgroundColor: 'white', border: '1px solid #e0e0e0',
                        borderRadius: '6px', padding: '15px', marginBottom: '10px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '15px' }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '5px 0', fontSize: '0.95rem' }}>
                              <strong style={{ color: '#6f42c1' }}>Técnica:</strong> {tec.tecnica?.Nombre || "N/A"}
                            </p>
                            <p style={{ margin: '5px 0', fontSize: '0.95rem' }}>
                              <strong style={{ color: '#6f42c1' }}>Parte:</strong> {tec.parte?.Nombre || "N/A"}
                            </p>
                            {tec.Observaciones && (
                              <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>
                                <strong>Observaciones:</strong> {tec.Observaciones}
                              </p>
                            )}
                            {tec.ImagenDiseño && (
                              <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#666' }}>
                                <FaImage style={{ marginRight: '5px' }} />
                                <strong>Diseño:</strong> {tec.ImagenDiseño}
                              </p>
                            )}
                          </div>
                          <div style={{ textAlign: 'right', minWidth: '150px' }}>
                            <p style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: 'bold', color: '#28a745' }}>
                              ${(tec.CostoTecnica || 0).toLocaleString()}
                            </p>
                            <button onClick={() => handleAsignarCostoTecnica(tec.CotizacionTecnicaID)}
                              disabled={!puedeEditarCostos} style={{
                                padding: '6px 12px',
                                backgroundColor: puedeEditarCostos ? '#ffc107' : '#6c757d',
                                color: puedeEditarCostos ? '#000' : '#fff',
                                border: 'none', borderRadius: '4px',
                                cursor: puedeEditarCostos ? 'pointer' : 'not-allowed',
                                fontSize: '0.8rem', fontWeight: '600',
                                display: 'flex', alignItems: 'center', gap: '5px'
                              }}>
                              <FaDollarSign /> {puedeEditarCostos ? 'Asignar' : 'Bloqueado'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tallas y Colores */}
                {detalle.tallas && detalle.tallas.length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                    <strong>Tallas:</strong> {detalle.tallas.map(t =>
                      `${t.talla?.Nombre} (${t.Cantidad} - ${(t.talla?.Precio || 0).toLocaleString()})`
                    ).join(', ')}
                  </div>
                )}
                {detalle.colores && detalle.colores.length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
                    <strong>Colores:</strong> {detalle.colores.map(c =>
                      `${c.color?.Nombre} (${c.Cantidad})`
                    ).join(', ')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No hay detalles
            </p>
          )}
        </div>

        <div style={{
          borderTop: '1px solid #ddd', padding: '20px 30px',
          display: 'flex', justifyContent: 'flex-end'
        }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', backgroundColor: '#6c757d',
            color: 'white', border: 'none', borderRadius: '6px',
            cursor: 'pointer', fontWeight: '600'
          }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default Cotizaciones;