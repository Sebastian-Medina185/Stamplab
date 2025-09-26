import { useState, useEffect } from "react";
import { FaPlusCircle, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  getTallas,
  createTalla,
  updateTalla,
  deleteTalla,
  getTallaById,
} from "../Services/api-tallas/tallas";

const Tallas = () => {
  const [search, setSearch] = useState("");
  const [tallas, setTallas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para crear/editar
  const [nuevaTalla, setNuevaTalla] = useState({ Nombre: "" });
  const [editando, setEditando] = useState(null);
  const [mostrarFormCrear, setMostrarFormCrear] = useState(false);

  // =================== LISTAR ===================
  const cargarTallas = async () => {
    try {
      setLoading(true);
      const data = await getTallas();
      setTallas(data.datos ?? data);
    } catch (err) {
      console.error("Error cargando tallas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTallas();
  }, []);

  // =================== CREAR ===================
  const handleCrear = async () => {
    try {
      await createTalla({ Nombre: nuevaTalla.Nombre }); 
      setNuevaTalla({ Nombre: "" });
      setMostrarFormCrear(false);
      cargarTallas();
    } catch (err) {
      console.error("Error guardando talla:", err);
    }
  };

  // =================== EDITAR ===================
  const handleEditar = async () => {
    try {
      await updateTalla(editando.TallaID, { Nombre: editando.Nombre });
      setEditando(null);
      cargarTallas();
    } catch (err) {
      console.error("Error editando talla:", err);
    }
  };

  // =================== ELIMINAR ===================
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta talla?")) return;
    try {
      await deleteTalla(id);
      cargarTallas();
    } catch (err) {
      console.error("Error eliminando talla:", err);
    }
  };

  // =================== VER DETALLE ===================
  const handleVer = async (id) => {
    try {
      const data = await getTallaById(id);
      alert(
        `Detalles:\n\nID: ${data.datos?.TallaID ?? data.TallaID}\nNombre: ${
          data.datos?.Nombre ?? data.Nombre
        }`
      );
    } catch (err) {
      console.error("Error obteniendo talla:", err);
    }
  };

  // =================== FILTRAR ===================
  const filtered = tallas.filter((t) =>
    t.Nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #ffffffff 0%, #fafcff 100%)",
      }}
    >
      {/* Encabezado y botón agregar */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-3 px-4">
        <h1 className="fs-4 fw-bold mb-0 text-primary" style={{ letterSpacing: 1 }}>
          Gestión de Tallas
        </h1>
        <button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={() => setMostrarFormCrear(!mostrarFormCrear)}
        >
          <FaPlusCircle size={22} />
          {mostrarFormCrear ? "Cancelar" : "Agregar Talla"}
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex justify-content-end mb-3 px-4">
        <div className="input-group" style={{ maxWidth: 300 }}>
          <span className="input-group-text bg-white border-end-0">🔍</span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Filtrar por tallas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="flex-grow-1 px-4 pb-4" style={{ overflow: "auto", minHeight: 0 }}>
        <div className="table-responsive rounded-4 shadow" style={{ background: "#fff" }}>
          <table className="table align-middle mb-0">
            <thead
              style={{
                background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                color: "#fff",
              }}
            >
              <tr>
                <th style={{ width: 120, borderTopLeftRadius: 16 }}>ID Talla</th>
                <th>Nombre</th>
                <th style={{ width: 180 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    Cargando...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-muted">
                    No hay tallas para mostrar.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.TallaID} style={{ borderBottom: "1px solid #e3e8ee" }}>
                    <td>
                      <span
                        className="badge bg-light text-dark px-3 py-2 shadow-sm"
                        style={{ fontSize: 15 }}
                      >
                        {t.TallaID}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: 16 }}>{t.Nombre}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-circle"
                          title="Ver"
                          onClick={() => handleVer(t.TallaID)}
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          className="btn btn-outline-warning btn-sm rounded-circle"
                          title="Editar"
                          onClick={() => setEditando(t)}
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-circle"
                          title="Eliminar"
                          onClick={() => handleEliminar(t.TallaID)}
                        >
                          <FaTrash size={16} />
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

      {/* Formulario Crear/Editar */}
      <div className="p-4">
        {editando ? (
          <div className="card card-body shadow-sm">
            <h5>Editar Talla</h5>
            <input
              type="text"
              className="form-control mb-2"
              value={editando.Nombre}
              onChange={(e) => setEditando({ ...editando, Nombre: e.target.value })}
            />
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={handleEditar}>
                Guardar cambios
              </button>
              <button className="btn btn-secondary" onClick={() => setEditando(null)}>
                Cancelar
              </button>
            </div>
          </div>
        ) : mostrarFormCrear ? (
          <div className="card card-body shadow-sm">
            <h5>Agregar Nueva Talla</h5>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Nombre (máx 4 caracteres)"
              value={nuevaTalla.Nombre}
              onChange={(e) => setNuevaTalla({ ...nuevaTalla, Nombre: e.target.value })}
            />
            <button className="btn btn-primary" onClick={handleCrear}>
              Guardar
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Tallas;