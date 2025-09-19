import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const RolesForm = ({ onClose, onSave, rolEdit = null }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: true, // Cambiar a booleano
  });

  // Cargar datos del rol si estamos editando
  useEffect(() => {
    if (rolEdit) {
      setFormData({
        nombre: rolEdit.Nombre || "",
        descripcion: rolEdit.Descripcion || "",
        estado: rolEdit.Estado !== undefined ? rolEdit.Estado : true, // Manejar booleano
      });
    } else {
      // Limpiar formulario si es crear nuevo
      setFormData({
        nombre: "",
        descripcion: "",
        estado: true, // Booleano
      });
    }
  }, [rolEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estado' ? value === 'true' : value, // Convertir string a booleano para estado
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.nombre.trim()) {
      alert("El nombre del rol es obligatorio");
      return;
    }

    if (!formData.descripcion.trim()) {
      alert("La descripción del rol es obligatoria");
      return;
    }

    // Preparar datos para enviar
    const rolData = {
      ...formData,
      // Si estamos editando, incluir el ID
      ...(rolEdit && { RolID: rolEdit.RolID })
    };

    // Llamar a la función onSave del componente padre
    onSave(rolData);
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
          {/* Nombre del rol */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              Nombre del Rol <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre del rol"
              maxLength="50"
              required
            />
          </div>

          {/* Descripción */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              Descripción <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describa las funciones y permisos del rol"
              rows="4"
              maxLength="255"
              required
            />
          </div>

          {/* Estado */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Estado</label>
            <select
              className="form-select"
              name="estado"
              value={formData.estado.toString()} // Convertir booleano a string para el select
              onChange={handleChange}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 rounded" style={{ backgroundColor: "#e9e6f3" }}>
          <h6 className="text-dark mb-3">ℹ️ Información importante:</h6>
          <ul className="mb-0 text-muted small">
            <li>Todos los campos marcados con (*) son obligatorios</li>
            <li>El nombre del rol debe ser único en el sistema</li>
            <li>Los roles inactivos no estarán disponibles para asignar a usuarios</li>
            <li>Una vez creado, podrás modificar el rol en cualquier momento</li>
          </ul>
        </div>

        {/* Botones */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button type="submit" className="btn btn-success px-4">
            {rolEdit ? "Actualizar Rol" : "Crear Rol"}
          </button>
          <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RolesForm;