import React, { useEffect, useState } from "react";
import { Table, Button, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Eye, Pencil, Trash2, PlusCircle, Search } from "lucide-react";
import axios from "axios";

const Cotizaciones = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [filtro, setFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    obtenerCotizaciones();
  }, []);

  const obtenerCotizaciones = async () => {
    try {
      const respuesta = await axios.get("http://localhost:3001/cotizaciones");
      if (respuesta.data.estado) {
        setCotizaciones(respuesta.data.datos);
      }
    } catch (error) {
      console.error("Error al obtener cotizaciones:", error);
    }
  };

  const eliminarCotizacion = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta cotización?")) return;
    try {
      await axios.delete(`http://localhost:3001/cotizaciones/${id}`);
      obtenerCotizaciones();
    } catch (error) {
      console.error("Error al eliminar cotización:", error);
    }
  };

  const cotizacionesFiltradas = cotizaciones.filter((c) =>
    c.DocumentoID.toString().toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h4 className="text-primary fw-bold mb-4 text-center">
        GESTIÓN DE COTIZACIÓN
      </h4>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2"
          onClick={() => navigate("/dashboard/cotizaciones/nueva")}
        >
          <PlusCircle size={18} /> Agregar Cotización
        </Button>

        <InputGroup style={{ width: "300px" }}>
          <InputGroup.Text>
            <Search size={16} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Filtrar por documento..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </InputGroup>
      </div>

      <Table striped bordered hover responsive className="text-center">
        <thead className="table-primary">
          <tr>
            <th>ID</th>
            <th>DocumentoID</th>
            <th>Correo</th>
            <th>Total</th>
            <th>Teléfono</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cotizacionesFiltradas.map((cotizacion) => (
            <tr key={cotizacion.CotizacionID}>
              <td>{cotizacion.CotizacionID}</td>
              <td>{cotizacion.DocumentoID}</td>
              <td>{cotizacion.Correo || "Carlos@gmail"}</td>
              <td>{cotizacion.ValorTotal?.toLocaleString()}</td>
              <td>{cotizacion.Telefono || "31065219289"}</td>
              <td>
                {new Date(cotizacion.FechaCotizacion).toLocaleDateString()}
              </td>
              <td>
                <span
                  className={`badge ${
                    cotizacion.Estado === "confirmada"
                      ? "bg-success"
                      : cotizacion.Estado === "pendiente"
                      ? "bg-warning"
                      : "bg-secondary"
                  }`}
                >
                  {cotizacion.Estado}
                </span>
              </td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/dashboard/adetalleCotizacion/${cotizacion.CotizacionID}`)
                    }
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={() =>
                      navigate(`/dashboard/editarCotizacion/${cotizacion.CotizacionID}`)
                    }
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() =>
                      eliminarCotizacion(cotizacion.CotizacionID)
                    }
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Cotizaciones;
