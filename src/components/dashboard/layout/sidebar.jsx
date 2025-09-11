import {
    FaUsers, FaClipboardList, FaBox, FaTshirt, FaPalette,
    FaRuler, FaChartBar, FaCogs, FaUserCog, FaTools,
    FaShoppingCart, FaWarehouse, FaChartLine, FaBars
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const menuItems = [
    {
        title: "Configuración",
        key: "roles",
        icon: <FaCogs className="me-2" />,
        items: [
            { to: "/roles", label: "Roles", icon: <FaClipboardList className="me-2" /> }
        ]
    },
    {
        title: "Gestión de Usuarios",
        key: "usuarios",
        icon: <FaUserCog className="me-2" />,
        items: [
            { to: "/usuarios", label: "Usuarios", icon: <FaUsers className="me-2" /> },
        ]
    },
    {
        title: "Servicios",
        key: "tecnicas",
        icon: <FaTools className="me-2" />,
        items: [
            { to: "/tecnicas", label: "Técnicas", icon: <FaTools className="me-2" /> },
        ]
    },
    {
        title: "Ventas",
        key: "ventas",
        icon: <FaShoppingCart className="me-2" />,
        items: [
            { to: "/cotizaciones", label: "Cotizaciones", icon: <FaClipboardList className="me-2" /> },
            { to: "/productos", label: "Productos", icon: <FaBox className="me-2" /> },
        ]
    },
    {
        title: "Características Producto",
        key: "caracteristicasproducto",
        icon: <FaTshirt className="me-2" />,
        items: [
            { to: "/telas", label: "Telas", icon: <FaTshirt className="me-2" /> },
            { to: "/tallas", label: "Tallas", icon: <FaRuler className="me-2" /> },
            { to: "/colores", label: "Colores", icon: <FaPalette className="me-2" /> }
        ]
    },
    {
        title: "Administración Insumos",
        key: "insumos",
        icon: <FaBox className="me-2" />,
        items: [
            { to: "/insumos", label: "Insumos", icon: <FaBox className="me-2" /> },
        ]
    },
    {
        title: "Proceso Compras",
        key: "procesocompras",
        icon: <FaWarehouse className="me-2" />,
        items: [
            { to: "/pedidos", label: "Pedidos", icon: <FaClipboardList className="me-2" /> },
            { to: "/proveedores", label: "Proveedores", icon: <FaWarehouse className="me-2" /> }
        ]
    },
    {
        title: "Indicadores",
        key: "indicadores",
        icon: <FaChartBar className="me-2" />,
        items: [
            { to: "/mediciondesempeño", label: "Medición y Desempeño", icon: <FaChartLine className="me-2" /> }
        ]
    }
];

const Sidebar = () => {
    const location = useLocation();
    const [open, setOpen] = useState("usuarios");
    const [collapsed, setCollapsed] = useState(false);

    const handleToggle = (key) => {
        setOpen(open === key ? null : key);
    };

    return (
        <aside
            className="d-flex flex-column p-3"
            style={{
                width: collapsed ? "80px" : "250px",
                transition: "width 0.3s ease",
                height: "100vh",
                background: "linear-gradient(180deg, #1976d2 0%, #64b5f6 100%)",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                color: "#fff",
                overflow: "hidden"
            }}
        >
            {/* Header con ADMIN + botón */}
            <div
                className="d-flex align-items-center mb-3"
                style={{
                    borderBottom: "2px solid rgba(255,255,255,0.3)",
                    paddingBottom: "8px"
                }}
            >
                {!collapsed && (
                    <span
                        className="fw-bold fs-5 flex-grow-1"
                        style={{
                            color: "#fff",
                            letterSpacing: 2
                        }}
                    >
                        ADMIN
                    </span>
                )}

                <div
                    className={collapsed ? "w-100 d-flex justify-content-center" : ""}
                >
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="btn btn-link"
                        style={{
                            color: "#fff",
                            fontSize: "24px",
                            fontWeight: "bold",
                            transition: "transform 0.2s",
                            padding: collapsed ? "6px 10px" : "0"
                        }}
                    >
                        <FaBars className="me-4"/>
                    </button>
                </div>
            </div>



            {/* Menú */}
            <nav className="flex-grow-1" style={{ overflowY: "auto" }}>
                {menuItems.map((group, idx) => (
                    <div key={group.key} className={idx === menuItems.length - 1 ? "" : "mb-2"}>
                        <button
                            className="btn btn-link text-white w-100 d-flex align-items-center justify-content-between px-0"
                            style={{
                                textDecoration: "none",
                                fontWeight: 600,
                                fontSize: 15,
                                opacity: 0.9
                            }}
                            onClick={() => handleToggle(group.key)}
                            tabIndex={0}
                        >
                            <span className="d-flex align-items-center">
                                {group.icon}
                                {!collapsed && group.title}
                            </span>
                            {!collapsed && (
                                <span
                                    style={{
                                        fontSize: 18,
                                        transition: "transform 0.2s",
                                        transform: open === group.key ? "rotate(90deg)" : "rotate(0deg)"
                                    }}
                                ></span>
                            )}
                        </button>

                        {/* Submenú */}
                        {!collapsed && (
                            <ul
                                className="nav flex-column ps-3"
                                style={{
                                    maxHeight: open === group.key ? `${group.items.length * 65}px` : "0",
                                    overflow: "hidden",
                                    transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1)"
                                }}
                            >
                                {group.items.map((item) => (
                                    <li className="nav-item mb-1" key={item.to}>
                                        <Link
                                            to={item.to}
                                            className={`nav-link d-flex align-items-center ${location.pathname === item.to ? "active" : "text-white"
                                                }`}
                                            style={{
                                                background:
                                                    location.pathname === item.to
                                                        ? "rgba(255,255,255,0.18)"
                                                        : "rgba(255,255,255,0.05)",
                                                borderRadius: 8,
                                                fontWeight: 500
                                            }}
                                        >
                                            {item.icon}
                                            {!collapsed && item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
