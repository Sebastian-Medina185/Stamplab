import { useState } from "react";
import Icon from "../components/Icon"; // 👈 importa el componente

const Tecnicas = () => {
    const [search, setSearch] = useState("");

    return (
        <div className="d-flex vh-100">
            {/* Íconos principales */}
            <div style={{ display: "flex", gap: "20px", fontSize: "40px" }}>
                <Icon name="agregar" size={44} alt="Agregar" />
            </div>


            {/* Main content */}
            <main className="flex-grow-1 p-4">

                {/* Gestión técnicas */}
                <section>

                    <div className="d-flex flex-column align-items-center">
                        <h2 className="fs-4 fw-bold text-center mb-4">GESTIÓN DE TÉCNICAS</h2>

                        {/* Filtro */}
                        <div className="input-group mb-3 w-25">
                            <span className="input-group-text">🔍</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Digite el nombre"
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
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Sublimación</td>
                                    <td>Para camisas</td>
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

export default Tecnicas;