import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const TecnicasForm = ({ onClose, onSave, tecnicaEdit = null }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagenTecnica: "",
    estado: true,
  });

  // Cargar datos de la técnica si estamos editando
  useEffect(() => {
    if (tecnicaEdit) {
      setFormData({
        nombre: tecnicaEdit.Nombre || "",
        descripcion: tecnicaEdit.Descripcion || "",
        imagenTecnica: tecnicaEdit.ImagenTecnica || "",
        estado: tecnicaEdit.Estado !== undefined ? tecnicaEdit.Estado : true,
      });
    } else {
      // Limpiar formulario si es crear nuevo
      setFormData({
        nombre: "",
        descripcion: "",
        imagenTecnica: "",
        estado: true,
      });
    }
  }, [tecnicaEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'estado' ? value === 'true' : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      alert("El nombre de la técnica es obligatorio");
      return;
    }

    if (!formData.descripcion.trim()) {
      alert("La descripción de la técnica es obligatoria");
      return;
    }

    // Preparar datos para enviar
    const tecnicaData = {
      Nombre: formData.nombre,
      Descripcion: formData.descripcion,
      ImagenTecnica: formData.imagenTecnica,
      Estado: formData.estado,
      ...(tecnicaEdit && { TecnicaID: tecnicaEdit.TecnicaID })
    };

    // Llamar a la función onSave del componente padre
    onSave(tecnicaData);
  };

  return (
    <div className="container py-4">
      <div className="position-relative mb-4 text-center">
        <p className="fw-bold fs-3 mb-0">
          {tecnicaEdit ? "Editar Técnica" : "Crear Técnica"}
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
          {/* Nombre de la técnica */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              Nombre de la Técnica <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre de la técnica"
              maxLength="20"
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
              placeholder="Describa la técnica de estampado"
              rows="4"
              maxLength="255"
              required
            />
          </div>

          {/* Imagen de la técnica */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              URL de la Imagen
            </label>
            <input
              type="text"
              className="form-control"
              name="imagenTecnica"
              value={formData.imagenTecnica}
              onChange={handleChange}
              placeholder="Ingrese la URL de la imagen"
              maxLength="255"
            />
          </div>

          {/* Estado */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Estado</label>
            <select
              className="form-select"
              name="estado"
              value={formData.estado.toString()}
              onChange={handleChange}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Información adicional
        <div className="mt-4 p-3 rounded" style={{ backgroundColor: "#e9e6f3" }}>
          <h6 className="text-dark mb-3">Información importante:</h6>
          <ul className="mb-0 text-muted small">
            <li>Todos los campos marcados con (*) son obligatorios</li>
            <li>El nombre de la técnica debe ser único en el sistema</li>
            <li>Las técnicas inactivas no estarán disponibles para las cotizaciones</li>
            <li>La URL de la imagen es opcional</li>
          </ul>
        </div> */}

        {/* Botones */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button type="submit" className="btn btn-success px-4">
            {tecnicaEdit ? "Actualizar Técnica" : "Crear Técnica"}
          </button>
          <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TecnicasForm;