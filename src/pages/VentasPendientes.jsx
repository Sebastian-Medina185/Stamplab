import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Modal, Form, Alert, InputGroup } from 'react-bootstrap';
import { Eye, CheckCircle, XCircle, Search, Clock } from 'lucide-react';

const VentasPendientes = () => {
  const [ventasPendientes, setVentasPendientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });
  const [busqueda, setBusqueda] = useState('');

  // Cargar ventas pendientes
  useEffect(() => {
    cargarVentasPendientes();
  }, []);

  const cargarVentasPendientes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/ventas');
      const data = await response.json();
      
      // Filtrar solo las ventas pendientes (Estado === "Pendiente" o Estado === true)
      const pendientes = data.filter(venta => 
        venta.Estado === 'Pendiente' || venta.Estado === true
      );
      setVentasPendientes(pendientes);
    } catch (error) {
      console.error('Error al cargar ventas pendientes:', error);
      setMensaje({ tipo: 'danger', texto: 'Error al cargar las ventas pendientes' });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalCambiarEstado = (venta) => {
    setVentaSeleccionada(venta);
    setShowModal(true);
  };

  const cambiarEstadoVenta = async () => {
    if (!nuevoEstado) {
      setMensaje({ tipo: 'warning', texto: 'Por favor selecciona un estado' });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/ventas/${ventaSeleccionada.VentaID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Estado: nuevoEstado
        })
      });

      if (response.ok) {
        setMensaje({ 
          tipo: 'success', 
          texto: `Venta ${ventaSeleccionada.VentaID} cambiada a estado: ${nuevoEstado}` 
        });
        
        // Remover la venta de la lista de pendientes
        setVentasPendientes(prev => 
          prev.filter(v => v.VentaID !== ventaSeleccionada.VentaID)
        );
        
        cerrarModal();
        
        // Auto-ocultar mensaje después de 3 segundos
        setTimeout(() => setMensaje({ tipo: '', texto: '' }), 3000);
      } else {
        throw new Error('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje({ tipo: 'danger', texto: 'Error al cambiar el estado de la venta' });
    } finally {
      setLoading(false);
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setVentaSeleccionada(null);
    setNuevoEstado('');
  };

  const ventasFiltradas = ventasPendientes.filter(venta => 
    venta.DocumentoID?.toLowerCase().includes(busqueda.toLowerCase()) ||
    venta.VentaID?.toString().includes(busqueda)
  );

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-center mb-4">
        <Clock size={32} className="text-warning me-2" />
        <h4 className="text-warning fw-bold mb-0">
          VENTAS PENDIENTES
        </h4>
      </div>

      {mensaje.texto && (
        <Alert variant={mensaje.tipo} dismissible onClose={() => setMensaje({ tipo: '', texto: '' })}>
          {mensaje.texto}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Badge bg="warning" text="dark" className="fs-6 px-3 py-2">
          {ventasPendientes.length} ventas pendientes
        </Badge>

        <InputGroup style={{ width: '300px' }}>
          <InputGroup.Text>
            <Search size={16} />
          </InputGroup.Text>
          <Form.Control 
            placeholder="Buscar por ID o documento..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </InputGroup>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : ventasFiltradas.length === 0 ? (
        <div className="text-center py-5">
          <Clock size={64} className="text-muted mb-3" />
          <h5 className="text-muted">No hay ventas pendientes</h5>
          <p className="text-muted">Todas las ventas han sido procesadas</p>
        </div>
      ) : (
        <Table striped bordered hover responsive className="text-center">
          <thead className="table-warning">
            <tr>
              <th>ID</th>
              <th>DocumentoID</th>
              <th>Fecha Venta</th>
              <th>Cliente</th>
              <th>Subtotal</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.map((venta) => (
              <tr key={venta.VentaID}>
                <td>{venta.VentaID}</td>
                <td className="fw-bold">{venta.DocumentoID}</td>
                <td>{formatearFecha(venta.FechaVenta)}</td>
                <td>
                  {venta.usuario ? 
                    `${venta.usuario.Nombre} ${venta.usuario.Apellido}` : 
                    'Sin cliente'
                  }
                </td>
                <td>{formatearPrecio(venta.Subtotal)}</td>
                <td className="fw-bold">{formatearPrecio(venta.Total)}</td>
                <td>
                  <Badge bg="warning" text="dark">
                    <Clock size={14} className="me-1" />
                    Pendiente
                  </Badge>
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
                      variant="outline-success"
                      size="sm"
                      title="Cambiar estado"
                      onClick={() => abrirModalCambiarEstado(venta)}
                    >
                      <CheckCircle size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal para cambiar estado */}
      <Modal show={showModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>
            <CheckCircle className="me-2" size={24} />
            Cambiar Estado de Venta
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ventaSeleccionada && (
            <>
              <div className="mb-3 p-3 bg-light rounded">
                <p className="mb-2">
                  <strong>ID Venta:</strong> {ventaSeleccionada.VentaID}
                </p>
                <p className="mb-2">
                  <strong>Documento:</strong> {ventaSeleccionada.DocumentoID}
                </p>
                <p className="mb-0">
                  <strong>Total:</strong> {formatearPrecio(ventaSeleccionada.Total)}
                </p>
              </div>

              <Form.Group>
                <Form.Label className="fw-bold">Nuevo Estado *</Form.Label>
                <Form.Select
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                >
                  <option value="">Seleccione el nuevo estado...</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Completada">Completada</option>
                  <option value="Entregada">Entregada</option>
                  <option value="Cancelada">Cancelada</option>
                </Form.Select>
              </Form.Group>

              <Alert variant="info" className="mt-3 mb-0">
                <small>
                  <strong>Nota:</strong> Al cambiar el estado, esta venta se moverá 
                  al módulo principal de ventas y desaparecerá de la lista de pendientes.
                </small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button 
            variant="success" 
            onClick={cambiarEstadoVenta}
            disabled={loading || !nuevoEstado}
          >
            {loading ? 'Procesando...' : 'Confirmar Cambio'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VentasPendientes;