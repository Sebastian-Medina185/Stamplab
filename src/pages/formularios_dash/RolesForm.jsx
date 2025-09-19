import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const RolesForm = ({ onClose, onSave, rolEdit }) => {
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    estado: "Activo",
  });

  useEffect(() => {
    if (rolEdit) {
      setFormData(rolEdit); // precargar datos si se está editando
    }
  }, [rolEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      alert("Todos los campos son obligatorios");
      return;
    }

    // Si es creación y no tiene id, generamos uno nuevo
    const rolFinal = {
      ...formData,
      id: formData.id || Date.now(),
    };

    onSave(rolFinal);
    onClose();
  };

  return (
    <div className="container py-4">
      <div className="position-relative mb-4 text-center">
        <p className="fw-bold fs-3 mb-0">
          {rolEdit ? "Editar Rol" : "Crear Rol"}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-danger btn-sm shadow-sm position-absolute top-0 end-0"
          title="Cerrar"
        >
          <FaTimes />
        </button>
      </div>

      <form
        className="p-4 rounded shadow"
        style={{ backgroundColor: "#f5f5fa", color: "#2a273a" }}
        onSubmit={handleSubmit}
      >
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">ID Rol:</label>
            <input
              type="text"
              className="form-control"
              name="id"
              value={formData.id}
              onChange={handleChange}
              maxLength="5"
              disabled={!!rolEdit} // si está editando, no permitir cambiar ID
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Nombre:</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-5">
            <label className="form-label">Descripción:</label>
            <input
              type="text"
              className="form-control"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Estado:</label>
            <select
              className="form-select"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="text-end mt-4">
          <button type="submit" className="btn btn-primary shadow-sm">
            {rolEdit ? "Guardar Cambios" : "Crear Rol"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RolesForm;
