import { useState, useEffect } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";
import { createTecnica, updateTecnica, getTecnicas } from "../../Services/api-tecncias/Tecnicas";

const TecnicaForm = ({ onClose, tecnica }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    estado: "activo",
    imagenUrl: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Si recibes técnica (editar), llena el form con sus datos
  useEffect(() => {
    if (tecnica) {
      setFormData({
        nombre: tecnica.Nombre || "",
        descripcion: tecnica.Descripcion || "",
        estado: tecnica.Estado === 1 ? "activo" : "inactivo",
        imagenUrl: tecnica.ImagenTecnica || ""
      });
    }
  }, [tecnica]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para generar el próximo ID disponible
  const generateNextTecnicaId = async () => {
    try {
      const response = await getTecnicas();
      const tecnicas = response.datos || [];
      
      // Encontrar el ID más alto y sumar 1
      let maxId = 0;
      tecnicas.forEach(t => {
        const currentId = parseInt(t.TecnicaID);
        if (!isNaN(currentId) && currentId > maxId) {
          maxId = currentId;
        }
      });
      
      // Formatear con ceros a la izquierda (02, 03, etc.)
      return String(maxId + 1).padStart(2, '0');
    } catch (error) {
      console.error('Error generando ID:', error);
      // Fallback: usar timestamp
      return Date.now().toString().slice(-2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let tecnicaId;
      
      if (tecnica && tecnica.TecnicaID) {
        // Editar técnica existente
        tecnicaId = tecnica.TecnicaID;
      } else {
        // Crear nueva técnica - generar ID único
        tecnicaId = await generateNextTecnicaId();
      }

      const dataToSend = {
        TecnicaID: tecnicaId,
        Nombre: formData.nombre,
        ImagenTecnica: formData.imagenUrl,
        Descripcion: formData.descripcion,
        Estado: formData.estado === "activo" ? 1 : 0
      };

      console.log('Enviando datos:', dataToSend);

      if (tecnica && tecnica.TecnicaID) {
        await updateTecnica(tecnica.TecnicaID, dataToSend);
        alert("Técnica actualizada con éxito");
      } else {
        await createTecnica(dataToSend);
        alert("Técnica creada con éxito");
      }

      // Notificar al componente padre que debe refrescar la lista
      onClose(true); // true indica que se guardó exitosamente
    } catch (error) {
      console.error("Error al guardar técnica:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.mensaje || error.message;
      alert(`Error al guardar la técnica: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 mx-4">
      {/* Encabezado */}
      <div className="position-relative mb-4 text-center">
        <p className="fw-bold fs-3 mb-0">
          {tecnica ? "Editar Técnica" : "Crear Técnica"}
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
        {/* Nombre */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Nombre de la Técnica</label>
          <input 
            type="text" 
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            className="form-control" 
            required
            disabled={isLoading}
          />
        </div>

        {/* Estado */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Estado</label>
          <select 
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            className="form-select"
            disabled={isLoading}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        {/* Descripción */}
        <div className="col-12">
          <label className="form-label fw-bold">Descripción</label>
          <textarea 
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className="form-control" 
            rows="4"
            disabled={isLoading}
          />
        </div>

        {/* URL de Imagen */}
        <div className="col-12">
          <label className="form-label fw-bold">URL de la Imagen</label>
          <input
            type="url"
            name="imagenUrl"
            value={formData.imagenUrl}
            onChange={handleInputChange}
            className="form-control"
            placeholder="https://mi-servidor.com/imagen.jpg"
            required
            disabled={isLoading}
          />
          <div className="form-text">
            Ingresa la URL pública de la imagen (ej: desde un hosting o servicio de archivos).
          </div>

          {formData.imagenUrl && (
            <div className="mt-3">
              <div className="card">
                <img
                  src={formData.imagenUrl}
                  alt="Vista previa"
                  className="card-img-top"
                  style={{ height: "120px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.innerHTML = '<small class="text-danger">Error cargando imagen</small>';
                  }}
                />
                <div className="card-body p-2">
                  <small className="text-muted">Vista previa</small>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="col-12 d-flex justify-content-end gap-2">
          <button 
            type="button" 
            onClick={onClose}
            className="btn btn-secondary shadow-sm"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                {tecnica ? "Actualizando..." : "Guardando..."}
              </>
            ) : (
              tecnica ? "Actualizar" : "Guardar"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TecnicaForm;