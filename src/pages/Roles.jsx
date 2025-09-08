import { useState } from "react";
import Icon from "../components/Icon";

const Roles = () => {
    const [searchName, setSearchName] = useState("");

    return (
        <div className="d-flex vh-100">
            {/* Main content */}
            <main className="flex-grow-1 p-4">
                {/* Íconos principales */}
                <div style={{ display: "flex", gap: "20px", fontSize: "40px" }}>
                    <Icon name="agregar" size={44} alt="Agregar" />
                </div>

                {/* Gestión roles */}
                <section>
                    <div className="d-flex flex-column justify-content-center">
                        <h2 className="fs-4 text-center mb-4 fw-bold">GESTION DE ROLES</h2>

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
                        </div>
                    </div>


                    {/* Tabla */}
                    <div className="table-responsive mt-4">
                        <table className="table table-bordered text-center align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre del Rol</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Administrador</td>
                                    <td>Acceso completo al sistema</td>
                                    <td>
                                        <button className="btn btn-success btn-sm shadow">Activo</button>
                                    </td>
                                    <td className="d-flex justify-content-center gap-2">
                                        <Icon name="ver" size={30} alt="Ver" className="me-1" />
                                        <Icon name="editar" size={30} alt="Editar" className="me-1" />
                                        <Icon name="cambiarestado" size={30} alt="Cambiar estado" className="me-1" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Empleado</td>
                                    <td>Acceso limitado a funciones específicas</td>
                                    <td>
                                        <button className="btn btn-success btn-sm shadow">Activo</button>
                                    </td>
                                    <td className="d-flex justify-content-center gap-2">
                                        <Icon name="ver" size={30} alt="Ver" className="me-1" />
                                        <Icon name="editar" size={30} alt="Editar" className="me-1" />
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

export default Roles;