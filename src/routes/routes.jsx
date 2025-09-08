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


const AppRoutes = () => {

    return (

        <Routes>

            <Route path="/landing" element={<Home></Home>}></Route>
            <Route path="/cotizacionesLanding" element={<CotizacionesLanding></CotizacionesLanding>}></Route>
            <Route path="/servicios" element={<Servicios></Servicios>}></Route>
            <Route path="/productosLanding" element={<ProductosLanding></ProductosLanding>}></Route>
            <Route path="/signup" element={<RegistroLanding></RegistroLanding>}></Route>
            <Route path="/login" element={<LoginLanding></LoginLanding>}></Route>
            <Route path="/recuperarcontraseña" element={<RecuperarContraseña></RecuperarContraseña>}></Route>
            <Route path="/restablecercontraseña" element={<RestablecerContraseña></RestablecerContraseña>}></Route>
            <Route path="/editarperfil" element={<EditarPerfil></EditarPerfil>}></Route>
            <Route path="/miscotizaciones" element={<MisCotizaciones></MisCotizaciones>}></Route>

            <Route path="/" element={<DashboardLayout />}>
                <Route path="/cotizaciones" element={<Cotizaciones />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/telas" element={<Telas />} />
                <Route path="/insumos" element={<Insumos />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/colores" element={<Colores />} />
                <Route path="/tallas" element={<Tallas />} />
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/proveedores" element={<Proveedores />} />
                <Route path="/tecnicas" element={<Tecnicas />} />
                <Route path="/mediciondesempeño" element={<DashboardMedicionesempeño></DashboardMedicionesempeño>} />
            </Route>

        </Routes>

    );
};

export default AppRoutes;
