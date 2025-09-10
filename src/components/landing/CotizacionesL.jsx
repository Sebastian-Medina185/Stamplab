import { useState } from "react";
import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";
import Icon from "../Icon";

const CotizacionesLanding = () => {
  const [traePrenda, setTraePrenda] = useState("no"); // "no" predeterminado
  const [showDiseno, setShowDiseno] = useState(false);

  return (
    <>
      <NavbarComponent />

      <div className="container py-4">
        {/* Título */}
        <div className="d-flex justify-content-center mb-4">
          <p className="fw-bold fs-3">Formulario de cotización</p>
        </div>

        {/* Formulario */}
        <form
          className="p-4 rounded shadow"
          style={{ backgroundColor: "#f5f5fa", color: "#2a273a" }}
        >
          {/* ¿Traes la prenda? */}
          <div className="mb-3 text-center">
            <label className="form-label me-3 fw-bold">¿Traes la prenda?</label>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="traePrenda"
                id="si"
                value="si"
                checked={traePrenda === "si"}
                onChange={(e) => setTraePrenda(e.target.value)}
              />
              <label className="form-check-label" htmlFor="si">
                Sí
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="traePrenda"
                id="no"
                value="no"
                checked={traePrenda === "no"}
                onChange={(e) => setTraePrenda(e.target.value)}
              />
              <label className="form-check-label" htmlFor="no">
                No
              </label>
            </div>
          </div>

          {/* Campos dinámicos */}
          {traePrenda === "si" ? (
            <div className="mb-3">
              <label className="form-label">Descripción de la prenda:</label>
              <textarea className="form-control" />
            </div>
          ) : (
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Tipo Prenda:</label>
                <select className="form-select">
                  <option>Camiseta</option>
                  <option>Pantalón</option>
                  <option>Chaqueta</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Tipo Tela:</label>
                <select className="form-select">
                  <option>Poliester</option>
                  <option>Algodón</option>
                  <option>Lino</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Cantidad:</label>
                <input type="number" className="form-control" defaultValue="1" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Color:</label>
                <input type="text" className="form-control" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Talla:</label>
                <select className="form-select">
                  <option>S</option>
                  <option>M</option>
                  <option>L</option>
                  <option>XL</option>
                </select>
              </div>
            </div>
          )}

          {/* Aplicar diseño */}
          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="diseno"
              checked={showDiseno}
              onChange={(e) => setShowDiseno(e.target.checked)}
            />
            <label className="form-check-label fw-bold" htmlFor="diseno">
              Aplicar diseño
            </label>
          </div>

          {/* Sección desplegable de diseño */}
          {showDiseno && (
            <div
              className="p-3 mt-3 rounded"
              style={{ backgroundColor: "#e9e6f3", border: "1px solid #d0cde1" }}
            >
              <h5 className="text-center mb-3 text-dark">Diseños</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Técnica:</label>
                  <select className="form-select">
                    <option>Seleccione opción</option>
                    <option>Sublimación</option>
                    <option>Bordado</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Parte:</label>
                  <select className="form-select">
                    <option>Superior</option>
                    <option>Inferior</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Subparte Descripción:</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Diseño:</label>
                  <input type="file" className="form-control" />
                </div>
                <div className="col-12">
                  <label className="form-label">Observación:</label>
                  <textarea className="form-control"></textarea>
                </div>
              </div>

              {/* Botones de diseño */}
              <div className="d-flex justify-content-between mt-3">
                <button type="button" className="btn btn-outline-primary">
                  + Agregar parte
                </button>
                <button type="button" className="btn btn-outline-success">
                  + Agregar diseño
                </button>
              </div>

              {/* Tabla de diseños */}
              <div className="table-responsive mt-4">
                <table className="table table-bordered table-striped text-center align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Técnica</th>
                      <th>Parte</th>
                      <th>Subparte</th>
                      <th>Diseño</th>
                      <th>Observación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sublimación</td>
                      <td>Superior</td>
                      <td>Abajo</td>
                      <td>dragon.png</td>
                      <td>Diseño rosado</td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <button className="btn btn-outline-primary btn-sm">
                            <Icon name="ver" />
                          </button>
                          <button className="btn btn-outline-warning btn-sm">
                            <Icon name="editar" />
                          </button>
                          <button className="btn btn-outline-danger btn-sm">
                            <Icon name="eliminar" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="d-flex gap-3 mt-4">
            <button type="button" className="btn btn-success">
              + Agregar Cotización
            </button>
            <button type="button" className="btn btn-primary">
              + Agregar Producto
            </button>
          </div>

          {/* Tabla de productos */}
          <div className="table-responsive mt-4">
            <table className="table table-bordered text-center align-middle table-light">
              <thead>
                <tr>
                  <th>Tipo de prenda</th>
                  <th>Tipo Tela</th>
                  <th>Cantidad</th>
                  <th>Color</th>
                  <th>Talla</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Camiseta</td>
                  <td>Poliester</td>
                  <td>3</td>
                  <td>Negro</td>
                  <td>XL</td>
                  <td className="d-flex justify-content-center gap-2">
                    <button className="btn btn-outline-primary btn-sm">
                      <Icon name="ver" size={20} alt="Ver" />
                    </button>
                    <button className="btn btn-outline-warning btn-sm">
                      <Icon name="editar" size={20} alt="Editar" />
                    </button>
                    <button className="btn btn-outline-danger btn-sm">
                      <Icon name="eliminar" size={20} alt="Eliminar" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Generar / Cancelar */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button type="submit" className="btn btn-success px-4">
              Generar cotización
            </button>
            <button type="button" className="btn btn-danger px-4">
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <FooterComponent />
    </>
  );
};

export default CotizacionesLanding;
