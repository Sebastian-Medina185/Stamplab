import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { getUsuarios } from "../../Services/api-usuarios/usuarios";
import { getCotizaciones, updateCotizacion } from "../../Services/api-cotizaciones/cotizaciones";
import axios from "axios";

const CotizacionesForm = ({ onClose, cotizacionToEdit }) => {
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  
  // Datos del formulario
  const [documentoID, setDocumentoID] = useState("");
  const [valorTotal, setValorTotal] = useState(0);
  const [estadoID, setEstadoID] = useState(1);
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    cargarUsuarios();
    if (cotizacionToEdit) {
      console.log('Editando cotización:', cotizacionToEdit);
      setDocumentoID(cotizacionToEdit.Usuario?.DocumentoID || cotizacionToEdit.DocumentoID || "");
      setValorTotal(cotizacionToEdit.ValorTotal || 0);
      
      // Mapear estado correctamente
      let estadoId = 1;
      if (cotizacionToEdit.EstadoID) {
        estadoId = cotizacionToEdit.EstadoID;
      } else if (cotizacionToEdit.Estado) {
        const estadoNombre = typeof cotizacionToEdit.Estado === 'object' 
          ? cotizacionToEdit.Estado.Nombre 
          : cotizacionToEdit.Estado;
        
        if (estadoNombre === "Aprobada") estadoId = 2;
        else if (estadoNombre === "Rechazada") estadoId = 3;
      }
      setEstadoID(estadoId);
    }
  }, [cotizacionToEdit]);

  const cargarUsuarios = async () => {
    try {
      console.log('Cargando usuarios...');
      const response = await getUsuarios();
      console.log('Response usuarios:', response);
      
      // El endpoint devuelve { estado, datos: [...] }
      const data = response?.datos || response || [];
      console.log('Usuarios procesados:', data);
      
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!documentoID) {
      Swal.fire("Atención", "Selecciona un cliente", "warning");
      return;
    }

    setLoading(true);
    try {
      if (cotizacionToEdit) {
        // ACTUALIZAR cotización existente
        console.log('Actualizando cotización:', cotizacionToEdit.CotizacionID);
        
        const dataActualizar = {
          ValorTotal: parseFloat(valorTotal) || 0,
          EstadoID: parseInt(estadoID)
        };
        
        console.log('Datos a enviar:', dataActualizar);
        
        const response = await updateCotizacion(cotizacionToEdit.CotizacionID, dataActualizar);
        console.log('Response actualización:', response);
        
        Swal.fire({
          icon: "success",
          title: "Cotización actualizada",
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // CREAR nueva cotización (solo cabecera)
        console.log('Creando nueva cotización');
        
        const cotizacionData = {
          DocumentoID: parseInt(documentoID),
          FechaCotizacion: new Date().toISOString(),
          ValorTotal: parseFloat(valorTotal) || 0,
          EstadoID: parseInt(estadoID)
        };
        
        console.log('Datos a enviar:', cotizacionData);
        
        // Usar el endpoint correcto: POST /api/cotizaciones (sin /completa)
        const response = await axios.post('http://localhost:3000/api/cotizaciones', cotizacionData);
        console.log('Response creación:', response.data);
        
        Swal.fire({
          icon: "success",
          title: "Cotización creada",
          text: `ID: ${response.data.cotizacion?.CotizacionID}`,
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error:", error);
      console.error("Error response:", error.response?.data);
      
      const mensaje = error.response?.data?.message || error?.message || "Error al procesar la cotización";
      Swal.fire("Error", mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      maxWidth: '800px',
      margin: '40px auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }}>
      {/* Título */}
      <div className="position-relative mb-4 text-center">
        <h3 className="fw-bold mb-0">
          {cotizacionToEdit ? "Editar Cotización" : "Nueva Cotización"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-danger btn-sm shadow-sm position-absolute top-0 end-0"
          style={{ borderRadius: '50%', width: '36px', height: '36px' }}
          title="Cerrar"
        >
          <FaTimes />
        </button>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-4 rounded" style={{ backgroundColor: "#f8f9fa" }}>
        
        {/* Cliente */}
        <div className="mb-3">
          <label className="form-label fw-bold">
            Cliente <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            value={documentoID}
            onChange={(e) => setDocumentoID(e.target.value)}
            required
            disabled={loading || cotizacionToEdit} // No permitir cambiar cliente al editar
          >
            <option value="">Seleccionar cliente...</option>
            {usuarios.map(u => (
              <option key={u.DocumentoID} value={u.DocumentoID}>
                {u.Nombre} - CC: {u.DocumentoID}
              </option>
            ))}
          </select>
          <small className="text-muted">
            {cotizacionToEdit 
              ? "No se puede cambiar el cliente de una cotización existente"
              : "El cliente debe estar registrado en el sistema"}
          </small>
        </div>

        {/* Estado */}
        <div className="mb-3">
          <label className="form-label fw-bold">Estado</label>
          <select
            className="form-select"
            value={estadoID}
            onChange={(e) => setEstadoID(e.target.value)}
            disabled={loading}
          >
            <option value="1">Pendiente</option>
            <option value="2">Aprobada</option>
            <option value="3">Rechazada</option>
          </select>
        </div>

        {/* Valor Total */}
        <div className="mb-3">
          <label className="form-label fw-bold">Valor Total (COP)</label>
          <input
            type="number"
            className="form-control"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            placeholder="0"
            min="0"
            step="1000"
            disabled={loading}
          />
          <small className="text-muted">
            Puedes asignar el valor ahora o después desde la lista
          </small>
        </div>

        {/* Observaciones */}
        <div className="mb-4">
          <label className="form-label fw-bold">Observaciones</label>
          <textarea
            className="form-control"
            rows="3"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Notas adicionales sobre la cotización..."
            disabled={loading}
          />
        </div>

        {/* Info adicional */}
        <div className="alert alert-info">
          <small>
            <strong>Nota:</strong> Esta es una cotización simplificada desde el panel de administración. 
            Solo se crea la cabecera de la cotización. Para cotizaciones detalladas con productos y diseños 
            específicos, el cliente debe solicitarla desde el landing.
          </small>
        </div>

        {cotizacionToEdit && (
          <div className="alert alert-warning">
            <small>
              <strong>Editando:</strong> Solo puedes modificar el valor total y el estado. 
              Los detalles de productos y diseños no se pueden editar desde aquí.
            </small>
          </div>
        )}

        {/* Botones */}
        <div className="d-flex justify-content-end gap-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Procesando...
              </>
            ) : (
              cotizacionToEdit ? "Actualizar Cotización" : "Crear Cotización"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CotizacionesForm;