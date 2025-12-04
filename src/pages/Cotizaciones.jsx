import React, { useState, useEffect } from "react";
import { FaEye, FaCheck, FaTimes, FaSearch, FaPlus, FaEdit, FaTrash, FaDollarSign } from "react-icons/fa";
import Swal from "sweetalert2";
import { getCotizaciones, updateCotizacion, getCotizacionById } from "../Services/api-cotizaciones/cotizaciones";
import { getUsuarios } from "../Services/api-usuarios/usuarios";
import { getProductos } from "../Services/api-cotizacion-landing/cotizacion-landing";
import { getTecnicas, getPartes, getColores, getTallas, getTelas } from "../Services/api-cotizacion-landing/cotizacion-landing";
import axios from "axios";

const Cotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  // Modales
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);
  const [cotizacionEditando, setCotizacionEditando] = useState(null);

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
      Swal.fire("Error", "No se pudo cargar el detalle de la cotización", "error");
    }
  };

  const handleNuevaCotizacion = () => {
    setCotizacionEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarCotizacion = async (cotizacionID) => {
    try {
      const response = await getCotizacionById(cotizacionID);
      setCotizacionEditando(response);
      setMostrarFormulario(true);
    } catch (error) {
      Swal.fire("Error", "No se pudo cargar la cotización para editar", "error");
    }
  };

  const handleCerrarModales = () => {
    setMostrarDetalle(false);
    setMostrarFormulario(false);
    setCotizacionSeleccionada(null);
    setCotizacionEditando(null);
    cargarCotizaciones();
  };

  const handleCambiarEstado = async (cotizacionID, nuevoEstado) => {
    const estadoID = nuevoEstado === "Aprobada" ? 2 : nuevoEstado === "Rechazada" ? 3 : 1;

    try {
      await updateCotizacion(cotizacionID, { EstadoID: estadoID });
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `Cotización ${nuevoEstado.toLowerCase()}`,
        timer: 1500,
        showConfirmButton: false
      });
      cargarCotizaciones();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el estado", "error");
    }
  };

  const handleAsignarValor = async (cotizacionID) => {
    const { value: valorTotal } = await Swal.fire({
      title: "Asignar Valor Total",
      input: "number",
      inputLabel: "Valor en pesos (COP)",
      inputPlaceholder: "Ej: 150000",
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar"
    });

    if (valorTotal) {
      try {
        await updateCotizacion(cotizacionID, { ValorTotal: parseFloat(valorTotal) });
        Swal.fire({
          icon: "success",
          title: "Valor asignado",
          timer: 1500,
          showConfirmButton: false
        });
        cargarCotizaciones();
      } catch (error) {
        Swal.fire("Error", "No se pudo asignar el valor", "error");
      }
    }
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
      return {
        Nombre: "Sin producto",
        ImagenProducto: "https://via.placeholder.com/45",
        Cantidad: 0
      };
    }

    const primerDetalle = detalles[0];
    const producto = primerDetalle.producto || primerDetalle.Producto || {};

    return {
      Nombre: producto.Nombre || "Producto",
      ImagenProducto: producto.ImagenProducto || "https://via.placeholder.com/45",
      Cantidad: primerDetalle.Cantidad || 0
    };
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ffffff 0%, #fafcff 100%)",
      padding: "20px 30px"
    }}>
      {/* MODAL DETALLE */}
      {mostrarDetalle && cotizacionSeleccionada && (
        <ModalDetalleCotizacion
          cotizacion={cotizacionSeleccionada}
          onClose={handleCerrarModales}
          onActualizar={cargarCotizaciones}
        />
      )}

      {/* MODAL FORMULARIO */}
      {mostrarFormulario && (
        <ModalFormularioCotizacion
          cotizacionToEdit={cotizacionEditando}
          onClose={handleCerrarModales}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2', margin: 0 }}>
          Gestión de Cotizaciones
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleNuevaCotizacion}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaPlus /> Nueva Cotización
          </button>
          <span style={{
            backgroundColor: '#ffc107',
            color: '#000',
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            {cotizaciones.filter(c => (c.estado?.Nombre || "Pendiente") === "Pendiente").length} Pendientes
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '0.9rem'
            }}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        <div style={{ position: 'relative', maxWidth: '350px', flex: 1 }}>
          <FaSearch style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#999'
          }} />
          <input
            type="text"
            placeholder="Buscar por ID, cliente o documento..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 35px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      {/* Tabla */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        {cargando ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p style={{ marginTop: '15px', color: '#6c757d' }}>Cargando cotizaciones...</p>
          </div>
        ) : cotizacionesFiltradas.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#6c757d' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
              {busqueda || filtroEstado !== "Todos"
                ? "No se encontraron cotizaciones con ese criterio"
                : "No hay cotizaciones registradas"}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table mb-0" style={{ minWidth: '1200px' }}>
              <thead style={{
                background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
                color: '#fff'
              }}>
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
                      <td style={{ padding: '15px', fontWeight: '600' }}>
                        #{cot.CotizacionID}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '3px' }}>
                            {cot.usuario?.Nombre || "Sin nombre"}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                            CC: {cot.usuario?.DocumentoID || "N/A"}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={producto.ImagenProducto}
                            alt={producto.Nombre}
                            style={{
                              width: '45px',
                              height: '45px',
                              objectFit: 'cover',
                              borderRadius: '6px'
                            }}
                          />
                          <span style={{ fontSize: '0.9rem' }}>
                            {producto.Nombre}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          backgroundColor: '#f0f0f0',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.85rem'
                        }}>
                          {producto.Cantidad} uds
                        </span>
                      </td>
                      <td style={{ padding: '15px', fontSize: '0.9rem', color: '#555' }}>
                        {formatearFecha(cot.FechaCotizacion)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        {obtenerBadgeEstado(cot.estado)}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>
                        {cot.ValorTotal ? (
                          <span style={{ color: '#28a745', fontSize: '1rem' }}>
                            ${cot.ValorTotal.toLocaleString()}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAsignarValor(cot.CotizacionID)}
                            style={{
                              backgroundColor: '#ffc107',
                              color: '#000',
                              border: 'none',
                              padding: '4px 12px',
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Asignar valor
                          </button>
                        )}
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleVerDetalle(cot.CotizacionID)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#1976d2',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FaEye /> Detalle
                          </button>

                          {estadoNombre === "Pendiente" && (
                            <>
                              <button
                                onClick={() => handleCambiarEstado(cot.CotizacionID, "Aprobada")}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#28a745',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <FaCheck /> Aprobar
                              </button>
                              <button
                                onClick={() => handleCambiarEstado(cot.CotizacionID, "Rechazada")}
                                style={{
                                  padding: '6px 12px',
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                  fontWeight: '600',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <FaTimes /> Rechazar
                              </button>
                            </>
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
  );
};

// ========================================
// MODAL DETALLE COTIZACIÓN
// ========================================
const ModalDetalleCotizacion = ({ cotizacion, onClose, onActualizar }) => {
  const [editandoTecnica, setEditandoTecnica] = useState(null);
  const [costoTecnica, setCostoTecnica] = useState(0);

  // En ModalDetalleCotizacion - Actualizar correctamente después de asignar costo

  const handleAsignarCostoTecnica = async (tecnicaID, detalleID) => {
    const tecnicaActual = cotizacion.detalles
      .flatMap(d => d.tecnicas || [])
      .find(t => t.CotizacionTecnicaID === tecnicaID);

    const { value: costo } = await Swal.fire({
      title: "Asignar Costo de Técnica",
      input: "number",
      inputLabel: "Costo en pesos (COP)",
      inputPlaceholder: "Ej: 25000",
      inputValue: tecnicaActual?.CostoTecnica || 0,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar"
    });

    if (costo !== undefined) {
      try {
        // Actualizar costo de técnica
        await axios.put(`http://localhost:3000/api/cotizaciontecnicas/${tecnicaID}`, {
          CostoTecnica: parseFloat(costo)
        });

        Swal.fire({
          icon: "success",
          title: "Costo asignado",
          timer: 1500,
          showConfirmButton: false
        });

        // Recargar y cerrar modal para refrescar datos
        onActualizar();

        // Esperar un momento y volver a abrir el modal con datos actualizados
        setTimeout(async () => {
          const response = await axios.get(`http://localhost:3000/api/cotizaciones/${cotizacion.CotizacionID}`);
          // Actualizar la cotización seleccionada con los nuevos datos
          onClose(); // Cerrar primero
          // Luego el padre debe volver a cargar
        }, 500);

      } catch (error) {
        Swal.fire("Error", "No se pudo asignar el costo", "error");
      }
    }
  };

  // Deshabilitar botón si está rechazada
  const estadoNombre = cotizacion.estado?.Nombre || "Pendiente";
  const puedeEditarCostos = estadoNombre !== "Rechazada";

  // En el botón de asignar costo:
  <button
    onClick={() => handleAsignarCostoTecnica(tec.CotizacionTecnicaID)}
    disabled={!puedeEditarCostos} // ✅ Deshabilitar si está rechazada
    style={{
      padding: '4px 10px',
      backgroundColor: puedeEditarCostos ? '#ffc107' : '#6c757d',
      color: puedeEditarCostos ? '#000' : '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: puedeEditarCostos ? 'pointer' : 'not-allowed',
      fontSize: '0.75rem',
      fontWeight: '600'
    }}
  >
    <FaDollarSign /> {puedeEditarCostos ? 'Asignar' : 'Bloqueado'}
  </button>


  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 9999,
      overflow: "auto",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
          color: 'white',
          padding: '20px 30px',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
              Cotización #{cotizacion.CotizacionID}
            </h2>
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
              {new Date(cotizacion.FechaCotizacion).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: '2px solid white',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: '30px' }}>
          {/* Información del Cliente */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '25px'
          }}>
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

          {/* Resumen Financiero */}
          <div style={{
            backgroundColor: estadoNombre === "Aprobada" ? '#d4edda' : estadoNombre === "Rechazada" ? '#f8d7da' : '#fff3cd',
            border: `2px solid ${estadoNombre === "Aprobada" ? '#28a745' : estadoNombre === "Rechazada" ? '#dc3545' : '#ffc107'}`,
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>Estado</p>
              <p style={{
                margin: '5px 0 0 0',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: estadoNombre === "Aprobada" ? '#155724' : estadoNombre === "Rechazada" ? '#721c24' : '#856404'
              }}>
                {estadoNombre}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500' }}>Valor Total</p>
              <p style={{
                margin: '5px 0 0 0',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                color: '#28a745'
              }}>
                ${cotizacion.ValorTotal?.toLocaleString() || "Por asignar"}
              </p>
            </div>
          </div>

          {/* Detalles de Productos */}
          <h5 style={{ color: '#333', marginBottom: '20px', fontWeight: 'bold' }}>
            Detalles de Productos
          </h5>

          {cotizacion.detalles && cotizacion.detalles.length > 0 ? (
            cotizacion.detalles.map((detalle, index) => (
              <div key={detalle.DetalleCotizacionID} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                backgroundColor: '#fafafa'
              }}>
                {/* Cabecera del Producto */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'flex-start' }}>
                  <img
                    src={detalle.producto?.ImagenProducto || "https://via.placeholder.com/100"}
                    alt={detalle.producto?.Nombre}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
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

                {/* Técnicas */}
                {detalle.tecnicas && detalle.tecnicas.length > 0 && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
                    <h6 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Técnicas Aplicadas</h6>
                    <table className="table table-sm table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Técnica</th>
                          <th>Parte</th>
                          <th>Observaciones</th>
                          <th style={{ textAlign: 'right' }}>Costo</th>
                          <th style={{ textAlign: 'center' }}>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detalle.tecnicas.map(tec => (
                          <tr key={tec.CotizacionTecnicaID}>
                            <td>{tec.tecnica?.Nombre || "N/A"}</td>
                            <td>{tec.parte?.Nombre || "N/A"}</td>
                            <td>{tec.Observaciones || "-"}</td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#28a745' }}>
                              ${tec.CostoTecnica?.toLocaleString() || "0"}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button
                                onClick={() => handleAsignarCostoTecnica(tec.CotizacionTecnicaID)}
                                style={{
                                  padding: '4px 10px',
                                  backgroundColor: '#ffc107',
                                  color: '#000',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  fontWeight: '600'
                                }}
                              >
                                <FaDollarSign /> Asignar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Tallas */}
                {detalle.tallas && detalle.tallas.length > 0 && (
                  <div style={{ marginTop: '15px' }}>
                    <strong>Tallas:</strong> {detalle.tallas.map(t => `${t.talla?.Nombre} (${t.Cantidad})`).join(', ')}
                  </div>
                )}

                {/* Colores */}
                {detalle.colores && detalle.colores.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Colores:</strong> {detalle.colores.map(c => `${c.color?.Nombre} (${c.Cantidad})`).join(', ')}
                  </div>
                )}

                {/* Insumos */}
                {detalle.insumos && detalle.insumos.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Insumos:</strong> {detalle.insumos.map(i => `${i.insumo?.Nombre} (${i.CantidadRequerida})`).join(', ')}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No hay detalles de productos en esta cotización
            </p>
          )}
        </div>

        {/* Footer con Botones */}
        <div style={{
          borderTop: '1px solid #ddd',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

// ========================================
// MODAL FORMULARIO COTIZACIÓN COMPLETA
// ========================================
const ModalFormularioCotizacion = ({ cotizacionToEdit, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [tecnicas, setTecnicas] = useState([]);
  const [partes, setPartes] = useState([]);
  const [colores, setColores] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [telas, setTelas] = useState([]);

  // Formulario principal
  const [documentoID, setDocumentoID] = useState("");
  const [valorTotal, setValorTotal] = useState(0);
  const [estadoID, setEstadoID] = useState(1);

  // Formulario de detalle de producto
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidadProducto, setCantidadProducto] = useState(1);
  const [traePrenda, setTraePrenda] = useState(false);
  const [prendaDescripcion, setPrendaDescripcion] = useState("");
  const [tallasSeleccionadas, setTallasSeleccionadas] = useState([]);
  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);
  const [telaSeleccionada, setTelaSeleccionada] = useState("");

  // Técnicas del detalle actual
  const [tecnicasDetalle, setTecnicasDetalle] = useState([]);
  const [tecnicaActual, setTecnicaActual] = useState("");
  const [parteActual, setParteActual] = useState("");
  const [observacionTecnica, setObservacionTecnica] = useState("");

  // Lista de detalles agregados
  const [detallesAgregados, setDetallesAgregados] = useState([]);

  useEffect(() => {
    cargarDatos();
    if (cotizacionToEdit) {
      setDocumentoID(cotizacionToEdit.usuario?.DocumentoID || cotizacionToEdit.DocumentoID || "");
      setValorTotal(cotizacionToEdit.ValorTotal || 0);

      let estadoId = 1;
      if (cotizacionToEdit.EstadoID) {
        estadoId = cotizacionToEdit.EstadoID;
      } else if (cotizacionToEdit.estado) {
        const estadoNombre = cotizacionToEdit.estado.Nombre || cotizacionToEdit.estado;
        if (estadoNombre === "Aprobada") estadoId = 2;
        else if (estadoNombre === "Rechazada") estadoId = 3;
      }
      setEstadoID(estadoId);
    }
  }, [cotizacionToEdit]);

  const cargarDatos = async () => {
    try {
      const [usuariosData, productosData, tecnicasData, partesData, coloresData, tallasData, telasData] = await Promise.all([
        getUsuarios(),
        getProductos(),
        getTecnicas(),
        getPartes(),
        getColores(),
        getTallas(),
        getTelas()
      ]);

      setUsuarios(usuariosData?.datos || usuariosData || []);
      setProductos(productosData || []);
      setTecnicas(tecnicasData || []);
      setPartes(partesData || []);
      setColores(coloresData || []);
      setTallas(tallasData || []);
      setTelas(telasData || []);
    } catch (error) {
      console.error("Error cargando catálogos:", error);
      Swal.fire("Error", "No se pudieron cargar los catálogos", "error");
    }
  };

  const handleAgregarTecnica = () => {
    if (!tecnicaActual || !parteActual) {
      Swal.fire("Atención", "Selecciona técnica y parte", "warning");
      return;
    }

    const tecnica = tecnicas.find(t => t.TecnicaID === parseInt(tecnicaActual));
    const parte = partes.find(p => p.ParteID === parseInt(parteActual));

    setTecnicasDetalle([...tecnicasDetalle, {
      id: Date.now(),
      TecnicaID: parseInt(tecnicaActual),
      TecnicaNombre: tecnica?.Nombre,
      ParteID: parseInt(parteActual),
      ParteNombre: parte?.Nombre,
      Observaciones: observacionTecnica
    }]);

    setTecnicaActual("");
    setParteActual("");
    setObservacionTecnica("");
  };

  const handleEliminarTecnica = (id) => {
    setTecnicasDetalle(tecnicasDetalle.filter(t => t.id !== id));
  };

  const handleAgregarDetalle = () => {
    if (!productoSeleccionado) {
      Swal.fire("Atención", "Selecciona un producto", "warning");
      return;
    }

    if (traePrenda && !prendaDescripcion.trim()) {
      Swal.fire("Atención", "Describe la prenda que trae el cliente", "warning");
      return;
    }

    const producto = productos.find(p => p.ProductoID === parseInt(productoSeleccionado));

    const detalle = {
      id: Date.now(),
      ProductoID: parseInt(productoSeleccionado),
      ProductoNombre: producto?.Nombre,
      ProductoImagen: producto?.ImagenProducto,
      Cantidad: parseInt(cantidadProducto),
      TraePrenda: traePrenda,
      PrendaDescripcion: traePrenda ? prendaDescripcion : "",
      tecnicas: [...tecnicasDetalle],
      tallas: tallasSeleccionadas.map(t => ({
        TallaID: t.TallaID,
        TallaNombre: t.Nombre,
        Cantidad: t.cantidad
      })),
      colores: coloresSeleccionados.map(c => ({
        ColorID: c.ColorID,
        ColorNombre: c.Nombre,
        Cantidad: c.cantidad
      })),
      insumos: telaSeleccionada ? [{
        InsumoID: parseInt(telaSeleccionada),
        InsumoNombre: telas.find(t => t.InsumoID === parseInt(telaSeleccionada))?.Nombre,
        CantidadRequerida: parseInt(cantidadProducto)
      }] : []
    };

    setDetallesAgregados([...detallesAgregados, detalle]);

    // Resetear formulario de detalle
    setProductoSeleccionado("");
    setCantidadProducto(1);
    setTraePrenda(false);
    setPrendaDescripcion("");
    setTallasSeleccionadas([]);
    setColoresSeleccionados([]);
    setTelaSeleccionada("");
    setTecnicasDetalle([]);

    Swal.fire({
      icon: "success",
      title: "Detalle agregado",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleEliminarDetalle = (id) => {
    setDetallesAgregados(detallesAgregados.filter(d => d.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!documentoID) {
      Swal.fire("Atención", "Selecciona un cliente", "warning");
      return;
    }

    if (detallesAgregados.length === 0) {
      Swal.fire("Atención", "Agrega al menos un detalle de producto", "warning");
      return;
    }

    setLoading(true);
    try {
      if (cotizacionToEdit) {
        // Actualizar solo valores principales
        await axios.put(`http://localhost:3000/api/cotizaciones/${cotizacionToEdit.CotizacionID}`, {
          ValorTotal: parseFloat(valorTotal) || 0,
          EstadoID: parseInt(estadoID)
        });

        Swal.fire({
          icon: "success",
          title: "Cotización actualizada",
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // Crear cotización completa
        const detallesFormateados = detallesAgregados.map(det => ({
          ProductoID: det.ProductoID,
          Cantidad: det.Cantidad,
          TraePrenda: det.TraePrenda,
          PrendaDescripcion: det.PrendaDescripcion,
          tecnicas: det.tecnicas.map(t => ({
            TecnicaID: t.TecnicaID,
            ParteID: t.ParteID,
            Observaciones: t.Observaciones || "",
            CostoTecnica: 0
          })),
          tallas: det.tallas.map(t => ({
            TallaID: t.TallaID,
            Cantidad: t.Cantidad
          })),
          colores: det.colores.map(c => ({
            ColorID: c.ColorID,
            Cantidad: c.Cantidad
          })),
          insumos: det.insumos
        }));

        const cotizacionData = {
          DocumentoID: parseInt(documentoID),
          FechaCotizacion: new Date().toISOString(),
          ValorTotal: parseFloat(valorTotal) || 0,
          EstadoID: parseInt(estadoID),
          detalles: detallesFormateados
        };

        const response = await axios.post('http://localhost:3000/api/cotizaciones/completa', cotizacionData);

        Swal.fire({
          icon: "success",
          title: "Cotización creada",
          text: `ID: ${response.data.cotizacion?.CotizacionID}`,
          timer: 2000,
          showConfirmButton: false
        });
      }

      onClose();
    } catch (error) {
      console.error("Error:", error);
      const mensaje = error.response?.data?.message || error?.message || "Error al procesar la cotización";
      Swal.fire("Error", mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 9999,
      overflow: "auto",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        maxWidth: '1400px',
        margin: '0 auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, #28a745 60%, #5cb85c 100%)',
          color: 'white',
          padding: '20px 30px',
          borderRadius: '12px 12px 0 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
            {cotizacionToEdit ? "Editar Cotización" : "Nueva Cotización Completa"}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: '2px solid white',
              color: 'white',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          {/* Información Principal */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '25px'
          }}>
            <h5 style={{ marginBottom: '20px', fontWeight: 'bold' }}>Información Principal</h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
              <div>
                <label className="form-label fw-bold">Cliente *</label>
                <select
                  className="form-select"
                  value={documentoID}
                  onChange={(e) => setDocumentoID(e.target.value)}
                  required
                  disabled={loading || cotizacionToEdit}
                >
                  <option value="">Seleccionar...</option>
                  {usuarios.map(u => (
                    <option key={u.DocumentoID} value={u.DocumentoID}>
                      {u.Nombre} - CC: {u.DocumentoID}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label fw-bold">Estado</label>
                <select
                  className="form-select"
                  value={estadoID}
                  onChange={(e) => setEstadoID(e.target.value)}
                  disabled={loading}
                >
                  <option value="1">Pendiente</option>
                  <option value="2">Aprobada</option>
                  <option value="3">Rechazada</option>
                </select>
              </div>
              <div>
                <label className="form-label fw-bold">Valor Total (COP)</label>
                <input
                  type="number"
                  className="form-control"
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1000"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Agregar Detalles de Producto */}
          {!cotizacionToEdit && (
            <div style={{
              border: '2px dashed #28a745',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <h5 style={{ marginBottom: '20px', fontWeight: 'bold', color: '#28a745' }}>
                Agregar Producto
              </h5>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label className="form-label fw-bold">Producto *</label>
                  <select
                    className="form-select"
                    value={productoSeleccionado}
                    onChange={(e) => setProductoSeleccionado(e.target.value)}
                  >
                    <option value="">Seleccionar...</option>
                    {productos.map(p => (
                      <option key={p.ProductoID} value={p.ProductoID}>
                        {p.Nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label fw-bold">Cantidad *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={cantidadProducto}
                    onChange={(e) => setCantidadProducto(e.target.value)}
                    min="1"
                  />
                </div>
                <div>
                  <label className="form-label fw-bold">Tipo de Tela</label>
                  <select
                    className="form-select"
                    value={telaSeleccionada}
                    onChange={(e) => setTelaSeleccionada(e.target.value)}
                    disabled={traePrenda}
                  >
                    <option value="">Seleccionar...</option>
                    {telas.map(t => (
                      <option key={t.InsumoID} value={t.InsumoID}>
                        {t.Nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="traePrenda"
                  checked={traePrenda}
                  onChange={(e) => setTraePrenda(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="traePrenda">
                  El cliente trae su propia prenda
                </label>
              </div>

              {traePrenda && (
                <div className="mb-3">
                  <label className="form-label fw-bold">Descripción de la prenda *</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={prendaDescripcion}
                    onChange={(e) => setPrendaDescripcion(e.target.value)}
                    placeholder="Describe la prenda que trae el cliente..."
                  />
                </div>
              )}

              {/* Técnicas */}
              <div style={{
                backgroundColor: '#e9ecef',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '15px'
              }}>
                <h6 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Agregar Técnicas</h6>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <select
                    className="form-select form-select-sm"
                    value={tecnicaActual}
                    onChange={(e) => setTecnicaActual(e.target.value)}
                  >
                    <option value="">Técnica...</option>
                    {tecnicas.map(t => (
                      <option key={t.TecnicaID} value={t.TecnicaID}>{t.Nombre}</option>
                    ))}
                  </select>
                  <select
                    className="form-select form-select-sm"
                    value={parteActual}
                    onChange={(e) => setParteActual(e.target.value)}
                  >
                    <option value="">Parte...</option>
                    {partes.map(p => (
                      <option key={p.ParteID} value={p.ParteID}>{p.Nombre}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="Observaciones..."
                    value={observacionTecnica}
                    onChange={(e) => setObservacionTecnica(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={handleAgregarTecnica}
                  >
                    <FaPlus /> Agregar
                  </button>
                </div>

                {tecnicasDetalle.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    {tecnicasDetalle.map(t => (
                      <div key={t.id} style={{
                        backgroundColor: 'white',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        marginBottom: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ fontSize: '0.9rem' }}>
                          <strong>{t.TecnicaNombre}</strong> en {t.ParteNombre}
                          {t.Observaciones && ` - ${t.Observaciones}`}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleEliminarTecnica(t.id)}
                          style={{ padding: '2px 8px' }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn btn-success"
                onClick={handleAgregarDetalle}
              >
                <FaPlus /> Agregar este producto a la cotización
              </button>
            </div>
          )}

          {/* Lista de Detalles Agregados */}
          {detallesAgregados.length > 0 && (
            <div style={{ marginBottom: '25px' }}>
              <h5 style={{ marginBottom: '15px', fontWeight: 'bold' }}>
                Productos en la Cotización ({detallesAgregados.length})
              </h5>
              {detallesAgregados.map(det => (
                <div key={det.id} style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '15px',
                  backgroundColor: '#fafafa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
                      <img
                        src={det.ProductoImagen || "https://via.placeholder.com/60"}
                        alt={det.ProductoNombre}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      <div>
                        <h6 style={{ margin: 0, fontWeight: 'bold', color: '#1976d2' }}>
                          {det.ProductoNombre}
                        </h6>
                        <p style={{ margin: '5px 0', fontSize: '0.9rem', color: '#555' }}>
                          Cantidad: {det.Cantidad} |
                          {det.TraePrenda ? ` Prenda propia: ${det.PrendaDescripcion}` : ` Tela: ${det.insumos[0]?.InsumoNombre || "N/A"}`}
                        </p>
                        {det.tecnicas.length > 0 && (
                          <p style={{ margin: '5px 0', fontSize: '0.85rem', color: '#666' }}>
                            Técnicas: {det.tecnicas.map(t => t.TecnicaNombre).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminarDetalle(det.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Botones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading || (detallesAgregados.length === 0 && !cotizacionToEdit)}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Procesando...
                </>
              ) : (
                cotizacionToEdit ? "Actualizar Cotización" : "Crear Cotización Completa"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cotizaciones;