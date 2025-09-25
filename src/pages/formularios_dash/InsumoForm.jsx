import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const InsumoForm = ({ onClose, onSave, insumoEdit = null }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        stock: "",  // Cambiado de 0 a string vacío
        estado: true,
    });

    // Cargar datos del insumo si estamos editando
    useEffect(() => {
        if (insumoEdit) {
            setFormData({
                nombre: insumoEdit.Nombre || "",
                stock: insumoEdit.Stock?.toString() || "", // Convertir a string
                estado: insumoEdit.Estado !== undefined ? insumoEdit.Estado : true,
            });
        } else {
            // Limpiar formulario si es crear nuevo
            setFormData({
                nombre: "",
                stock: "",  // Cambiado de 0 a string vacío
                estado: true,
            });
        }
    }, [insumoEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'estado' 
                ? value === 'true'
                : value, // Ya no necesitamos la conversión parseInt aquí
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!formData.nombre.trim()) {
            alert("El nombre del insumo es obligatorio");
            return;
        }

        // Preparar datos para enviar
        const insumoData = {
            Nombre: formData.nombre,
            Stock: formData.stock === "" ? 0 : parseInt(formData.stock), // Convertir a número al enviar
            Estado: formData.estado,
            ...(insumoEdit && { InsumoID: insumoEdit.InsumoID })
        };

        // Llamar a la función onSave del componente padre
        onSave(insumoData);
    };

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
                            className="form-control"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Ingrese el nombre del insumo"
                            maxLength="50"
                            required
                        />
                    </div>

                    {/* Stock */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold">
                            Stock <span className="text-danger">*</span>
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            placeholder="Cantidad disponible"
                            required
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

                {/* Información adicional */}
                <div className="mt-4 p-3 rounded" style={{ backgroundColor: "#e9e6f3" }}>
                    <h6 className="text-dark mb-3">ℹ️ Información importante:</h6>
                    <ul className="mb-0 text-muted small">
                        <li>Todos los campos marcados con (*) son obligatorios</li>
                        <li>El nombre del insumo debe ser único en el sistema</li>
                        <li>El stock no puede ser negativo</li>
                        <li>Los insumos inactivos no estarán disponibles para las cotizaciones</li>
                    </ul>
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <button type="submit" className="btn btn-success px-4">
                        {insumoEdit ? "Actualizar Insumo" : "Crear Insumo"}
                    </button>
                    <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InsumoForm;