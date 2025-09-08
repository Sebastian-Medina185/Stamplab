import { useState } from "react";
import Icon from "../components/Icon";

const Proveedores = () => {
    const [searchName, setSearchName] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    return (
        <div className="d-flex vh-100">
            {/* Main content */}
            <main className="flex-grow-1 p-4">
                {/* Íconos principales */}
                <div style={{ display: "flex", gap: "20px", fontSize: "40px" }}>
                    <Icon name="agregar" size={44} alt="Agregar" />
                </div>

                {/* Gestión proveedores */}
                <section>
                    <div className="d-flex flex-column">
                        <h2 className="fs-4 fw-bold text-center mb-4">GESTIÓN DE PROVEEDORES</h2>

                        {/* Filtros */}
                        <div className="d-flex flex-column align-items-center gap-2 mb-3 flex-wrap">
                            <div className="input-group w-25">
                                <span className="input-group-text">🔍</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Filtrar por nombre"
                                    value={searchName}
                                    onChange={(e) => setSearchName(e.target.value)}
                                />
                            </div>
                            
                            <div className="input-group w-25">
                                <span className="input-group-text">🔍</span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Filtrar por estado"
                                    value={searchStatus}
                                    onChange={(e) => setSearchStatus(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>


                    {/* Tabla */}
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover text-center align-middle shadow bg-white">
                            <thead className="table-light">
                                <tr>
                                    <th>Nit Proveedor</th>
                                    <th>Nombre Proveedor</th>
                                    <th>Correo</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>43-63-87</td>
                                    <td>Mario</td>
                                    <td>mario12@gmail.com</td>
                                    <td>3456543</td>
                                    <td>CLL #42</td>
                                    <td>
                                        <button className="btn btn-success btn-sm">Activo</button>
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
                </section>
            </main>
        </div>
    );
};

export default Proveedores;