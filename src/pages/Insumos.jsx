import { useEffect, useState } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash, FaSync } from "react-icons/fa";
import InsumoForm from "./formularios_dash/insumosForm";
import { getInsumos } from "../Services/api-insumos/insumos";

const Insumos = () => {
  const [showForm, setShowForm] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getInsumos();
        
        // Verificar que data.datos existe y es un array
        if (data && Array.isArray(data.datos)) {
          setInsumos(data.datos);
        } else {
          console.warn(
            "Los datos recibidos no tienen la estructura esperada:",
            data
          );
          setInsumos([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error al cargar insumos:", err);
        setError("Error al cargar los insumos");
        setInsumos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100dvh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #ffffffff 0%, #fafcff 100%)",
      }}
    >
      {showForm ? (
        <InsumoForm onClose={() => setShowForm(false)} />
      ) : (
        <>
          {/* Encabezado y botón agregar */}
          <div className="d-flex justify-content-between align-items-center mb-4 mt-3 px-4">
            <h1
              className="fs-4 fw-bold mb-0 text-primary"
              style={{ letterSpacing: 1 }}
            >
              Gestión de Insumos
            </h1>
            <button
              className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
              onClick={() => setShowForm(true)}
            >
              <FaPlusCircle size={22} />
              Agregar Insumo
            </button>
          </div>

          {/* Mostrar error si existe */}
          {error && (
            <div className="alert alert-danger mx-4" role="alert">
              {error}
            </div>
          )}

          {/* Tabla */}
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
                    <th style={{ borderTopLeftRadius: 16 }}>Nombre Insumo</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th style={{ borderTopRightRadius: 16 }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {insumos.length > 0 ? (
                    insumos.map((insumo, index) => (
                      <tr
                        key={insumo.InsumoID || index}
                        style={{ borderBottom: "1px solid #e3e8ee" }}
                      >
                        <td className="fw-medium">
                          {insumo.Nombre || "Sin nombre"}
                        </td>
                        <td>{insumo.Stock || 0}</td>
                        <td>
                          <span
                            className={`badge fw-bold fs-6 px-1 py-2 shadow-sm ${
                              insumo.Estado === true
                                ? "text-success"
                                : "text-danger"
                            }`}
                            style={{ fontSize: 14 }}
                          >
                            {insumo.Estado === true ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-outline-primary btn-sm rounded-circle"
                              title="Ver"
                            >
                              <FaEye size={16} />
                            </button>
                            <button
                              className="btn btn-outline-warning btn-sm rounded-circle"
                              title="Editar"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm rounded-circle"
                              title="Eliminar"
                            >
                              <FaTrash size={16} />
                            </button>
                            <button
                              className="btn btn-outline-secondary btn-sm rounded-circle"
                              title="Cambiar estado"
                            >
                              <FaSync size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No hay insumos disponibles
                      </td>
                    </tr>
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

export default Insumos;