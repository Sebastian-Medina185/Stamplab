import { useState, useEffect } from "react";
import { FaTimes, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { createTela, updateTela, getTelas } from "../../Services/api-telas/telas";

const TelasForm = ({ onClose, onSave, telaEdit }) => {
    const [formData, setFormData] = useState({
        Nombre: ""
    });

    const [errors, setErrors] = useState({
        Nombre: ""
    });

    const [telasExistentes, setTelasExistentes] = useState([]);

    // Cargar datos y telas existentes
    useEffect(() => {
        const fetchTelas = async () => {
            try {
                const data = await getTelas();
                if (data && Array.isArray(data.datos)) {
                    setTelasExistentes(data.datos.map(t => t.Nombre.toLowerCase().trim()));
                }
            } catch (error) {
                console.error("Error cargando telas existentes:", error);
            }
        };
        fetchTelas();

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

        //  Validar duplicado mientras se escribe
        if (name === "Nombre") {
            const nombreLower = value.toLowerCase().trim();
            const existe = telasExistentes.includes(nombreLower) &&
                           (!telaEdit || nombreLower !== telaEdit.Nombre.toLowerCase().trim());

            if (existe) {
                setErrors((prev) => ({
                    ...prev,
                    Nombre: "Ya existe una tela con ese nombre."
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    Nombre: ""
                }));
            }
        }
    };

    // Validar campo individual
    const validateField = (name, value) => {
        let errorMsg = "";
        const nombre = value.trim();

        if (name === "Nombre") {
            const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

            if (!nombre) {
                errorMsg = "El nombre de la tela es obligatorio.";
            } else if (!soloLetras.test(nombre)) {
                errorMsg = "El nombre no puede contener números ni caracteres especiales.";
            } else if (nombre.length < 3) {
                errorMsg = "Debe tener al menos 3 caracteres.";
            } else if (nombre.length > 40) {
                errorMsg = "No puede tener más de 40 caracteres.";
            } else if (
                telasExistentes.includes(nombre.toLowerCase()) &&
                (!telaEdit || nombre.toLowerCase() !== telaEdit.Nombre.toLowerCase())
            ) {
                errorMsg = "Ya existe una tela con ese nombre.";
            }
        }

        setErrors((prev) => ({
            ...prev,
            [name]: errorMsg
        }));

        return errorMsg === "";
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    // Configurar toast
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

    // Guardar / Editar
    const handleSubmit = async (e) => {
        e.preventDefault();

        const nombreLower = formData.Nombre.toLowerCase().trim();
        const existe = telasExistentes.includes(nombreLower) &&
                       (!telaEdit || nombreLower !== telaEdit.Nombre.toLowerCase().trim());

        if (existe) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ya existe una tela con ese nombre.",
            });
            return;
        }

        if (!validateField("Nombre", formData.Nombre)) return;

        try {
            let result;

            if (telaEdit) {
                result = await updateTela(telaEdit.TelaID, formData);
            } else {
                result = await createTela(formData);
            }

            if (result.estado) {
                Toast.fire({
                    icon: "success",
                    title: telaEdit
                        ? "Tela actualizada correctamente"
                        : "Tela creada correctamente",
                });

                onSave && onSave();
                onClose();
            } else {
                Swal.fire("Error", result.mensaje || "No se pudo procesar la tela.", "error");
            }
        } catch (error) {
            console.error("Error al guardar tela:", error);
            Swal.fire("Error", "Ocurrió un error al guardar la tela.", "error");
        }
    };

    // Eliminar
   
        

    return (
        <div className="card shadow-sm border-0 p-4 mx-4">
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

            <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-12">
                    <label className="form-label fw-bold">Nombre de la Tela</label>
                    <input
                        type="text"
                        name="Nombre"
                        value={formData.Nombre}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`form-control ${errors.Nombre ? "is-invalid" : ""}`}
                        placeholder="Ej: Algodón"
                        maxLength="40"
                    />
                    {errors.Nombre ? (
                        <div className="invalid-feedback">{errors.Nombre}</div>
                    ) : (
                        <div className="form-text">Solo letras. Mínimo 3 y máximo 40 caracteres.</div>
                    )}
                </div>

                <div className="col-12 d-flex justify-content-between">
                    <div className="d-flex gap-2 ms-auto">
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
                </div>
            </form>
        </div>
    );
};

export default TelasForm;