import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";

const ProveedoresForm = ({ onClose, onSave, proveedor = null }) => {
    const [formData, setFormData] = useState({
        nit: proveedor?.Nit || "",
        nombre: proveedor?.Nombre || "",
        correo: proveedor?.Correo || "",
        telefono: proveedor?.Telefono || "",
        direccion: proveedor?.Direccion || "",
        estado: proveedor?.Estado ?? true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'estado' ? value === 'true' : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos
        const camposRequeridos = ['nit', 'nombre', 'correo', 'telefono', 'direccion'];
        const camposFaltantes = camposRequeridos.filter(campo => !formData[campo].trim());

        if (camposFaltantes.length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Campos requeridos',
                text: `Los siguientes campos son obligatorios: ${camposFaltantes.join(', ')}`
            });
            return;
        }

        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error al guardar:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.mensaje || 'Error al guardar el proveedor'
            });
        }
    };

    return (
        <div className="container py-4">
            <div className="position-relative mb-4 text-center">
                <h2 className="fs-4 fw-bold mb-0">
                    {proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
                </h2>
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                >
                    <FaTimes />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 rounded shadow bg-white">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">NIT</label>
                        <input
                            type="text"
                            name="nit"
                            value={formData.nit}
                            onChange={handleChange}
                            className="form-control"
                            required
                            maxLength="20"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="form-control"
                            required
                            maxLength="50"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Correo</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            className="form-control"
                            required
                            maxLength="100"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="form-control"
                            required
                            maxLength="15"
                        />
                    </div>

                    <div className="col-12">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            className="form-control"
                            required
                            maxLength="155"
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Estado</label>
                        <select
                            name="estado"
                            value={formData.estado.toString()}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {proveedor ? "Actualizar" : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProveedoresForm;