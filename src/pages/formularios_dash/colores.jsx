// src/pages/formularios_dash/coloresForm.jsx
import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { createColor, updateColor } from "../../Services/api-colores/colores";

const ColoresForm = ({ onClose, onSave, color = null }) => {
    const [formData, setFormData] = useState({
        ColorID: "",
        Nombre: "",
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Si hay un color para editar, cargar sus datos
    useEffect(() => {
        if (color) {
            setFormData({
                ColorID: color.ColorID || "",
                Nombre: color.Nombre || "",
            });
        }
    }, [color]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: "",
            });
        }
    };

    // Validaciones
    const validateForm = () => {
        const newErrors = {};

        if (!formData.ColorID.trim()) {
            newErrors.ColorID = "El ID es requerido";
        } else if (formData.ColorID.length > 5) {
            newErrors.ColorID = "El ID no puede tener más de 5 caracteres";
        }

        if (!formData.Nombre.trim()) {
            newErrors.Nombre = "El nombre es requerido";
        } else if (formData.Nombre.length > 50) {
            newErrors.Nombre = "El nombre no puede tener más de 50 caracteres";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            let result;

            if (color) {
                // Actualizar color
                result = await updateColor(formData);
            } else {
                // Crear color
                result = await createColor(formData);
            }

            if (result.estado) {
                alert(color ? "Color actualizado correctamente" : "Color creado correctamente");
                onSave(result.datos);
            } else {
                alert("Error: " + result.mensaje);
            }
        } catch (error) {
            console.error("Error al guardar color:", error);
            if (error.response && error.response.data) {
                alert("Error: " + error.response.data.mensaje);
            } else {
                alert("Error de conexión. Intente nuevamente.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">
            {/* Título */}
            <div className="position-relative mb-4 text-center">
                <p className="fw-bold fs-3 mb-0">
                    {color ? "Editar Color" : "Nuevo Color"}
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-danger btn-sm shadow-sm position-absolute top-0 end-0"
                    title="Cerrar"
                    disabled={loading}
                >
                    <FaTimes />
                </button>
            </div>

            {/* Formulario */}
            <form
                className="p-4 rounded shadow"
                style={{ backgroundColor: "#f5f5fa", color: "#2a273a" }}
                onSubmit={handleSubmit}
            >
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">ID del Color:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.ColorID ? "is-invalid" : ""}`}
                            name="ColorID"
                            value={formData.ColorID}
                            onChange={handleChange}
                            disabled={loading || !!color} // Desactivar si es edición
                            maxLength={5}
                            required
                        />
                        {errors.ColorID && (
                            <div className="invalid-feedback">{errors.ColorID}</div>
                        )}
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Nombre del Color:</label>
                        <input
                            type="text"
                            className={`form-control ${errors.Nombre ? "is-invalid" : ""}`}
                            name="Nombre"
                            value={formData.Nombre}
                            onChange={handleChange}
                            disabled={loading}
                            maxLength={50}
                            required
                        />
                        {errors.Nombre && (
                            <div className="invalid-feedback">{errors.Nombre}</div>
                        )}
                    </div>
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <button
                        type="submit"
                        className="btn btn-success px-4"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                ></span>
                                {color ? "Actualizando..." : "Guardando..."}
                            </>
                        ) : (
                            color ? "Actualizar Color" : "Guardar Color"
                        )}
                    </button>

                    <button
                        type="button"
                        className="btn btn-danger px-4"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ColoresForm;
