import { useState, useEffect } from "react";

const TecnicasForm = ({ onClose, onSave, tecnicaEdit = null }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    imagenTecnica: "",
    estado: true,
  });

  const [errors, setErrors] = useState({
    nombre: "",
    descripcion: "",
    imagenTecnica: "",
  });

  const [touched, setTouched] = useState({
    nombre: false,
    descripcion: false,
    imagenTecnica: false,
  });

  useEffect(() => {
    if (tecnicaEdit) {
      setFormData({
        nombre: tecnicaEdit.Nombre || "",
        descripcion: tecnicaEdit.Descripcion || "",
        imagenTecnica: tecnicaEdit.imagenTecnica || "",
        estado: tecnicaEdit.Estado !== undefined ? tecnicaEdit.Estado : true,
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        imagenTecnica: "",
        estado: true,
      });
    }
  }, [tecnicaEdit]);

  // ================= VALIDACIONES =================
  const validarNombre = (valor) => {
    if (!valor.trim()) return "El nombre es obligatorio.";
    return "";
  };

  const validarDescripcion = (valor) => {
    if (!valor.trim()) return "La descripción es obligatoria.";
    return "";
  };

  const validarImagen = (valor) => {
    if (!valor.trim()) return "La imagen es obligatoria.";
    return "";
  };

  // ================= EVENTOS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estado" ? value === "true" : value,
    }));
    if (touched[name]) validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let error = "";
    switch (fieldName) {
      case "nombre":
        error = validarNombre(value);
        break;
      case "descripcion":
        error = validarDescripcion(value);
        break;
      case "imagenTecnica":
        error = validarImagen(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateForm = () => {
    const nombreError = validarNombre(formData.nombre);
    const descripcionError = validarDescripcion(formData.descripcion);
    const imagenError = validarImagen(formData.imagenTecnica);

    setErrors({ nombre: nombreError, descripcion: descripcionError, imagenTecnica: imagenError });
    setTouched({ nombre: true, descripcion: true, imagenTecnica: true });

    return !nombreError && !descripcionError && !imagenError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const tecnicaData = {
      Nombre: formData.nombre.trim(),
      Descripcion: formData.descripcion.trim(),
      imagenTecnica: formData.imagenTecnica.trim(), // <- CORRECTO
      Estado: formData.estado,
    };

    onSave(tecnicaData);
  };

  // ================= INTERFAZ =================
  return (
    <div className="container py-4">
      <div className="position-relative mb-4 text-center">
        <p className="fw-bold fs-3 mb-0">{tecnicaEdit ? "Editar Técnica" : "Crear Técnica"}</p>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-danger btn-sm shadow-sm position-absolute top-0 end-0"
          title="Cerrar"
        >
          ✕
        </button>
      </div>

      <form className="p-4 rounded shadow" style={{ backgroundColor: "#f5f5fa" }} onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* NOMBRE */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              Nombre de la Técnica <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${touched.nombre && errors.nombre ? "is-invalid" : ""}`}
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ingrese el nombre de la técnica"
            />
            {touched.nombre && errors.nombre && <div className="invalid-feedback d-block">{errors.nombre}</div>}
          </div>

          {/* DESCRIPCIÓN */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              Descripción <span className="text-danger">*</span>
            </label>
            <textarea
              className={`form-control ${touched.descripcion && errors.descripcion ? "is-invalid" : ""}`}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describa la técnica de estampado"
              rows="4"
            />
            {touched.descripcion && errors.descripcion && (
              <div className="invalid-feedback d-block">{errors.descripcion}</div>
            )}
          </div>

          {/* IMAGEN */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              URL o Ruta de la Imagen <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${touched.imagenTecnica && errors.imagenTecnica ? "is-invalid" : ""}`}
              name="imagenTecnica"
              value={formData.imagenTecnica}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="https://ejemplo.com/imagen.png o imagenes/imagen.png"
            />
            {touched.imagenTecnica && errors.imagenTecnica && (
              <div className="invalid-feedback d-block">{errors.imagenTecnica}</div>
            )}
          </div>

          {/* ESTADO */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Estado</label>
            <select className="form-select" name="estado" value={formData.estado.toString()} onChange={handleChange}>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>

        {/* BOTONES */}
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
