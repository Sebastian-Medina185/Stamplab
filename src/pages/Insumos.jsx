import { useEffect, useState } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash, FaSync } from "react-icons/fa";
import InsumoForm from "./formularios_dash/InsumoForm";
import {
  getInsumos,
  createInsumo,
  updateInsumo,
  deleteInsumo,
  cambiarEstadoInsumo,
} from "../Services/api-insumos/insumos";
import Swal from "sweetalert2";

const Insumos = () => {
  const [showForm, setShowForm] = useState(false);
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insumoEdit, setInsumoEdit] = useState(null);
  const [search, setSearch] = useState("");

  // Cargar insumos al montar el componente
  useEffect(() => {
    loadInsumos();
  }, []);

  // Función para cargar todos los insumos
  const loadInsumos = async () => {
    try {
      setLoading(true);
      const response = await getInsumos();
      if (response.estado) {
        setInsumos(response.datos);
        setError(null);
      } else {
        setError(response.mensaje);
      }
    } catch (err) {
      setError("Error al cargar los insumos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para guardar insumo (crear o actualizar)
  const handleSave = async (insumoData) => {
    try {
      setLoading(true);
      if (insumoEdit) {
        // Actualizar
        await updateInsumo(insumoEdit.InsumoID, insumoData);
        Swal.fire("¡Éxito!", "Insumo actualizado correctamente", "success");
      } else {
        // Crear nuevo
        await createInsumo(insumoData);
        Swal.fire("¡Éxito!", "Insumo creado correctamente", "success");
      }
      setShowForm(false);
      await loadInsumos();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.mensaje || "Error al procesar el insumo",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar insumo
  const handleEliminar = async (insumoID) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede revertir",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        setLoading(true);
        await deleteInsumo(insumoID);
        await loadInsumos();
        Swal.fire("¡Eliminado!", "El insumo ha sido eliminado.", "success");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Error",
        error.response?.data?.mensaje || "Error al eliminar el insumo",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar estado
  const handleCambiarEstado = async (insumo) => {
    try {
      setLoading(true);
      await cambiarEstadoInsumo(insumo.InsumoID, !insumo.Estado);
      await loadInsumos();
      Swal.fire("¡Éxito!", "Estado actualizado correctamente", "success");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Error al cambiar el estado", "error");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar insumos según búsqueda
  const filtered = insumos.filter((insumo) =>
    insumo.Nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Renderizado condicional del formulario
  if (showForm) {
    return (
      <InsumoForm
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        insumoEdit={insumoEdit}
      />
    );
  }

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
        padding: "20px 30px",
        fontSize: "0.9rem",
      }}
    >
      {/* Encabezado y botón agregar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1
          className="fs-5 fw-bold mb-0 text-primary"
          style={{ letterSpacing: 1 }}
        >
          Gestión de Insumos
        </h1>
        <button
          className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={() => {
            setInsumoEdit(null);
            setShowForm(true);
          }}
        >
          <FaPlusCircle size={18} />
          Agregar Insumo
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex justify-content-end mb-3">
        <div className="input-group input-group-sm" style={{ maxWidth: 260 }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Buscar insumo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="flex-grow-1" style={{ overflow: "auto", minHeight: 0 }}>
        <div
          className="table-responsive rounded-4 shadow-sm"
          style={{ background: "#fff" }}
        >
          <table className="table table-sm align-middle mb-0">
            <thead
              style={{
                background:
                  "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                color: "#fff",
                fontSize: "0.85rem",
              }}
            >
              <tr>
                <th style={{ borderTopLeftRadius: 12 }}>Nombre</th>
                <th>Stock</th>
                <th>Estado</th>
                <th style={{ width: 160 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-muted">
                    No hay insumos para mostrar.
                  </td>
                </tr>
              )}
              {filtered.map((insumo) => (
                <tr
                  key={insumo.InsumoID}
                  style={{ borderBottom: "1px solid #e3e8ee" }}
                >
                  <td className="fw-medium">{insumo.Nombre}</td>
                  <td>{insumo.Stock}</td>
                  <td>
                    <span
                      className={`badge px-3 py-2 shadow-sm ${insumo.Estado
                          ? "text-success fw-bold fs-6"
                          : "text-secondary fw-bold fs-6"
                        }`}
                    >
                      {insumo.Estado ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-circle"
                        title="Ver"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        className="btn btn-outline-warning btn-sm rounded-circle"
                        title="Editar"
                        onClick={() => {
                          setInsumoEdit(insumo);
                          setShowForm(true);
                        }}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm rounded-circle"
                        title="Eliminar"
                        onClick={() => handleEliminar(insumo.InsumoID)}
                      >
                        <FaTrash size={14} />
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm rounded-circle"
                        title="Cambiar estado"
                        onClick={() => handleCambiarEstado(insumo)}
                      >
                        <FaSync size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Insumos;