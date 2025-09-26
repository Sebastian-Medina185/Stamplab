import { FaTimes } from "react-icons/fa";

const InsumoForm = ({ onClose }) => {
  return (
    <div className="card shadow-sm border-0 p-4 mx-4">
      {/* Encabezado con título centrado y botón cerrar */}
      <div className="position-relative mb-4 text-center">
        <p className="fw-bold fs-3 mb-0">Formulario de Insumo</p>
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
      <form className="row g-3">
        {/* Nombre del Insumo */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Nombre del Insumo</label>
          <input type="text" className="form-control" placeholder="Ej: Camiseta" />
        </div>

        {/* Stock */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Stock</label>
          <input type="number" className="form-control" placeholder="Ej: 10" />
        </div>

        {/* Estado */}
        <div className="col-md-6">
          <label className="form-label fw-bold">Estado</label>
          <select className="form-select">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        {/* Botón Guardar */}
        <div className="col-12 text-end">
          <button type="submit" className="btn btn-primary shadow-sm">
            Guardar Insumo
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsumoForm;
