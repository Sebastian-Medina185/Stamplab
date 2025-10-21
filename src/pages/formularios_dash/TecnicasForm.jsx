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
        imagenTecnica: tecnicaEdit.ImagenTecnica || "",
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
    const nombre = valor.trim();

    if (!nombre) {
      return "El nombre es obligatorio y no puede estar vacío.";
    }
    if (nombre.length < 4) {
      return "El nombre debe tener al menos 4 caracteres.";
    }
    if (nombre.length > 20) {
      return "El nombre no puede tener más de 20 caracteres.";
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(nombre)) {
      return "El nombre solo puede contener letras y espacios (sin números ni caracteres especiales).";
    }

    return "";
  };

  const validarDescripcion = (valor) => {
    const descripcion = valor.trim();

    if (!descripcion) {
      return "La descripción es obligatoria y no puede estar vacía.";
    }
    if (descripcion.length < 10) {
      return "La descripción debe tener al menos 10 caracteres.";
    }
    if (descripcion.length > 255) {
      return "La descripción no puede tener más de 255 caracteres.";
    }
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/.test(descripcion)) {
      return "La descripción solo puede contener letras, números y espacios (sin caracteres especiales).";
    }

    return "";
  };

  const validarImagen = (valor) => {
    const imagen = valor.trim();

    if (!imagen) {
      return "La imagen es obligatoria y no puede estar vacía.";
    }
    if (imagen.length > 255) {
      return "La URL o ruta de la imagen no puede tener más de 255 caracteres.";
    }

    // Permitir tanto URLs como rutas locales con extensión de imagen
    const urlRegex = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-./]*)*\.(jpg|jpeg|png|gif|webp|svg)$/i;
    const rutaLocalRegex = /^[\w\-./]+\.(jpg|jpeg|png|gif|webp|svg)$/i;

    if (!urlRegex.test(imagen) && !rutaLocalRegex.test(imagen)) {
      return "Debe ser una URL o ruta válida que termine con una extensión de imagen (.jpg, .png, etc.).";
    }

    return "";
  };

  // ================= EVENTOS =================

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estado" ? value === "true" : value,
    }));

    if (touched[name]) {
      validateField(name, value);
    }
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

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));

    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    validateField(name, value);
  };

  const validateForm = () => {
    const nombreError = validarNombre(formData.nombre);
    const descripcionError = validarDescripcion(formData.descripcion);
    const imagenError = validarImagen(formData.imagenTecnica);

    setErrors({
      nombre: nombreError,
      descripcion: descripcionError,
      imagenTecnica: imagenError,
    });

    setTouched({
      nombre: true,
      descripcion: true,
      imagenTecnica: true,
    });

    return !nombreError && !descripcionError && !imagenError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const tecnicaData = {
      Nombre: formData.nombre.trim(),
      Descripcion: formData.descripcion.trim(),
      ImagenTecnica: formData.imagenTecnica.trim(),
      Estado: formData.estado,
      ...(tecnicaEdit && { TecnicaID: tecnicaEdit.TecnicaID }),
    };

    onSave(tecnicaData);
  };

  // ================= INTERFAZ =================

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
          ✕
        </button>
      </div>

      <form
        className="p-4 rounded shadow"
        style={{ backgroundColor: "#f5f5fa", color: "#2a273a" }}
        onSubmit={handleSubmit}
      >
        <div className="row g-3">
          {/* NOMBRE */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              Nombre de la Técnica <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${
                touched.nombre && errors.nombre
                  ? "is-invalid"
                  : touched.nombre && !errors.nombre && formData.nombre
                  ? "is-valid"
                  : ""
              }`}
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ingrese el nombre de la técnica"
              maxLength="20"
            />
            {touched.nombre && errors.nombre && (
              <div className="invalid-feedback d-block">{errors.nombre}</div>
            )}
            <small className="text-muted">{formData.nombre.length}/20 caracteres</small>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              Descripción <span className="text-danger">*</span>
            </label>
            <textarea
              className={`form-control ${
                touched.descripcion && errors.descripcion
                  ? "is-invalid"
                  : touched.descripcion && !errors.descripcion && formData.descripcion
                  ? "is-valid"
                  : ""
              }`}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Describa la técnica de estampado (mínimo 10 caracteres)"
              rows="4"
              maxLength="255"
            />
            {touched.descripcion && errors.descripcion && (
              <div className="invalid-feedback d-block">{errors.descripcion}</div>
            )}
            <small className="text-muted">{formData.descripcion.length}/255 caracteres</small>
          </div>

          {/* IMAGEN */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              URL o Ruta de la Imagen <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${
                touched.imagenTecnica && errors.imagenTecnica
                  ? "is-invalid"
                  : touched.imagenTecnica && !errors.imagenTecnica && formData.imagenTecnica
                  ? "is-valid"
                  : ""
              }`}
              name="imagenTecnica"
              value={formData.imagenTecnica}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="https://ejemplo.com/imagen.png o imagenes/imagen.png"
              maxLength="255"
            />
            {touched.imagenTecnica && errors.imagenTecnica && (
              <div className="invalid-feedback d-block">{errors.imagenTecnica}</div>
            )}
            <small className="text-muted d-block">
              Extensiones válidas: .jpg, .jpeg, .png, .gif, .webp, .svg
            </small>
          </div>

          {/* ESTADO */}
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

        {/* BOTONES */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button
            type="submit"
            className="btn btn-success px-4"
            disabled={
              errors.nombre || errors.descripcion || errors.imagenTecnica
            }
          >
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
