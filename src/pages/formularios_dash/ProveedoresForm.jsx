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

    const [errores, setErrores] = useState({
        nit: "",
        nombre: "",
        correo: "",
        telefono: "",
        direccion: ""
    });

    // Validación de campos
    const validarCampo = (name, value) => {
        let error = "";

        switch (name) {
            case "nit":
                if (!value.trim()) error = "El NIT es obligatorio";
                else if (!/^\d+$/.test(value)) error = "El NIT solo debe contener números";
                break;
            case "nombre":
                if (!value.trim()) error = "El nombre es obligatorio";
                else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(value)) error = "Solo letras y espacios";
                else if (value.length < 3 || value.length > 20) error = "Debe tener entre 3 y 20 caracteres";
                break;
            case "correo":
                if (!value.trim()) error = "El correo es obligatorio";
                else if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) error = "Formato inválido";
                else if (value.length < 10 || value.length > 30) error = "Debe tener entre 10 y 30 caracteres";
                break;
            case "telefono":
                if (!value.trim()) error = "El teléfono es obligatorio";
                else if (!/^\+?\d+$/.test(value)) error = "Solo números (y opcionalmente '+')";
                else if (value.length < 7 || value.length > 15) error = "Debe tener entre 7 y 15 caracteres";
                break;
            case "direccion":
                if (!value.trim()) error = "La dirección es obligatoria";
                else if (!/^[A-Za-z0-9\s\.\-#]+$/.test(value)) error = "Caracteres no permitidos";
                else if (value.length < 10 || value.length > 20) error = "Debe tener entre 10 y 20 caracteres";
                break;
            default:
                break;
        }

        setErrores((prev) => ({ ...prev, [name]: error }));
        return error === "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "estado" ? value === "true" : value
        }));
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validarCampo(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let todoValido = true;
        for (let key of ["nit", "nombre", "correo", "telefono", "direccion"]) {
            const valido = validarCampo(key, formData[key]);
            if (!valido) todoValido = false;
        }

        if (!todoValido) {
            Swal.fire({
                icon: "error",
                title: "Errores en el formulario",
                text: "Por favor corrija los campos en rojo antes de enviar"
            });
            return;
        }

        try {
            await onSave(formData);

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: proveedor
                    ? "Proveedor actualizado exitosamente"
                    : "Proveedor creado exitosamente",
                showConfirmButton: false,
                timer: 2000,
                toast: true
            });

            onClose();
        } catch (error) {
            console.error("Error al guardar:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.mensaje || "Error al guardar el proveedor"
            });
        }
    };

    return (
        <div className="container py-4">
            <div className="position-relative mb-4 text-center">
                <p className="fw-bold fs-3 mb-0">
                    {proveedor ? "Editar Proveedor" : "Nuevo Proveedor"}
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

            <form onSubmit={handleSubmit} className="p-4 rounded shadow bg-white">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">NIT</label>
                        <input
                            type="text"
                            name="nit"
                            value={formData.nit}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${errores.nit ? "is-invalid" : ""}`}
                            maxLength="20"
                        />
                        <div className="invalid-feedback">{errores.nit}</div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${errores.nombre ? "is-invalid" : ""}`}
                            maxLength="50"
                        />
                        <div className="invalid-feedback">{errores.nombre}</div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Correo</label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${errores.correo ? "is-invalid" : ""}`}
                            maxLength="100"
                        />
                        <div className="invalid-feedback">{errores.correo}</div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Teléfono</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${errores.telefono ? "is-invalid" : ""}`}
                            maxLength="15"
                        />
                        <div className="invalid-feedback">{errores.telefono}</div>
                    </div>

                    <div className="col-12">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`form-control ${errores.direccion ? "is-invalid" : ""}`}
                            maxLength="155"
                        />
                        <div className="invalid-feedback">{errores.direccion}</div>
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
                    <button type="submit" className="btn btn-success">
                        {proveedor ? "Actualizar" : "Guardar"}
                    </button>
                    <button type="button" onClick={onClose} className="btn btn-secondary">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProveedoresForm;