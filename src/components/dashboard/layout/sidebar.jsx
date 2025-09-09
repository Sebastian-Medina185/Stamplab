import {
    FaUsers,
    FaClipboardList,
    FaBox,
    FaTshirt,
    FaPalette,
    FaRuler,
    FaChartBar
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <aside
            className="d-flex flex-column flex-shrink-0 p-3 bg-light"
            style={{ width: "250px", height: "100vh", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
        >


            <div className="mb-3 fw-bold fs-5 border-bottom pb-2 text-dark">ADMIN</div>


            <nav className="flex-grow-1">
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mb-1">
                        <Link to="/usuarios" className="nav-link text-dark d-flex align-items-center">
                            <FaUsers className="me-2" /> Usuarios
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/roles" className="nav-link text-dark d-flex align-items-center">
                            <FaClipboardList className="me-2" /> Roles
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/insumos" className="nav-link text-dark d-flex align-items-center">
                            <FaBox className="me-2" /> Insumos
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/pedidos" className="nav-link text-dark d-flex align-items-center">
                            <FaBox className="me-2" /> Pedidos
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/proveedores" className="nav-link text-dark d-flex align-items-center">
                            <FaClipboardList className="me-2" /> Proveedores
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/cotizaciones" className="nav-link text-dark d-flex align-items-center">
                            <FaClipboardList className="me-2" /> Cotizaciones
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/tecnicas" className="nav-link text-dark d-flex align-items-center">
                            <FaTshirt className="me-2" /> Técnicas
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/productos" className="nav-link text-dark d-flex align-items-center">
                            <FaBox className="me-2" /> Productos
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/telas" className="nav-link text-dark d-flex align-items-center">
                            <FaTshirt className="me-2" /> Telas
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/tallas" className="nav-link text-dark d-flex align-items-center">
                            <FaRuler className="me-2" /> Tallas
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/colores" className="nav-link text-dark d-flex align-items-center">
                            <FaPalette className="me-2" /> Colores
                        </Link>
                    </li>
                    <li className="nav-item mb-1">
                        <Link to="/mediciondesempeño" className="nav-link text-dark d-flex align-items-center">
                            <FaChartBar className="me-2" /> Medición y Desempeño
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
