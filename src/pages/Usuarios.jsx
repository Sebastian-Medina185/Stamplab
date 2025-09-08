import { useState } from "react";
import Icon from "../components/Icon"; // 👈 importa el componente

const Usuarios = () => {
    const [searchName, setSearchName] = useState("");

    return (
        <div className="d-flex vh-100">
            {/* Íconos principales */}
            <div style={{ display: "flex", gap: "20px", fontSize: "40px" }}>
                <Icon name="agregar" size={44} alt="Agregar" />
            </div>


            {/* Main content */}
            <main className="flex-grow-1 p-4">
                {/* Gestión usuarios */}
                <section>
                    <div className="d-flex flex-column justify-content-center">
                        <h2 className="fs-4 text-center mb-4 fw-bold">GESTIÓN DE USUARIOS</h2>

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
                                    <th>Documento</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Dirección</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>197419744</td>
                                    <td>Wilmer</td>
                                    <td>Hole@gmail.com</td>
                                    <td>Cll 65 #143</td>
                                    <td>3149293233</td>
                                    <td>Administrador</td>
                                    <td className="d-flex justify-content-center gap-2">
                                        <Icon name="ver" size={30} alt="Ver" className="me-1" />
                                        <Icon name="editar" size={30} alt="Editar" className="me-1" />
                                        <Icon name="eliminar" size={30} alt="Eliminar" className="me-1" />
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

export default Usuarios;
