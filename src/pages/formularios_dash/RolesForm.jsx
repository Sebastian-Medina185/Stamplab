import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const RolesForm = ({ onClose, onSave, rolEdit = null, rolesExistentes = [] }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: true,
  });

  const [errores, setErrores] = useState({});
  const [esRolProtegido, setEsRolProtegido] = useState(false);

  useEffect(() => {
    if (rolEdit) {
      const nombreRol = rolEdit.Nombre || "";
      const esProtegido = nombreRol.toLowerCase() === 'administrador' || nombreRol.toLowerCase() === 'cliente';
      
      setEsRolProtegido(esProtegido);
      
      setFormData({
        nombre: nombreRol,
        descripcion: rolEdit.Descripcion || "",
        estado: rolEdit.Estado !== undefined ? rolEdit.Estado : true,
      });
    } else {
      setEsRolProtegido(false);
      setFormData({ nombre: "", descripcion: "", estado: true });
    }
  }, [rolEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevenir cambios en nombre y estado si es rol protegido
    if (esRolProtegido) {
      if (name === "nombre" || name === "estado") {
        return; // No permitir cambios
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === "estado" ? value === "true" : value,
    }));
  };

  // 🔹 Validar un campo individual al perder el foco
  const validarCampo = (name) => {
    let error = "";

    if (name === "nombre") {
      // Si es rol protegido, no validar el nombre
      if (esRolProtegido) {
        return;
      }
      
      if (!formData.nombre.trim()) {
        error = "El nombre del rol es obligatorio.";
      } else if (formData.nombre.length < 3) {
        error = "El nombre debe tener al menos 3 caracteres.";
      } else if (formData.nombre.length > 25) {
        error = "El nombre no debe superar los 25 caracteres.";
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/.test(formData.nombre)) {
        error = "El nombre solo debe contener letras sin espacios.";
      } else {
        const existe = rolesExistentes.some(
          (r) =>
            r.Nombre.toLowerCase() === formData.nombre.toLowerCase() &&
            (!rolEdit || r.RolID !== rolEdit.RolID)
        );
        if (existe) {
          error = "Ya existe un rol con este nombre.";
        }
      }
    }

    if (name === "descripcion") {
      if (!formData.descripcion.trim()) {
        error = "La descripción es obligatoria.";
      } else if (formData.descripcion.length < 20) {
        error = "Debe tener al menos 20 caracteres.";
      } else if (formData.descripcion.length > 50) {
        error = "No debe superar los 50 caracteres.";
      } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.descripcion)) {
        error = "La descripción solo puede contener letras y espacios.";
      }
    }

    setErrores((prev) => ({ ...prev, [name]: error }));
  };

  // 🔹 Validar todo el formulario al enviar
  const validarFormulario = () => {
    if (!esRolProtegido) {
      validarCampo("nombre");
    }
    validarCampo("descripcion");

    return Object.values(errores).every((err) => err === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const rolData = {
      Nombre: formData.nombre.trim(),
      Descripcion: formData.descripcion.trim(),
      Estado: formData.estado,
      ...(rolEdit && { RolID: rolEdit.RolID }),
    };

    try {
      await onSave(rolData);

      Swal.fire({
        icon: "success",
        title: rolEdit ? "Rol actualizado" : "Rol creado",
        text: rolEdit
          ? "El rol fue actualizado correctamente."
          : "El rol fue creado correctamente.",
        confirmButtonColor: "#198754",
        position: "top-end",
        toast: true,
        timer: 3000,
        showConfirmButton: false,
      });
      onClose();
    } catch (error) {
      console.error("Error al guardar el rol:", error);

      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.mensaje ||
        error.message ||
        "Rol no creado. Verifica los datos e intenta nuevamente.";

      if (errorMsg.toLowerCase().includes("ya existe")) {
        Swal.fire({
          icon: "warning",
          title: "Rol duplicado",
          text: errorMsg,
          confirmButtonColor: "#f0ad4e",
        });
      } else if (errorMsg.toLowerCase().includes("no se puede cambiar")) {
        Swal.fire({
          icon: "warning",
          title: "Rol protegido",
          text: errorMsg,
          confirmButtonColor: "#f0ad4e",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMsg,
          confirmButtonColor: "#dc3545",
        });
      }
    }
  };

  return (
    <div className="container py-4">
      <div className="position-relative mb-4 text-center">
        <p className="fw-bold fs-3 mb-0">{rolEdit ? "Editar Rol" : "Crear Rol"}</p>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-danger btn-sm shadow-sm position-absolute top-0 end-0"
          title="Cerrar"
        >
          <FaTimes />
        </button>
      </div>

      {esRolProtegido && (
        <div className="alert alert-info" role="alert">
          <strong>Rol del sistema:</strong> Solo puedes editar la descripción de "{formData.nombre}". 
          El nombre y estado no pueden modificarse.
        </div>
      )}

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
              className={`form-control ${errores.nombre ? "is-invalid" : ""} ${esRolProtegido ? "bg-light" : ""}`}
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={() => validarCampo("nombre")}
              placeholder="Ingrese el nombre del rol"
              maxLength="25"
              required
              disabled={esRolProtegido}
              readOnly={esRolProtegido}
              title={esRolProtegido ? "No se puede modificar el nombre de este rol del sistema" : ""}
            />
            {errores.nombre && (
              <div className="invalid-feedback">{errores.nombre}</div>
            )}
            {esRolProtegido && (
              <small className="text-muted">Este campo no puede ser modificado.</small>
            )}
          </div>

          {/* Descripción */}
          <div className="col-md-12">
            <label className="form-label fw-bold">
              Descripción <span className="text-danger">*</span>
            </label>
            <textarea
              className={`form-control ${errores.descripcion ? "is-invalid" : ""}`}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              onBlur={() => validarCampo("descripcion")}
              placeholder="Describa las funciones y permisos del rol"
              rows="4"
              maxLength="50"
              required
            />
            {errores.descripcion && (
              <div className="invalid-feedback">{errores.descripcion}</div>
            )}
          </div>

          {/* Estado */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Estado</label>
            <select
              className={`form-select ${esRolProtegido ? "bg-light" : ""}`}
              name="estado"
              value={formData.estado.toString()}
              onChange={handleChange}
              disabled={esRolProtegido}
              title={esRolProtegido ? "No se puede modificar el estado de este rol del sistema" : ""}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            {esRolProtegido && (
              <small className="text-muted">Este campo no puede ser modificado.</small>
            )}
          </div>
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