// src/pages/Ventas.jsx
import React, { useState } from "react";
import { Table, Button, Form, InputGroup, Badge } from "react-bootstrap";
import { Eye, Pencil, Trash2, PlusCircle, Search, ToggleLeft, ToggleRight } from "lucide-react";
import NuevaVenta from "./formularios_dash/NuevaVenta";

const Ventas = () => {
    const [showForm, setShowForm] = useState(false);
    const [ventaEdit, setVentaEdit] = useState(null);

    const handleCloseForm = () => {
        setShowForm(false);
        setVentaEdit(null);
    };

    const handleEdit = (venta) => {
        setVentaEdit(venta);
        setShowForm(true);
    };

    // Si showForm es true, mostrar solo el formulario
    if (showForm) {
        return (
            <NuevaVenta
                onClose={handleCloseForm}
                ventaEdit={ventaEdit}
            />
        );
    }

    // Si showForm es false, mostrar la tabla
    return (
        <div className="container mt-4">
            <h4 className="text-primary fw-bold mb-4 text-center">
                GESTIÓN DE VENTAS
            </h4>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <Button
                    variant="primary"
                    className="d-flex align-items-center gap-2"
                    onClick={() => {
                        setVentaEdit(null);
                        setShowForm(true);
                    }}
                >
                    <PlusCircle size={18} /> Agregar Venta
                </Button>

                <InputGroup style={{ width: "300px" }}>
                    <InputGroup.Text>
                        <Search size={16} />
                    </InputGroup.Text>
                    <Form.Control placeholder="Filtrar por documento o ID..." />
                </InputGroup>
            </div>

            <Table striped bordered hover responsive className="text-center">
                <thead className="table-primary">
                    <tr>
                        <th>ID</th>
                        <th>DocumentoID</th>
                        <th>Fecha Venta</th>
                        <th>Subtotal</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>DOC123</td>
                        <td>01/11/2025</td>
                        <td>$500,000</td>
                        <td className="fw-bold">$600,000</td>
                        <td>
                            <Badge bg="success">Activa</Badge>
                        </td>
                        <td>
                            <div className="d-flex justify-content-center gap-2">
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    title="Ver detalle"
                                >
                                    <Eye size={16} />
                                </Button>
                                <Button
                                    variant="outline-warning"
                                    size="sm"
                                    title="Editar"
                                    onClick={() => handleEdit({
                                        VentaID: 1,
                                        DocumentoID: "DOC123",
                                        FechaVenta: "2025-11-01",
                                        Subtotal: 500000,
                                        Total: 600000,
                                        Estado: true
                                    })}
                                >
                                    <Pencil size={16} />
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    title="Desactivar"
                                >
                                    <ToggleRight size={16} />
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    title="Eliminar"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </Table>

            <div className="text-center text-muted mt-4">
                <p>No se encontraron ventas</p>
            </div>
        </div>
    );
};

export default Ventas;