import { Outlet } from "react-router-dom";
import Sidebar from "../dashboard/layout/sidebar";
import NavAdmin from "../dashboard/layout/NavAdmin";
import StockNotificationBanner from "../../pages/StockAlerts";

const DashboardLayout = () => {
    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                {/* Columna izquierda: Sidebar */}
                <aside className="col-2 text-white p-0">
                    <Sidebar />
                </aside>

                {/* Columna derecha: Nav arriba y contenido abajo */}
                <div className="col-10 d-flex flex-column p-0">
                    {/* Navbar arriba */}
                    <header className="">
                        <NavAdmin />
                    </header>

                    {/* Contenido debajo del Navbar */}
                    <main className="flex-grow-1 p-4 bg-light overflow-auto">
                        <Outlet />
                    </main>

                    {/* Componente de alertas flotante */}
                    <StockNotificationBanner />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
