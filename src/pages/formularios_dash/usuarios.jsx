// src/pages/formularios_dash/usuariosForm.jsx
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import Icon from "../../components/Icon";

const UsuariosForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        documento: "",
        nombre: "",
        correo: "",
        direccion: "",
        telefono: "",
        contrasena: "",
        rol: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Usuario registrado:", formData);
        // Aquí luego haces la petición a tu backend con fetch/axios
    };

    return (
        <div className="container py-4">
            {/* Título */}
            <div className="position-relative mb-4 text-center">
                <p className="fw-bold fs-3 mb-0">Formulario de Usuario</p>
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
                    <div className="col-md-6">
                        <label className="form-label">Documento:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="documento"
                            value={formData.documento}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Nombre:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Correo:</label>
                        <input
                            type="email"
                            className="form-control"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Teléfono:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-12">
                        <label className="form-label">Dirección:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Contraseña:</label>
                        <input
                            type="password"
                            className="form-control"
                            name="contrasena"
                            value={formData.contrasena}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Rol:</label>
                        <select
                            className="form-select"
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione un rol</option>
                            <option value="AD">Administrador</option>
                            <option value="CL">Cliente</option>
                            <option value="EM">Empleado</option>
                        </select>
                    </div>
                </div>

                {/* Botones */}
                <div className="d-flex justify-content-center gap-3 mt-4">
                    <button type="submit" className="btn btn-success px-4">
                        Guardar Usuario
                    </button>
                    <button type="button" className="btn btn-danger px-4" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UsuariosForm;
