import { useState } from "react";

const TallasForm = ({ onSave, onClose, initialData }) => {
    const [formData, setFormData] = useState(initialData || { Nombre: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, Nombre: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); 
    };

    return (
        <div className="card card-body shadow-sm mx-4">
            <h5>{initialData ? "Editar Talla" : "Agregar Nueva Talla"}</h5>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="Nombre"
                    className="form-control mb-2"
                    placeholder="Nombre de la talla (ej: S, M, L)"
                    value={formData.Nombre}
                    onChange={handleChange}
                    required
                />
                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        {initialData ? "Guardar cambios" : "Guardar"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TallasForm;