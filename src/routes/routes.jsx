import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Cotizaciones from "../pages/Cotizaciones";
import Roles from "../pages/Roles";
import Telas from "../pages/Telas";
import Insumos from "../pages/Insumos";
import Pedidos from "../pages/Pedidos";
import Productos from "../pages/Productos";
import Colores from "../pages/Colores";
import Tallas from "../pages/Tallas";
import Usuarios from "../pages/Usuarios";
import Proveedores from "../pages/Proveedores";
import Tecnicas from "../pages/Tecnicas";
import Home from "../components/landing/landingPage";
import Servicios from "../components/landing/Servicios";
import ProductosLanding from "../components/landing/Productos";
import CotizacionesLanding from "../components/landing/CotizacionesL";
import RegistroLanding from "../components/auth/Registro";
import LoginLanding from "../components/auth/Login";
import RestablecerContraseña from "../components/auth/Restablecercontraseña";
import RecuperarContraseña from "../components/auth/Recuperarcontraseña";
import DashboardMedicionesempeño from "../pages/MedicionDesempeño";
import EditarPerfil from "../components/landing/EditarPerfil";
import MisCotizaciones from "../components/landing/Miscotizaciones";
import FormularioCompra from "../components/landing/FormularioCompra";
import AgregarProducto from "../pages/formularios_dash/AgregarProducto";
import NuevaCotizacion from "../pages/formularios_dash/NuevaCotizacion";


const AppRoutes = () => {

    return (

        <Routes>
            {/* Ruta raíz redirige al registro */}
            <Route path="/" element={<RegistroLanding />} />
            
            <Route path="/landing" element={<Home />} />
            <Route path="/cotizacionesLanding" element={<CotizacionesLanding />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/productosLanding" element={<ProductosLanding />} />
            <Route path="/signup" element={<RegistroLanding />} />
            <Route path="/login" element={<LoginLanding />} />
            <Route path="/recuperarcontraseña" element={<RecuperarContraseña />} />
            <Route path="/restablecercontraseña" element={<RestablecerContraseña />} />
            <Route path="/editarperfil" element={<EditarPerfil />} />
            <Route path="/miscotizaciones" element={<MisCotizaciones />} />
            <Route path="/formularioCompra" element={<FormularioCompra />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardMedicionesempeño />} />
                <Route path="cotizaciones" element={<Cotizaciones />} />
                <Route path="cotizaciones/nueva" element={<NuevaCotizacion />} />
                <Route path="roles" element={<Roles />} />
                <Route path="telas" element={<Telas />} />
                <Route path="insumos" element={<Insumos />} />
                <Route path="pedidos" element={<Pedidos />} />
                <Route path="productos" element={<Productos />} />
                <Route path="agregar-producto" element={<AgregarProducto />} />
                <Route path="colores" element={<Colores />} />
                <Route path="tallas" element={<Tallas />} />
                <Route path="usuarios" element={<Usuarios />} />
                <Route path="proveedores" element={<Proveedores />} />
                <Route path="tecnicas" element={<Tecnicas />} />
                <Route path="mediciondesempeño" element={<DashboardMedicionesempeño />} />
            </Route>

        </Routes>

    );
};

export default AppRoutes;
