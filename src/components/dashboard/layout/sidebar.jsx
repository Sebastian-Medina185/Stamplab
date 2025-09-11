import {
    FaUsers,
    FaClipboardList,
    FaBox,
    FaTshirt,
    FaPalette,
    FaRuler,
    FaChartBar
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const menuItems = [
    {
        title: "Configuracion",
        key: "roles",
        icon: <FaUsers className="me-2" />,
        items: [
            { to: "/roles", label: "Roles", icon: <FaClipboardList className="me-2" /> }
        ]
    },
    {
        title: "Gestión de Usuarios",
        key: "usuarios",
        icon: <FaUsers className="me-2" />,
        items: [
            { to: "/usuarios", label: "Usuarios", icon: <FaUsers className="me-2" /> },
        ]
    },
    {
        title: "Compras",
        key: "compras",
        icon: <FaClipboardList className="me-2" />,
        items: [
            { to: "/proveedores", label: "Proveedores", icon: <FaClipboardList className="me-2" /> },
            { to: "/cotizaciones", label: "Cotizaciones", icon: <FaClipboardList className="me-2" /> },
            { to: "/insumos", label: "Insumos", icon: <FaBox className="me-2" /> },
            { to: "/pedidos", label: "Pedidos", icon: <FaBox className="me-2" /> }
        ]
    },
    {
        title: "Producción",
        key: "produccion",
        icon: <FaTshirt className="me-2" />,
        items: [
            { to: "/tecnicas", label: "Técnicas", icon: <FaTshirt className="me-2" /> },
            { to: "/productos", label: "Productos", icon: <FaBox className="me-2" /> },
            { to: "/telas", label: "Telas", icon: <FaTshirt className="me-2" /> },
            { to: "/tallas", label: "Tallas", icon: <FaRuler className="me-2" /> },
            { to: "/colores", label: "Colores", icon: <FaPalette className="me-2" /> }
        ]
    },
    {
        title: "Indicadores",
        key: "indicadores",
        icon: <FaChartBar className="me-2" />,
        items: [
            { to: "/mediciondesempeño", label: "Medición y Desempeño", icon: <FaChartBar className="me-2" /> }
        ]
    }
];

const Sidebar = () => {
    const location = useLocation();
    const [open, setOpen] = useState("usuarios");

    const handleToggle = (key) => {
        setOpen(open === key ? null : key);
    };

    return (
        <aside
            className="d-flex flex-column p-3"
            style={{
                width: "250px",
                height: "125dvh",
                background: "linear-gradient(180deg, #1976d2 0%, #64b5f6 100%)",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                color: "#fff"
            }}
        >
            <div className="mb-3 fw-bold fs-5 border-bottom pb-2" style={{color: "#fff", letterSpacing: 2}}>ADMIN</div>
            <nav
                className="flex-grow-1"
                style={{
                    overflowY: "auto",
                    paddingBottom: 10
                }}
            >
                {menuItems.map((group, idx) => (
                    <div key={group.key} className={idx === menuItems.length - 1 ? "" : "mb-2"}>
                        <button
                            className="btn btn-link text-white w-100 d-flex align-items-center justify-content-between px-0"
                            style={{textDecoration: "none", fontWeight: 600, fontSize: 15, opacity: 0.9}}
                            onClick={() => handleToggle(group.key)}
                            tabIndex={0}
                        >
                            <span>{group.icon}{group.title}</span>
                            <span style={{
                                fontSize: 18,
                                transition: "transform 0.2s",
                                transform: open === group.key ? "rotate(90deg)" : "rotate(0deg)"
                            }}></span>
                        </button>
                        <ul
                            className="nav flex-column ps-3"
                            style={{
                                maxHeight: open === group.key ? `${group.items.length * 44}px` : "0",
                                overflow: "hidden",
                                transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)"
                            }}
                        >
                            {group.items.map((item) => (
                                <li className="nav-item mb-1" key={item.to}>
                                    <Link
                                        to={item.to}
                                        className={`nav-link d-flex align-items-center ${location.pathname === item.to ? "active" : "text-white"}`}
                                        style={{
                                            background: location.pathname === item.to ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)",
                                            borderRadius: 8,
                                            fontWeight: 500
                                        }}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
