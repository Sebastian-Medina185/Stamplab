import NavbarComponent from "./NavBarLanding";
import FooterComponent from "./footer";

const MisCotizaciones = () => {
    return (
        <>
            <NavbarComponent />

            <div className="container my-5">
                <h3 className="text-left fw-bold mb-4">Historial Cotizaciones</h3>

                <div className="table-responsive">
                    <table className="table table-bordered text-center shadow-sm align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>ID Cotización</th>
                                <th>Documento</th>
                                <th>Fecha Cotización</th>
                                <th>Dirección</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>001</td>
                                <td>102301</td>
                                <td>10/07/2025</td>
                                <td>CLL45 #32</td>
                                <td>
                                    <span className="badge rounded-pill bg-secondary px-3 py-2">
                                        Pendiente
                                    </span>
                                </td>
                                <td style={{ cursor: "pointer" }}>👁️</td>
                            </tr>
                            <tr>
                                <td>002</td>
                                <td>102301</td>
                                <td>10/07/2025</td>
                                <td>CLL45 #32</td>
                                <td>
                                    <span className="badge rounded-pill bg-secondary px-3 py-2">
                                        Pendiente
                                    </span>
                                </td>
                                <td style={{ cursor: "pointer" }}>👁️</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <FooterComponent />
        </>
    );
};

export default MisCotizaciones;
