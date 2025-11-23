import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaCheck, FaTimes, FaSearch, FaClock } from "react-icons/fa";
import Swal from "sweetalert2";
import { getCotizaciones } from "../Services/api-cotizaciones/cotizaciones";


const Cotizaciones = () => {
  const navigate = useNavigate();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarCotizaciones();
  }, []);


  const cargarCotizaciones = async () => {
    setCargando(true);
    try {
      const response = await getCotizaciones();

      // --------- Mapeo correcto ---------
      const data = response.datos || response;

      const cotizacionesMapeadas = data.map(c => ({
        CotizacionID: c.id,
        FechaCotizacion: c.fecha,
        Usuario: {
          Nombre: c.cliente_nombre,
          DocumentoID: c.cliente_documento
        },
        DetalleCotizacion: {
          Producto: {
            ImagenProducto: c.producto_img,
            Nombre: c.producto_nombre
          },
          Cantidad: c.cantidad
        },
        Estado: c.estado,
        ValorTotal: c.valor_total
      }));

      setCotizaciones(cotizacionesMapeadas);

    } catch (error) {
      console.error("Error al cargar cotizaciones:", error);
      Swal.fire("Error", "No se pudieron cargar las cotizaciones", "error");
    } finally {
      setCargando(false);
    }
  };


  const cotizacionesFiltradas = cotizaciones.filter(c => {
    const matchBusqueda =
      c.CotizacionID.toString().includes(busqueda) ||
      c.Usuario.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.Usuario.DocumentoID.toString().includes(busqueda);

    const matchEstado = filtroEstado === "Todos" || c.Estado === filtroEstado;

    return matchBusqueda && matchEstado;
  });

  const obtenerBadgeEstado = (estado) => {
    const estilos = {
      Pendiente: { bg: "#ffc107", color: "#000" },
      Aprobada: { bg: "#28a745", color: "#fff" },
      Rechazada: { bg: "#dc3545", color: "#fff" }
    };
    const estilo = estilos[estado] || { bg: "#6c757d", color: "#fff" };

    return (
      <span style={{
        backgroundColor: estilo.bg,
        color: estilo.color,
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "0.85rem",
        fontWeight: "600"
      }}>
        {estado}
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

  const handleVerDetalle = (cotizacionID) => {
    navigate(`/dashboard/cotizaciones/detalle/${cotizacionID}`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #ffffff 0%, #fafcff 100%)",
      padding: "20px 30px"
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2', margin: 0 }}>
          Gestión de Cotizaciones
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            backgroundColor: '#ffc107',
            color: '#000',
            padding: '8px 15px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            <FaClock style={{ marginRight: '5px' }} />
            {cotizaciones.filter(c => c.Estado === "Pendiente").length} Pendientes
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
            <table className="table mb-0" style={{ minWidth: '1000px' }}>
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
                {cotizacionesFiltradas.map((cot) => (
                  <tr key={cot.CotizacionID} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '15px', fontWeight: '600' }}>
                      #{cot.CotizacionID}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '3px' }}>
                          {cot.Usuario.Nombre}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                          CC: {cot.Usuario.DocumentoID}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={cot.DetalleCotizacion.Producto.ImagenProducto}
                          alt={cot.DetalleCotizacion.Producto.Nombre}
                          style={{
                            width: '45px',
                            height: '45px',
                            objectFit: 'cover',
                            borderRadius: '6px'
                          }}
                        />
                        <span style={{ fontSize: '0.9rem' }}>
                          {cot.DetalleCotizacion.Producto.Nombre}
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
                        {cot.DetalleCotizacion.Cantidad} uds
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '0.9rem', color: '#555' }}>
                      {formatearFecha(cot.FechaCotizacion)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      {obtenerBadgeEstado(cot.Estado)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold' }}>
                      {cot.ValorTotal ? (
                        <span style={{ color: '#28a745', fontSize: '1rem' }}>
                          ${cot.ValorTotal.toLocaleString()}
                        </span>
                      ) : (
                        <span style={{ color: '#ffc107', fontSize: '0.9rem' }}>
                          Por calcular
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleVerDetalle(cot.CotizacionID)}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FaEye /> Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cotizaciones;