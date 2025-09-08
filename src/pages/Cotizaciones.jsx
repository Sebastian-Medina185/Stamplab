import { useState } from "react";
import Icon from "../components/Icon";

const Cotizaciones = () => {
    const [search, setSearch] = useState("");

    return (
        <div className="p-4">
            {/* Íconos principales */}
            <div style={{ display: "flex", gap: "20px", fontSize: "40px" }}>
                <Icon name="agregar" size={44} alt="Agregar" />
            </div>


            <div className="d-flex flex-column align-items-center">
                <h1 className="fs-4 fw-bold mb-4 text-center">Gestión de Cotizaciones</h1>

                <div className="input-group w-25 mb-2">
                    <span className="input-group-text">🔍</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filtrar por cliente..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>


            {/* Tabla */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover text-center align-middle shadow bg-white">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Documento/ID</th>
                            <th>Correo</th>
                            <th>Total</th>
                            <th>Teléfono</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>01</td>
                            <td className="fw-medium">12323412</td>
                            <td>carlos@gmail.com</td>
                            <td>300.000</td>
                            <td>31065219289</td>
                            <td>19-05-2025</td>
                            <td>
                                <span className="btn btn-success btn-sm">Aprobada</span>
                            </td>
                            <td className="d-flex justify-content-center gap-2 flex-wrap">
                                <Icon name="ver" size={30} alt="Ver" className="me-1" />
                                <Icon name="editar" size={30} alt="Editar" className="me-1" />
                                <Icon name="cambiarestado" size={30} alt="Cambiar estado" className="me-1" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Cotizaciones;
