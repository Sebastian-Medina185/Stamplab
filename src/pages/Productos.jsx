import React, { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import { FaPlusCircle, FaSearch, FaTimes, FaEye, FaEdit, FaTrash } from "react-icons/fa";


import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../Services/api-productos/productos";

import {
  getVariantesByProducto,
  createVariante,
  updateVariante,
  deleteVariante,
} from "../Services/api-productos/variantes";

import { getTelas, getTallas, getColores } from "../Services/api-productos/atributos";

const Productos = () => {
  // listas de atributos
  const [telas, setTelas] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [colores, setColores] = useState([]);

  // productos y producto en formulario
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState({
    Nombre: "",
    Descripcion: "",
    TelaID: "",
  });

  // producto creado / seleccionado (contiene el id devuelto por backend)
  const [productoCreado, setProductoCreado] = useState(null);

  // variante actual (formulario) y lista local de variantes
  const [variante, setVariante] = useState({
    ColorID: "",
    TallaID: "",
    Stock: "",
    Imagen: "",
    Precio: "",
    Estado: true,
  });
  const [variantesList, setVariantesList] = useState([]);

  // modal ver variantes
  const [showModal, setShowModal] = useState(false);
  const [modalProducto, setModalProducto] = useState(null); // producto para ver variantes

  // editar estado de variante (si se está editando una existente)
  const [editandoVariante, setEditandoVariante] = useState(null);

  // buscar producto
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    cargarListas();
    cargarProductos();
  }, []);

  const cargarListas = async () => {
    try {
      const telasRes = await getTelas();
      setTelas(Array.isArray(telasRes.datos) ? telasRes.datos : telasRes);

      const tallasRes = await getTallas();
      setTallas(Array.isArray(tallasRes.datos) ? tallasRes.datos : tallasRes);

      const coloresRes = await getColores();
      setColores(Array.isArray(coloresRes.datos) ? coloresRes.datos : coloresRes);
    } catch (err) {
      console.error("Error cargando listas:", err);
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await getProductos();
      // backend devuelve { estado, mensaje, datos: [...] } según muestras
      const lista = Array.isArray(res.datos) ? res.datos : res;
      setProductos(lista);
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  };

  // handlers producto
  const handleProductoChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (!producto.Nombre || !producto.Descripcion || !producto.TelaID) {
      Swal.fire("Completa los campos", "Nombre, descripción y tela son obligatorios", "warning");
      return;
    }

    try {
      const productoData = {
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        TelaID: parseInt(producto.TelaID, 10),
      };

      if (productoCreado?.ProductoID) {
        // Actualizar producto existente
        await updateProducto(productoCreado.ProductoID, productoData);
        setProductoCreado({
          ...productoCreado,
          ...productoData,
          Tela: telas.find(t => t.TelaID == productoData.TelaID)?.Nombre
        });
        Swal.fire("Actualizado", "Producto actualizado correctamente", "success");
      } else {
        // Crear nuevo producto
        const response = await createProducto(productoData);
        const nuevoProducto = response?.datos || response;
        
        // Establecer el producto creado manteniendo el nombre
        setProductoCreado({
          ...nuevoProducto,
          Nombre: productoData.Nombre,
          isNew: true
        });
        
        // Limpiar el formulario y el estado de edición
        setProducto({
          Nombre: "",
          Descripcion: "",
          TelaID: "",
        });
        setEditandoVariante(null); // Asegurar que no estamos en modo edición
        
        Swal.fire("Creado", "Producto creado correctamente. Ahora puedes agregar variantes.", "success");
      }

      // Recargar la lista de productos
      cargarProductos();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      Swal.fire("Error", err?.response?.data?.mensaje || "Error al guardar producto", "error");
    }
  };

  // // seleccionar un producto para editar (cargar en formulario)
  // const editarProducto = (p) => {
  //   // p proviene de la lista de productos que trae el backend (tiene ProductoID, Nombre, Descripcion, Tela)
  //   setProducto({
  //     Nombre: p.Nombre || "",
  //     Descripcion: p.Descripcion || "",
  //     TelaID: p.TelaID || p.TelaID || "",
  //   });
  //   // marcar como creado para abrir sección variantes y permitir actualizar si se quiere
  //   setProductoCreado(p);
  //   // cargar variantes actuales de ese producto
  //   cargarVariantes(p.ProductoID || p.ProductoID || p.id);
  // };

  const editarProducto = (p) => {
    // Configurar el producto en el formulario
    setProducto({
      Nombre: p.Nombre,
      Descripcion: p.Descripcion,
      TelaID: p.TelaID?.toString() || "",
    });

    // Marcar el producto como seleccionado/creado
    setProductoCreado(p);

    // Mostrar el formulario
    setShowForm(true);

    // Cargar las variantes del producto
    cargarVariantes(p.ProductoID || p.id);
  };

  const eliminarProducto = async (p) => {
    const id = p.ProductoID || p.id;
    const confirm = await Swal.fire({
      title: "Eliminar producto",
      text: `¿Eliminar ${p.Nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (!confirm.isConfirmed) return;
    // Esto también eliminará sus variantes.

    try {
      await deleteProducto(id);
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
      cargarProductos();
      // limpiar si estamos viendo/creando ese producto
      if (productoCreado && (productoCreado.ProductoID === id || productoCreado.id === id)) {
        setProductoCreado(null);
        setVariantesList([]);
      }
    } catch (err) {
      console.error("Error eliminar producto:", err);
      Swal.fire("Error", "No se pudo eliminar producto porque tiene variantes asociadas.", "error");
    }
  };

  // VARIANTES: carga las variantes del producto (para modal o para la sección de agregar)
  const cargarVariantes = async (productoID) => {
    if (!productoID) return;
    try {
      const res = await getVariantesByProducto(productoID);
      // tu endpoint devuelve array simple (según tu backend router.get -> res.recordset)
      const datos = Array.isArray(res) ? res : res.datos ? res.datos : res.data ? res.data : [];
      setVariantesList(datos);
    } catch (err) {
      console.error("Error cargando variantes:", err);
      setVariantesList([]);
    }
  };

  // handler cambios variante
  const handleVarianteChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVariante({
      ...variante,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // agregar o actualizar variante
  const guardarVariante = async (e) => {
    e.preventDefault();

    if (!productoCreado?.ProductoID && !productoCreado?.id) {
      Swal.fire("Error", "No hay producto seleccionado", "error");
      return;
    }

    // Validamos todos los campos requeridos
    if (!variante.ColorID || !variante.TallaID || !variante.Stock || !variante.Precio) {
      Swal.fire("Error", "Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      const payload = {
        ProductoID: parseInt(productoCreado.ProductoID || productoCreado.id),
        ColorID: parseInt(variante.ColorID),
        TallaID: parseInt(variante.TallaID),
        Stock: parseInt(variante.Stock),
        Precio: parseFloat(variante.Precio),
        Imagen: variante.Imagen || "",
        Estado: variante.Estado ? 1 : 0  // Convertir booleano a 1/0
      };

      if (editandoVariante) {
        // Incluir el ID de la variante en el payload para actualización
        const varianteId = editandoVariante.VarianteID || editandoVariante.id;

        // Log para debugging
        console.log('Actualizando variante:', varianteId, payload);

        await updateVariante(varianteId, {
          ...payload,
          VarianteID: varianteId  // Incluir el ID en el payload
        });

        Swal.fire("Éxito", "Variante actualizada correctamente", "success");
        setEditandoVariante(null);
      } else {
        await createVariante(payload);
        Swal.fire("Éxito", "Variante creada correctamente", "success");
      }

      // Limpiar formulario
      setVariante({
        ColorID: "",
        TallaID: "",
        Stock: "",
        Imagen: "",
        Precio: "",
        Estado: true
      });

      // Recargar variantes
      await cargarVariantes(productoCreado.ProductoID || productoCreado.id);
    } catch (err) {
      console.error("Error al guardar variante:", err);
      const errorMsg = err.response?.data?.mensaje ||
        err.response?.data?.error ||
        "Error al guardar la variante";
      Swal.fire("Error", errorMsg, "error");
    }
  };

  // abrir modal ver variantes
  const handleVer = async (p) => {
    const id = p.ProductoID || p.id;
    setModalProducto(p);
    setShowModal(true);
    await cargarVariantes(id);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setModalProducto(null);
    setVariantesList([]);
  };

  // eliminar variante
  const handleEliminarVariante = async (v) => {
    const id = v.VarianteID || v.VarianteId || v.id;
    const confirm = await Swal.fire({
      title: "Eliminar variante",
      text: "¿Eliminar esta variante?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    
    if (!confirm.isConfirmed) return;
    
    try {
      await deleteVariante(id);
      Swal.fire("Eliminada", "Variante eliminada", "success");
      
      // Recargar variantes tanto en el modal como en el formulario
      const prodId = modalProducto?.ProductoID || modalProducto?.id || 
                    productoCreado?.ProductoID || productoCreado?.id;
                    
      if (prodId) {
        await cargarVariantes(prodId);
      }
    } catch (err) {
      console.error("Error eliminar variante:", err);
      Swal.fire("Error", "No se pudo eliminar variante", "error");
    }
  };

  // editar variante: cargar en formulario y marcar editando
  const handleEditarVariante = (v) => {
    setEditandoVariante(v);
    // Asegurarse de que el producto está seleccionado
    setProductoCreado(modalProducto || productoCreado);
    setVariante({
      ColorID: (v.ColorID || v.Color_ID)?.toString() || "",
      TallaID: (v.TallaID || v.Talla_ID)?.toString() || "",
      Stock: v.Stock?.toString() || "",
      Precio: v.Precio?.toString() || "",
      Imagen: v.Imagen || "",
      Estado: v.Estado === 1 || v.Estado === true
    });

    // scroll up to variant form (optional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Agregar esta función después de los estados
  const productosFiltrados = useMemo(() => {
    if (!search) return productos;

    return productos.filter(p =>
      p.Nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.Descripcion.toLowerCase().includes(search.toLowerCase()) ||
      p.Tela.toLowerCase().includes(search.toLowerCase())
    );
  }, [productos, search]);

  return (
    <div className="d-flex flex-column" style={{
      minHeight: "100dvh",
      background: "linear-gradient(135deg, #ffffffff 0%, #fafcff 100%)",
      padding: "20px 30px",
      fontSize: "0.9rem",
    }}>
      {/* Header con título y botón */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="fs-5 fw-bold mb-0 text-primary" style={{ letterSpacing: 1 }}>
          Gestión de Productos
        </h1>
        <button
          className="btn btn-sm btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={() => {
            setProducto({ Nombre: "", Descripcion: "", TelaID: "" });
            setProductoCreado(null);
            setShowForm(true);
          }}
        >
          <FaPlusCircle size={18} />
          Agregar Producto
        </button>
      </div>

      {/* Buscador */}
      <div className="d-flex justify-content-end mb-3">
        <div className="input-group input-group-sm" style={{ maxWidth: 260 }}>
          <span className="input-group-text bg-white border-end-0">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Buscar producto..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="card shadow-sm mb-4">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{
              background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
              color: "#fff"
            }}>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Tela</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p) => (
                <tr key={p.ProductoID || p.id}>
                  <td>{p.ProductoID || p.id}</td>
                  <td>{p.Nombre}</td>
                  <td>{p.Descripcion}</td>
                  <td>{p.Tela}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <button
                        className="btn btn-outline-primary btn-sm rounded-circle"
                        title="Ver"
                        onClick={() => handleVer(p)}
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        className="btn btn-outline-warning btn-sm rounded-circle"
                        title="Editar"
                        onClick={() => editarProducto(p)}
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm rounded-circle"
                        title="Eliminar"
                        onClick={() => eliminarProducto(p)}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {productosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-3">
                    No se encontraron productos que coincidan con la búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMULARIO */}
      {showForm && (
        <div className="card p-4 shadow-sm position-relative">
          {/* Botón X para cerrar */}
          <button
            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
            onClick={() => {
              setShowForm(false);
              setProductoCreado(null);
              setProducto({ Nombre: "", Descripcion: "", TelaID: "" });
            }}
            style={{ width: '32px', height: '32px', padding: '0' }}
          >
            <FaTimes />
          </button>

          {/* Mostrar formulario de producto SOLO cuando NO hay producto creado O cuando se está editando */}
          {(!productoCreado || (productoCreado?.ProductoID && !productoCreado?.isNew)) && (
            <>
              <h3 className="mb-3">
                {productoCreado?.ProductoID ? `Editar Producto: ${productoCreado.Nombre}` : 'Nuevo Producto'}
              </h3>
              <form onSubmit={guardarProducto}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="Nombre"
                    className="form-control"
                    value={producto.Nombre}
                    onChange={handleProductoChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    name="Descripcion"
                    className="form-control"
                    value={producto.Descripcion}
                    onChange={handleProductoChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tela</label>
                  <select
                    name="TelaID"
                    className="form-select"
                    value={producto.TelaID}
                    onChange={handleProductoChange}
                    required
                  >
                    <option value="">Seleccione tela</option>
                    {telas.map((t) => (
                      <option key={t.TelaID || t.id} value={t.TelaID || t.id}>
                        {t.Nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="d-flex gap-2 mb-4">
                  <button type="submit" className="btn btn-success">
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      setProductoCreado(null);
                      setProducto({ Nombre: "", Descripcion: "", TelaID: "" });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </>
          )}

          {/* Mostrar sección de variantes solo cuando hay un producto creado */}
          {productoCreado && (
            <div className={productoCreado.ProductoID && !productoCreado.isNew ? "mt-4" : ""}>
              <h4>
                {productoCreado.isNew ?
                  `Agregar variantes para: ${productoCreado.Nombre}` :
                  "Variantes del producto"
                }
              </h4>
              {/* Formulario de variantes */}
              <form onSubmit={guardarVariante}>
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <label>Color</label>
                    <select name="ColorID" className="form-select" value={variante.ColorID || ""} onChange={handleVarianteChange} required>
                      <option value="">Seleccione</option>
                      {colores.map((c) => (
                        <option key={c.ColorID || c.colorID || c.id} value={c.ColorID || c.colorID || c.id}>
                          {c.Nombre || c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Talla</label>
                    <select name="TallaID" className="form-select" value={variante.TallaID || ""} onChange={handleVarianteChange} required>
                      <option value="">Seleccione</option>
                      {tallas.map((t) => (
                        <option key={t.TallaID || t.tallaID || t.id} value={t.TallaID || t.tallaID || t.id}>
                          {t.Nombre || t.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Stock</label>
                    <input type="number" name="Stock" className="form-control" value={variante.Stock || variante.stock || ""} onChange={handleVarianteChange} required />
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Precio</label>
                    <input type="number" step="0.01" name="Precio" className="form-control" value={variante.Precio || variante.precio || ""} onChange={handleVarianteChange} required />
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Imagen (URL)</label>
                    <input type="text" name="Imagen" className="form-control" value={variante.Imagen || variante.imagen || ""} onChange={handleVarianteChange} required />
                  </div>

                  <div className="col-md-4 d-flex align-items-center">
                    <div className="form-check mt-2">
                      <input className="form-check-input" type="checkbox" name="Estado" checked={!!(variante.Estado !== undefined ? variante.Estado : variante.estado)} onChange={handleVarianteChange} />
                      <label className="form-check-label">Disponible</label>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="submit"
                    className={`btn ${editandoVariante ? 'btn-warning' : 'btn-primary'}`}
                  >
                    {editandoVariante ? 'Editar Variante' : 'Agregar Variante'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setProductoCreado(null);  // Volver al formulario de producto
                      setVariante({             // Limpiar form de variante
                        ColorID: "",
                        TallaID: "",
                        Stock: "",
                        Imagen: "",
                        Precio: "",
                        Estado: true,
                      });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>

              {/* Lista de variantes sin acciones */}
              <div className="mt-4">
                <h6>Variantes agregadas</h6>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Color</th>
                      <th>Talla</th>
                      <th>Stock</th>
                      <th>Precio</th>
                      <th>Imagen</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variantesList.map((v) => (
                      <tr key={v.VarianteID || v.id}>
                        <td>{v.VarianteID || v.id}</td>
                        <td>{colores.find(c => c.ColorID === v.ColorID)?.Nombre || "—"}</td>
                        <td>{tallas.find(t => t.TallaID === v.TallaID)?.Nombre || "—"}</td>
                        <td>{v.Stock}</td>
                        <td>${v.Precio}</td>
                        <td>
                          {v.Imagen ? (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                Swal.fire({
                                  imageUrl: v.Imagen,
                                  imageWidth: 400,
                                  imageHeight: 400,
                                  imageAlt: 'Imagen de variante',
                                  showCloseButton: true,
                                  showConfirmButton: false,
                                  className: 'swal2-modal-custom'
                                })
                              }}
                            >
                              Ver imagen
                            </button>
                          ) : "—"}
                        </td>
                        <td>{v.Estado === 1 || v.Estado === true ? "Disponible" : "No disponible"}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-outline-warning btn-sm rounded-circle"
                              title="Editar"
                              onClick={() => handleEditarVariante(v)}
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm rounded-circle"
                              onClick={() => handleEliminarVariante(v)}
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de variantes - Actualizar esta sección */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header" style={{
                background: "linear-gradient(120deg, #1976d2 60%, #64b5f6 100%)",
                color: "white"
              }}>
                <h5 className="modal-title">Detalle del Producto</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCerrarModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Información del Producto */}
                <div className="card mb-4">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3 text-primary fw-bold">
                      Información General
                    </h6>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong className="text-muted">ID:</strong> {modalProducto?.ProductoID || modalProducto?.id}
                        </p>
                        <p className="mb-1">
                          <strong className="text-muted">Nombre:</strong> {modalProducto?.Nombre}
                        </p>
                        <p className="mb-1">
                          <strong className="text-muted">Tela:</strong> {modalProducto?.Tela}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="mb-1">
                          <strong className="text-muted">Descripción:</strong>
                        </p>
                        <p className="border-start border-4 border-primary ps-2">
                          {modalProducto?.Descripcion}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabla de Variantes */}
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-subtitle mb-3 text-primary fw-bold">
                      Variantes del Producto
                    </h6>
                    {variantesList.length === 0 ? (
                      <div className="alert alert-info">
                        No hay variantes registradas para este producto.
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover text-white">
                          <thead className="table-light">
                            <tr className="text-center">
                              <th>Color</th>
                              <th>Talla</th>
                              <th>Stock</th>
                              <th>Precio</th>
                              <th>Imagen</th>
                              <th>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {variantesList.map((v) => (
                              <tr key={v.VarianteID || v.id} className="text-center">
                                <td>{colores.find(c => c.ColorID === v.ColorID)?.Nombre || "—"}</td>
                                <td>{tallas.find(t => t.TallaID === v.TallaID)?.Nombre || "—"}</td>
                                <td>{v.Stock}</td>
                                <td>${v.Precio?.toLocaleString()}</td>
                                <td>
                                  {v.Imagen ? (
                                    <button
                                      className="btn btn-sm btn-primary"
                                      onClick={() => {
                                        Swal.fire({
                                          imageUrl: v.Imagen,
                                          imageWidth: 400,
                                          imageHeight: 400,
                                          imageAlt: 'Imagen de variante',
                                          showCloseButton: true,
                                          showConfirmButton: false,
                                          className: 'swal2-modal-custom'
                                        })
                                      }}
                                    >
                                      Ver imagen
                                    </button>
                                  ) : "—"}
                                </td>
                                <td>
                                  <span>
                                    {v.Estado === 1 || v.Estado === true ?
                                      "Disponible" : "No disponible"}
                                  </span>
                                </td>
                                {/* <td>
                                  <div className="d-flex justify-content-center">
                                    <button
                                      className="btn btn-outline-warning btn-sm rounded-circle me-2"
                                      title="Editar"
                                      onClick={() => {
                                        handleEditarVariante(v);
                                        handleCerrarModal();
                                        setShowForm(true); // Mostrar el formulario
                                      }}
                                    >
                                      <FaEdit size={14} />
                                    </button>
                                    <button
                                      className="btn btn-outline-danger btn-sm rounded-circle"
                                      title="Eliminar"
                                      onClick={() => {
                                        handleEliminarVariante(v);
                                        handleCerrarModal();
                                      }}
                                    >
                                      <FaTrash size={14} />
                                    </button>
                                  </div>
                                </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCerrarModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;