import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { createProveedor, updateProveedor } from "../../Services/api-proveedores/proveedores";

const ProveedoresForm = ({ onClose, proveedor = null }) => {
    const [formData, setFormData] = useState({
        nit: proveedor?.Nit || proveedor?.nit || "",
        nombre: proveedor?.Nombre || proveedor?.nombre || "",
        correo: proveedor?.Correo || proveedor?.correo || "",
        telefono: proveedor?.Telefono || proveedor?.telefono || "",
        direccion: proveedor?.Direccion || proveedor?.direccion || "",
        estado: proveedor?.Estado === true || proveedor?.Estado === "Activo" || proveedor?.estado === "Activo" ? "Activo" : "Inactivo"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setLoading(true);
        
        try {
            // Transformar los datos al formato que espera el backend
            const dataToSend = {
                Nit: formData.nit,
                Nombre: formData.nombre,
                Correo: formData.correo,
                Telefono: formData.telefono,
                Direccion: formData.direccion,
                Estado: formData.estado === "Activo" ? true : false
            };

            let response;
            
            if (proveedor) {
                // Editando proveedor existente - usar el NIT original
                const nitOriginal = proveedor.Nit || proveedor.nit;
                response = await updateProveedor(nitOriginal, dataToSend);
            } else {
                // Creando nuevo proveedor
                response = await createProveedor(dataToSend);
            }
            
            if (response.estado) {
                console.log(proveedor ? "Proveedor actualizado:" : "Proveedor creado:", response.datos);
                // Cerrar formulario y notificar que hubo cambios
                onClose(true);
            } else {
                alert('Error: ' + response.mensaje);
            }
            
        } catch (error) {
            console.error("Error al guardar proveedor:", error);
            console.error("Error response data:", error.response?.data);
            console.error("Datos enviados:", formData);
            
            if (error.response && error.response.data && error.response.data.mensaje) {
                alert('Error: ' + error.response.data.mensaje);
            } else if (error.response && error.response.data) {
                console.error("Respuesta completa del servidor:", error.response.data);
                alert('Error del servidor: ' + JSON.stringify(error.response.data));
            } else {
                alert('Error al guardar el proveedor. Por favor, intente nuevamente.');
            }
        } finally {
            setLoading(false);
        }
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
                        onClick={() => onClose(false)}
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
                                disabled={loading || proveedor} // Deshabilitar NIT en edición
                            />
                            {proveedor && (
                                <small className="text-muted">El NIT no se puede modificar</small>
                            )}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                        <button 
                            type="submit" 
                            className="btn btn-success px-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Guardando...
                                </>
                            ) : (
                                proveedor ? "Actualizar Proveedor" : "Guardar Proveedor"
                            )}
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-secondary px-4" 
                            onClick={() => onClose(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ProveedoresForm;