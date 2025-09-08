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
        <Container fluid className="py-4">
            {/* Filtros */}
            <Row className="mb-4 justify-content-center gap-3">
                <Col md="auto">
                    <Form.Select>
                        <option>Mes..</option>
                        <option>Enero</option>
                        <option>Febrero</option>
                        <option>Marzo</option>
                    </Form.Select>
                </Col>
                <Col md="auto">
                    <Form.Select>
                        <option>Tecnica</option>
                        <option>Serigrafía</option>
                        <option>Bordado</option>
                        <option>Sublimación</option>
                    </Form.Select>
                </Col>
                <Col md="auto">
                    <Form.Select>
                        <option>Tipo de prenda</option>
                        <option>Camiseta</option>
                        <option>Buzo</option>
                        <option>Pantalón</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Gráficas */}
            <Row className="g-4">
                <Col md={6}>
                    <h6 className="fw-bold text-center">Ventas Por Tecnicas</h6>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={ventasPorTecnicas}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="ventas" fill="#28a745" />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>

                <Col md={6}>
                    <h6 className="fw-bold text-center">Productos Mas vendidos</h6>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={productosMasVendidos}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="cantidad" fill="#6f42c1" />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col md={6}>
                    <h6 className="fw-bold text-center">Insumos mas utilizados</h6>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={insumosUtilizados}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="cantidad" fill="#0d6efd" />
                        </BarChart>
                    </ResponsiveContainer>
                </Col>
                <Col md={6} className="d-flex align-items-center justify-content-center">
                    <Button variant="danger" size="lg">
                        Exportar a PDF
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardMedicionesempeño;
