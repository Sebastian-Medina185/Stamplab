import { Outlet } from "react-router-dom";
import Sidebar from "../dashboard/layout/sidebar";
import NavAdmin from "../dashboard/layout/NavAdmin";



const DashboardLayout = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            <div className="flex flex-col flex-1">
                {/* Navbar */}
                <NavAdmin />

                {/* Aquí se renderizan las páginas */}
                <main className="p-6 bg-gray-100 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
