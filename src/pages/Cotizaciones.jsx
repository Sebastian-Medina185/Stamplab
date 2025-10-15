import { useState, useEffect } from "react";
import { FaEdit, FaEye, FaPlusCircle, FaSync, FaTrash } from "react-icons/fa";
import CotizacionesForm from "./formularios_dash/cotizacion";
import { getCotizaciones, deleteCotizacion, updateCotizacion } from "../Services/api-cotizaciones/cotizaciones";
import Swal from "sweetalert2";

const Cotizaciones = () => {
  const [search, setSearch] = useState("");
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCotizacion, setEditingCotizacion] = useState(null);

  useEffect(() => {
    loadCotizaciones();
  }, []);

  const loadCotizaciones = async () => {
    try {
      setLoading(true);
      const response = await getCotizaciones();
      setCotizaciones(response.datos);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede revertir",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteCotizacion(id);
          await loadCotizaciones();
          Swal.fire(
            "Eliminada",
            "La cotización ha sido eliminada.",
            "success"
          );
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message
      });
    }
  };

  const handleChangeStatus = async (id, currentStatus) => {
    const estados = ["pendiente", "confirmada", "rechazada"];
    const currentIndex = estados.indexOf(currentStatus);
    const newStatus = estados[(currentIndex + 1) % estados.length];

    try {
      await updateCotizacion(id, { Estado: newStatus });
      await loadCotizaciones();
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `La cotización ahora está ${newStatus}`
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message
      });
    }
  };

  const filteredCotizaciones = cotizaciones.filter(cot =>
    cot.DocumentoID.toString().includes(search.toLowerCase()) ||
    cot.Estado.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #ffffff 0%, #fafcff 100%)",
      }}
    >
      {/* Encabezado y botón agregar */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3 px-4">
        <h1
          className="fs-4 fw-bold mb-0 text-primary"
          style={{ letterSpacing: 1 }}
        >
          Gestión de Cotizaciones
        </h1>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setShowForm(true)}
        >
          <FaPlusCircle size={22} />
          Agregar Cotización
        </button>
      </div>

      {showForm ? (
        <CotizacionesForm onClose={() => setShowForm(false)} />
      ) : (
        <>
          {/* Buscador */}
          <div className="d-flex justify-content-end mb-3 px-4">
            <div className="input-group" style={{ maxWidth: 300 }}>
              <span className="input-group-text bg-white border-end-0">🔍</span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Filtrar cotizaciones..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Tabla con estilo */}
          <div
            className="flex-grow-1 px-4 pb-4"
            style={{ overflow: "auto", minHeight: 0 }}
          >
            <div
              className="table-responsive rounded-4 shadow"
              style={{ background: "#fff" }}
            >
              <table className="table align-middle mb-0">
                <thead
                  style={{
                    background:
                      "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                    color: "#fff",
                  }}
                >
                  <tr>
                    <th style={{ borderTopLeftRadius: 16 }}>ID</th>
                    <th>Documento/ID</th>
                    <th>Correo</th>
                    <th>Total</th>
                    <th>Teléfono</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th style={{ borderTopRightRadius: 16 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredCotizaciones.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No se encontraron cotizaciones
                      </td>
                    </tr>
                  ) : (
                    filteredCotizaciones.map((cotizacion) => (
                      <tr key={cotizacion.CotizacionID} style={{ borderBottom: "1px solid #e3e8ee" }}>
                        <td>
                          <span
                            className="badge bg-light text-dark px-3 py-2 shadow-sm"
                            style={{ fontSize: 15 }}
                          >
                            {cotizacion.CotizacionID}
                          </span>
                        </td>
                        <td className="fw-medium">{cotizacion.DocumentoID}</td>
                        <td>-</td>
                        <td>${cotizacion.ValorTotal?.toLocaleString()}</td>
                        <td>-</td>
                        <td>{new Date(cotizacion.FechaCotizacion).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge text-${
                              cotizacion.Estado === 'confirmada' ? 'success' :
                              cotizacion.Estado === 'rechazada' ? 'danger' :
                              'warning'
                            } fw-bold fs-6 px-1 py-2 shadow-sm`}
                            style={{ fontSize: 14 }}
                          >
                            {cotizacion.Estado}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm rounded-circle"
                              title="Ver"
                              onClick={() => {
                                setEditingCotizacion(cotizacion);
                                setShowForm(true);
                              }}
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              className="btn btn-outline-warning btn-sm rounded-circle"
                              title="Editar"
                              onClick={() => {
                                setEditingCotizacion(cotizacion);
                                setShowForm(true);
                              }}
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm rounded-circle"
                              title="Eliminar"
                              onClick={() => handleDelete(cotizacion.CotizacionID)}
                            >
                              <FaTrash size={16} />
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm rounded-circle"
                              title="Cambiar estado"
                              onClick={() => handleChangeStatus(cotizacion.CotizacionID, cotizacion.Estado)}
                            >
                              <FaSync size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cotizaciones;
