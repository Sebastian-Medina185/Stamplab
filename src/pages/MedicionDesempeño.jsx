import { Container, Row, Col, Button, Form } from "react-bootstrap";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { FaFilePdf } from "react-icons/fa";

const DashboardMedicionesempeño = () => {
    // Datos simulados
    const ventasPorTecnicas = [
        { mes: "Ene", ventas: 23 },
        { mes: "Feb", ventas: 20 },
        { mes: "Mar", ventas: 18 },
        { mes: "Abr", ventas: 15 },
        { mes: "May", ventas: 16 },
        { mes: "Jun", ventas: 18 },
        { mes: "Jul", ventas: 12 },
        { mes: "Ago", ventas: 5 },
        { mes: "Sep", ventas: 12 },
        { mes: "Oct", ventas: 17 },
        { mes: "Nov", ventas: 24 },
        { mes: "Dic", ventas: 17 },
    ];

    const productosMasVendidos = [
        { mes: "Ene", cantidad: 5 },
        { mes: "Feb", cantidad: 7 },
        { mes: "Mar", cantidad: 13 },
        { mes: "Abr", cantidad: 8 },
        { mes: "May", cantidad: 17 },
        { mes: "Jun", cantidad: 13 },
        { mes: "Jul", cantidad: 12 },
        { mes: "Ago", cantidad: 11 },
        { mes: "Sep", cantidad: 2 },
        { mes: "Oct", cantidad: 4 },
        { mes: "Nov", cantidad: 3 },
        { mes: "Dic", cantidad: 3 },
    ];

    const insumosUtilizados = [
        { mes: "Ene", cantidad: 2 },
        { mes: "Feb", cantidad: 5 },
        { mes: "Mar", cantidad: 13 },
        { mes: "Abr", cantidad: 5 },
        { mes: "May", cantidad: 5 },
        { mes: "Jun", cantidad: 11 },
        { mes: "Jul", cantidad: 12 },
        { mes: "Ago", cantidad: 11 },
        { mes: "Sep", cantidad: 2 },
        { mes: "Oct", cantidad: 4 },
        { mes: "Nov", cantidad: 2 },
        { mes: "Dic", cantidad: 3 },
    ];

    return (
        <div
            className="d-flex flex-column"
            style={{
                minHeight: "100dvh",
                background: "linear-gradient(135deg, #ffffffff 0%, #fafcff 100%)",
                padding: "20px 30px",
                fontSize: "0.85rem",
            }}
        >
            {/* Filtros y botón PDF */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div className="d-flex gap-2 flex-wrap">
                    <Form.Select size="sm">
                        <option>Mes..</option>
                        <option>Enero</option>
                        <option>Febrero</option>
                        <option>Marzo</option>
                    </Form.Select>
                    <Form.Select size="sm">
                        <option>Técnica</option>
                        <option>Serigrafía</option>
                        <option>Bordado</option>
                        <option>Sublimación</option>
                    </Form.Select>
                    <Form.Select size="sm">
                        <option>Tipo de prenda</option>
                        <option>Camiseta</option>
                        <option>Buzo</option>
                        <option>Pantalón</option>
                    </Form.Select>
                </div>
                <Button
                    variant="danger"
                    size="sm"
                    className="d-flex align-items-center gap-2 shadow-sm"
                >
                    <FaFilePdf size={14} />
                    Exportar PDF
                </Button>
            </div>

            {/* Gráficas */}
            <Row className="g-4">
                <Col md={6}>
                    <div className="rounded-4 shadow-sm bg-white p-3">
                        <h6 className="fw-bold text-center mb-2">Ventas por Técnicas</h6>
                        <ResponsiveContainer width="100%" height={230}>
                            <BarChart data={ventasPorTecnicas}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="ventas" fill="#28a745" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>

                <Col md={6}>
                    <div className="rounded-4 shadow-sm bg-white p-3">
                        <h6 className="fw-bold text-center mb-2">Productos más vendidos</h6>
                        <ResponsiveContainer width="100%" height={230}>
                            <BarChart data={productosMasVendidos}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="cantidad" fill="#6f42c1" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>

            <Row className="g-4 mt-2">
                <Col md={6}>
                    <div className="rounded-4 shadow-sm bg-white p-3">
                        <h6 className="fw-bold text-center mb-2">Insumos más utilizados</h6>
                        <ResponsiveContainer width="100%" height={230}>
                            <BarChart data={insumosUtilizados}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="cantidad" fill="#0d6efd" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardMedicionesempeño;
