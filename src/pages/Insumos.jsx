// Insumos.jsx
import { useState } from "react";
import Icon from "../components/Icon";

const Insumos = () => {
    const [search, setSearchName] = useState("");

    return (
        <div className="p-4">
            {/* Íconos principales */}
            <div style={{ display: "flex", gap: "20px", fontSize: "40px" }}>
                <Icon name="agregar" size={44} alt="Agregar" />
            </div>

            <div className="d-flex flex-column justify-content-center">
                <h2 className="fs-4 text-center mb-4 fw-bold">GESTION DE INSUMOS</h2>

                <div className="d-flex flex-column align-items-center gap-2 mb-3 flex-wrap">
                    <div className="input-group w-25">
                        <span className="input-group-text">🔍</span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Filtrar por nombre"
                            value={search}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </div>
                </div>
            </div>


            {/* Tabla */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover text-center align-middle shadow bg-white">
                    <thead className="table-light">
                        <tr>
                            <th>Nombre Insumo</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th className="w-50">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Camiseta</td>
                            <td>4</td>
                            <td>
                                <span className="btn btn-success btn-sm">Activo</span>
                            </td>
                            <td className="d-flex justify-content-center gap-2 flex-wrap">
                                <Icon name="ver" size={30} alt="Ver" className="me-1" />
                                <Icon name="editar" size={30} alt="Editar" className="me-1" />
                                <Icon name="eliminar" size={30} alt="Eliminar" className="me-1" />
                                <Icon name="cambiarestado" size={30} alt="Cambiar estado" className="me-1" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Insumos;