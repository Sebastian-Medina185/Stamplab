import { useState } from "react";
import Icon from "../components/Icon";

const Pedidos = () => {
    const [search, setSearch] = useState("");

    return (
        <div className="p-4">
            {/* Íconos principales */}
            <div style={{ display: "flex", gap: "20px", fontSize: "40px" }}>
                <Icon name="agregar" size={44} alt="Agregar" />
            </div>

            <div className="d-flex flex-column justify-content-center">
                <h2 className="fs-4 text-center mb-4 fw-bold">GESTION DE PEDIDOS</h2>

                <div className="d-flex justify-content-center align-items-center gap-2">
                    <i className="bi bi-search fs-5"></i>
                    <label className="form-label m-0">🔍 Filtrar por nombre:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Digite el nombre"
                        style={{ maxWidth: "220px" }}
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
                            <th>ID Pedido</th>
                            <th>Cliente</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>001</td>
                            <td>Juan Pérez</td>
                            <td>Camiseta</td>
                            <td>3</td>
                            <td>28/08/2025</td>
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
                        <tr>
                            <td>002</td>
                            <td>María López</td>
                            <td>Pantalón</td>
                            <td>2</td>
                            <td>29/08/2025</td>
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

export default Pedidos;
