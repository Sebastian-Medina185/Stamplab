import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { createTela, updateTela } from "../../Services/api-telas/telas";

const TelasForm = ({ onClose, onSave, telaEdit }) => {
    const [formData, setFormData] = useState({
        Nombre: ""
    });

    // Si estamos editando, cargamos los datos de la tela seleccionada
    useEffect(() => {
        if (telaEdit) {
            setFormData({
                Nombre: telaEdit.Nombre || ""
            });
        }
    }, [telaEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (telaEdit) {
                // Editar tela existente
                const result = await updateTela(telaEdit.TelaID, formData);
                if (result.estado) {
                    alert("Tela actualizada con éxito");
                    onSave && onSave(); // refrescar lista en el padre
                    onClose();
                } else {
                    alert("Error: " + result.mensaje);
                }
            } else {
                // Crear nueva tela
                const result = await createTela(formData);
                if (result.estado) {
                    alert("Tela creada con éxito");
                    onSave && onSave();
                    onClose();
                } else {
                    alert("Error: " + result.mensaje);
                }
            }
        } catch (error) {
            console.error("Error guardando tela:", error);
            alert("Ocurrió un error al guardar la tela");
        }
    };

    return (
        <div className="card shadow-sm border-0 p-4 mx-4">
            {/* Encabezado con título centrado y botón cerrar */}
            <div className="position-relative mb-4 text-center">
                <p className="fw-bold fs-3 mb-0">
                    {telaEdit ? "Editar Tela" : "Crear Tela"}
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-warning btn-sm shadow-sm position-absolute top-0 end-0"
                    title="Cerrar"
                >
                    <FaTimes />
                </button>
            </div>

            {/* Formulario */}
            <form className="row g-3" onSubmit={handleSubmit}>
                {/* Nombre de la Tela */}
                <div className="col-12">
                    <label className="form-label fw-bold">Nombre de la Tela</label>
                    <input
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Ej: Algodón"
                        maxLength="40"
                        required
                    />
                    <div className="form-text">Máximo 40 caracteres</div>
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
                        {telaEdit ? "Actualizar" : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TelasForm;