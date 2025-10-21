import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const InsumoForm = ({ onClose, onSave, insumoEdit = null }) => {
    // ==========================
    // 🎯 ESTADOS DEL FORMULARIO
    // ==========================
    const [formData, setFormData] = useState({
        nombre: "",
        stock: "",
        estado: true,
    });

    const [errors, setErrors] = useState({
        nombre: "",
        stock: "",
    });

    const [touched, setTouched] = useState({
        nombre: false,
        stock: false,
    });

    // ==========================
    // 🔁 CARGAR DATOS AL EDITAR
    // ==========================
    useEffect(() => {
        if (insumoEdit) {
            setFormData({
                nombre: insumoEdit.Nombre || "",
                stock: insumoEdit.Stock?.toString() || "",
                estado: insumoEdit.Estado !== undefined ? insumoEdit.Estado : true,
            });
        } else {
            setFormData({ nombre: "", stock: "", estado: true });
        }

        setErrors({ nombre: "", stock: "" });
        setTouched({ nombre: false, stock: false });
    }, [insumoEdit]);

    // ==========================
    // ✅ VALIDACIONES
    // ==========================
    const validateNombre = (value) => {
        const nombre = value.trim();

        if (!nombre) return "El nombre es obligatorio";
        if (nombre.length < 4) return "El nombre debe tener al menos 4 caracteres";
        if (nombre.length > 50) return "El nombre no puede exceder 50 caracteres";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_]+$/.test(nombre))
            return "Solo se permiten letras, números, espacios, guiones y guiones bajos";
        if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(nombre))
            return "No se permiten numeros, solo letras."
            // return "El nombre debe contener al menos una letra";

        return "";
    };

    const validateStock = (value) => {
        if (value === "" || value === null) return "El stock es obligatorio";

        const stockNum = Number(value);
        if (isNaN(stockNum)) return "El stock debe ser un número válido";
        if (!Number.isInteger(stockNum)) return "El stock debe ser un número entero";
        if (stockNum < 0) return "El stock no puede ser negativo";

        return "";
    };

    // ==========================
    // ✍️ MANEJADORES DE EVENTOS
    // ==========================
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === "estado" ? value === "true" : value;

        setFormData((prev) => ({ ...prev, [name]: newValue }));

        // Validar en tiempo real si ya fue tocado
        if (touched[name]) {
            const error =
                name === "nombre" ? validateNombre(value) : validateStock(value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        const error =
            name === "nombre" ? validateNombre(value) : validateStock(value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validar todos los campos antes de enviar
        const nombreError = validateNombre(formData.nombre);
        const stockError = validateStock(formData.stock);

        setErrors({ nombre: nombreError, stock: stockError });
        setTouched({ nombre: true, stock: true });

        if (nombreError || stockError) return;

        // Preparar datos para guardar
        const insumoData = {
            Nombre: formData.nombre.trim(),
            Stock: formData.stock === "" ? 0 : parseInt(formData.stock),
            Estado: formData.estado,
            ...(insumoEdit && { InsumoID: insumoEdit.InsumoID }),
        };

        onSave(insumoData);
    };

    // ==========================
    // 🧱 INTERFAZ DEL FORMULARIO
    // ==========================
    return (
        <div className="container py-4">
            <div className="position-relative mb-4 text-center">
                <p className="fw-bold fs-3 mb-0">
                    {insumoEdit ? "Editar Insumo" : "Crear Insumo"}
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
                    {/* Nombre del insumo */}
                    <div className="col-md-12">
                        <label className="form-label fw-bold">
                            Nombre del Insumo <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Ingrese el nombre del insumo"
                            maxLength="50"
                            className={`form-control ${
                                touched.nombre && errors.nombre
                                    ? "is-invalid"
                                    : touched.nombre && !errors.nombre
                                    ? "is-valid"
                                    : ""
                            }`}
                        />
                        {touched.nombre && errors.nombre && (
                            <div className="invalid-feedback d-block">
                                {errors.nombre}
                            </div>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold">
                            Stock <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="Cantidad disponible"
                            min="0"
                            step="1"
                            className={`form-control ${
                                touched.stock && errors.stock
                                    ? "is-invalid"
                                    : touched.stock && !errors.stock
                                    ? "is-valid"
                                    : ""
                            }`}
                        />
                        {touched.stock && errors.stock && (
                            <div className="invalid-feedback d-block">
                                {errors.stock}
                            </div>
                        )}
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
                        {formData.stock === "0" && (
                            <small className="text-muted">
                                * Si el stock es 0, el estado será inactivo automáticamente
                            </small>
                        )}
                    </div>
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <button
                        type="submit"
                        className="btn btn-success px-4"
                        disabled={!!errors.nombre || !!errors.stock}
                    >
                        {insumoEdit ? "Actualizar Insumo" : "Crear Insumo"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary px-4"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InsumoForm;
