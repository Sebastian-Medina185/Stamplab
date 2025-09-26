import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { createColor, updateColor } from "../../Services/api-colores/colores";

const ColoresForm = ({ onClose, onSave, colorEdit }) => {
    const [formData, setFormData] = useState({
        Nombre: ""
    });

    // Si estamos editando, llenar el formulario
    useEffect(() => {
        if (colorEdit) {
            setFormData({
                Nombre: colorEdit.Nombre || ""
            });
        }
    }, [colorEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (colorEdit) {
                // Editar
                const result = await updateColor({
                    ColorID: colorEdit.ColorID,
                    ...formData
                });
                if (result.estado) {
                    alert("Color actualizado con éxito");
                    onSave();
                } else {
                    alert("Error: " + result.mensaje);
                }
            } else {
                // Crear
                const result = await createColor(formData);
                if (result.estado) {
                    alert("Color creado con éxito");
                    onSave();
                } else {
                    alert("Error: " + result.mensaje);
                }
            }
        } catch (error) {
            console.error("Error guardando color:", error);
            alert("Ocurrió un error al guardar");
        }
    };

    return (
        <div className="card shadow-sm border-0 p-4 mx-4">
            {/* Encabezado */}
            <div className="position-relative mb-4 text-center">
                <p className="fw-bold fs-3 mb-0">
                    {colorEdit ? "Editar Color" : "Crear Color"}
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-warning btn-sm shadow-sm position-absolute top-0 end-0"
                >
                    <FaTimes />
                </button>
            </div>

            {/* Formulario */}
            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                    <label className="form-label fw-bold">Nombre del Color</label>
                    <input
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                {/* Botones */}
                <div className="col-12 d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-secondary shadow-sm"
                    >
                        Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary shadow-sm">
                        {colorEdit ? "Actualizar" : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ColoresForm;