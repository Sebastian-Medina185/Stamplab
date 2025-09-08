import { useState } from "react";
import Icon from "../components/Icon"; // 👈 importa el componente

const Telas = () => {
    const [search, setSearch] = useState("");

    return (
        <div className="p-4">
            {/* Íconos principales */}
            <div style={{ display: "flex", gap: "20px", fontSize: "40px" }}>
                <Icon name="agregar" size={44} alt="Agregar" />
            </div>


            {/* Encabezado */}

            <div className="d-flex flex-column align-items-center">
                <h1 className="fs-4 fw-bold text-center mb-4">Gestión de Telas</h1>

                <div className="input-group w-25 mb-2">
                    <span className="input-group-text">🔍</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por tela..."
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
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>01</td>
                            <td className="fw-medium">Algodón</td>
                            <td>Tela fresca y suave</td>
                            <td className="d-flex justify-content-center gap-2 flex-wrap">
                                <Icon name="ver" size={30} alt="Ver" className="me-1" />
                                <Icon name="editar" size={30} alt="Editar" className="me-1" />
                                <Icon name="eliminar" size={30} alt="Eliminar" className="me-1" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Telas;