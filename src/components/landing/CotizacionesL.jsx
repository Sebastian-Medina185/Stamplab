import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";
import Icon from "../Icon";

const CotizacionesLanding = () => {
    const [showDiseno, setShowDiseno] = useState(false);

    const handleOpenDiseno = () => setShowDiseno(true);
    const handleCloseDiseno = () => setShowDiseno(false);

    return (
        <>
            <NavbarComponent />

            <div className="container py-4">
                {/* Título */}
                <div className="d-flex justify-content-center mb-4">
                    <p className="fw-bold fs-3">Formulario de cotización</p>
                </div>

                {/* Formulario */}
                <form className="p-4 rounded shadow" style={{ backgroundColor: "#1c1a29", color: "white" }}>
                    {/* ¿Traes la prenda? */}
                    <div className="mb-3 text-center">
                        <label className="form-label me-3">¿Traes la prenda?</label>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="traePrenda" id="si" />
                            <label className="form-check-label" htmlFor="si">Sí</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input" type="radio" name="traePrenda" id="no" />
                            <label className="form-check-label" htmlFor="no">No</label>
                        </div>
                    </div>

                    {/* Campos */}
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

                    {/* Aplicar diseño */}
                    <div className="form-check mt-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="diseno"
                            onChange={(e) => e.target.checked ? handleOpenDiseno() : handleCloseDiseno()}
                        />
                        <label className="form-check-label" htmlFor="diseno">Aplicar diseño</label>
                    </div>

                    {/* Botones */}
                    <div className="d-flex gap-3 mt-4">
                        <button type="button" className="btn btn-success">+ Agregar Cotización</button>
                        <button type="button" className="btn btn-primary">+ Agregar Producto</button>
                    </div>

                    {/* Tabla */}
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
                        <button type="submit" className="btn btn-success px-4">Generar cotización</button>
                        <button type="button" className="btn btn-danger px-4">Cancelar</button>
                    </div>
                </form>
            </div>

            {/* MODAL DE DISEÑO */}
            <Modal show={showDiseno} onHide={handleCloseDiseno} size="lg" centered>
                <Modal.Body style={{ backgroundColor: "#1c1a29", color: "white" }}>
                    {/* Título centrado */}
                    <h4 className="text-center mb-4">Diseños</h4>

                    {/* Contenido como tu imagen */}
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
                        <div className="d-flex justify-content-between">
                            <div>
                                <Button variant="primary">Agregar parte</Button>
                            </div>
                            <div>
                                <Button variant="success">Agregar diseño</Button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla interna */}
                    <div className="table-responsive mt-4">
                        <table className="table table-bordered table-light text-center align-middle">
                            <thead>
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
                                            <Button variant="outline-primary" size="sm"><Icon name="ver" /></Button>
                                            <Button variant="outline-warning" size="sm"><Icon name="editar" /></Button>
                                            <Button variant="outline-danger" size="sm"><Icon name="eliminar" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-end gap-2 mt-4 bg-dark">
                            <div className="btn btn-success w-75">Confirmar</div>
                            <div className="btn btn-danger w-75" onClick={handleCloseDiseno}>Cancelar</div>
                        </div>
                    </div>
                </Modal.Body>

            </Modal>


            <FooterComponent />
        </>
    );
};

export default CotizacionesLanding;
