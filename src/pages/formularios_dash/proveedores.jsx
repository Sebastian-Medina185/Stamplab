import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const ProveedoresForm = ({ onClose, proveedor = null }) => {
    const [formData, setFormData] = useState({
        nit: proveedor?.nit || "",
        nombre: proveedor?.nombre || "",
        correo: proveedor?.correo || "",
        telefono: proveedor?.telefono || "",
        direccion: proveedor?.direccion || "",
        estado: proveedor?.estado || "Activo"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría la lógica para guardar el proveedor
        console.log("Datos del proveedor:", formData);
        onClose();
    };

    return (
        <>
            <div className="container py-4">
                {/* Título */}
                <div className="position-relative mb-4 text-center">
                    <p className="fw-bold fs-3 mb-0">
                        {proveedor ? "Editar Proveedor" : "Formulario de Proveedor"}
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

                {/* Formulario */}
                <form
                    className="p-4 rounded shadow"
                    style={{ backgroundColor: "#f5f5fa", color: "#2a273a" }}
                    onSubmit={handleSubmit}
                >
                    <div className="row g-3">
                        {/* NIT */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">
                                NIT <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="nit"
                                value={formData.nit}
                                onChange={handleChange}
                                placeholder="Ingrese el NIT del proveedor"
                                required
                            />
                        </div>

                        {/* Nombre */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">
                                Nombre <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Nombre del proveedor"
                                required
                            />
                        </div>

                        {/* Correo */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">
                                Correo Electrónico <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">
                                Teléfono <span className="text-danger">*</span>
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Número de teléfono"
                                required
                            />
                        </div>

                        {/* Dirección */}
                        <div className="col-12">
                            <label className="form-label fw-bold">
                                Dirección <span className="text-danger">*</span>
                            </label>
                            <textarea
                                className="form-control"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Dirección completa del proveedor"
                                required
                            ></textarea>
                        </div>

                        {/* Estado */}
                        <div className="col-md-6">
                            <label className="form-label fw-bold">Estado</label>
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

                    {/* Información adicional */}
                    <div className="mt-4 p-3 rounded" style={{ backgroundColor: "#e9e6f3" }}>
                        <h6 className="text-dark mb-3">ℹ️ Información importante:</h6>
                        <ul className="mb-0 text-muted small">
                            <li>Todos los campos marcados con (*) son obligatorios</li>
                            <li>El NIT debe ser único para cada proveedor</li>
                            <li>Verifique que el correo electrónico sea válido</li>
                            <li>Los proveedores inactivos no aparecerán en las cotizaciones</li>
                        </ul>
                    </div>

                    {/* Botones */}
                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <button type="submit" className="btn btn-success px-4">
                            {proveedor ? "Actualizar Proveedor" : "Guardar Proveedor"}
                        </button>
                        <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProveedoresForm;