import { useState } from "react";
import Icon from "../components/Icon";

const Colores = () => {
    const [search, setSearch] = useState("");

    return (
        <div className="p-4">
            {/* Íconos principales */}
            <div style={{ display: "flex", gap: "20px", fontSize: "40px" }}>
                <Icon name="agregar" size={44} alt="Agregar" />
            </div>

            {/* Encabezado */}
            <div className="d-flex flex-column align-items-center">
                <h1 className="fs-4 fw-bold text-center mb-4">Gestión de Colores</h1>

                <div className="input-group w-25 mb-2">
                    <span className="input-group-text">🔍</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Filtrar por colores..."
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
                            <th>ID Color</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>01</td>
                            <td>Rojo</td>
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

export default Colores;