import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

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
    // validación básica
    if (!producto.Nombre || !producto.Descripcion || !producto.TelaID) {
      Swal.fire("Completa los campos", "Nombre, descripción y tela son obligatorios", "warning");
      return;
    }

    try {
      const res = await createProducto({
        Nombre: producto.Nombre,
        Descripcion: producto.Descripcion,
        TelaID: parseInt(producto.TelaID, 10),
      });

      // adaptar según lo que devuelva tu backend
      // puede devolver { estado:true, datos: { ProductoID: x, ... } }
      let nuevoProducto = null;
      if (res?.datos) nuevoProducto = res.datos;
      else if (res?.data?.datos) nuevoProducto = res.data.datos;
      else nuevoProducto = res;

      // si el backend devolvió SCOPE_IDENTITY() como { ProductoID: x }:
      // a veces devolvemos { ProductoID: 5 } o { id: 5 } según tu modelo.
      setProductoCreado(nuevoProducto);
      Swal.fire("Producto creado", "Ahora puedes agregar variantes", "success");
      cargarProductos();
    } catch (err) {
      console.error("Error crear producto:", err);
      Swal.fire("Error", err?.response?.data?.mensaje || err.message || "Error al crear producto", "error");
    }
  };

  // seleccionar un producto para editar (cargar en formulario)
  const editarProducto = (p) => {
    // p proviene de la lista de productos que trae el backend (tiene ProductoID, Nombre, Descripcion, Tela)
    setProducto({
      Nombre: p.Nombre || "",
      Descripcion: p.Descripcion || "",
      TelaID: p.TelaID || p.TelaID || "",
    });
    // marcar como creado para abrir sección variantes y permitir actualizar si se quiere
    setProductoCreado(p);
    // cargar variantes actuales de ese producto
    cargarVariantes(p.ProductoID || p.ProductoID || p.id);
  };

  const eliminarProducto = async (p) => {
    const id = p.ProductoID || p.id;
    const confirm = await Swal.fire({
      title: "Eliminar producto",
      text: `¿Eliminar ${p.Nombre}? Esto también eliminará sus variantes.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });
    if (!confirm.isConfirmed) return;

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
      Swal.fire("Error", "No se pudo eliminar producto", "error");
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
    if (!productoCreado) {
      Swal.fire("Registra producto", "Primero registra o selecciona un producto", "warning");
      return;
    }

    // validar campos requeridos
    if (!variante.ColorID && !variante.ColorID !== 0 && !variante.colorId) {
      Swal.fire("Falta color", "Elige un color", "warning");
      return;
    }

    try {
      // construir payload adaptado al backend SQL Server (según tus rutas)
      const productoId = productoCreado.ProductoID || productoCreado.id;
      const payload = editandoVariante
        ? {
            VarianteID: editandoVariante.VarianteID || editandoVariante.id,
            ColorID: parseInt(variante.ColorID || variante.colorId, 10),
            TallaID: parseInt(variante.TallaID || variante.tallaId, 10),
            Stock: parseInt(variante.Stock || variante.stock, 10),
            Imagen: variante.Imagen || variante.imagen || "",
            Precio: parseFloat(variante.Precio || variante.precio || 0),
            Estado: variante.Estado !== undefined ? variante.Estado : variante.estado ? 1 : 0,
          }
        : {
            ProductoID: parseInt(productoId, 10),
            ColorID: parseInt(variante.ColorID || variante.colorId, 10),
            TallaID: parseInt(variante.TallaID || variante.tallaId, 10),
            Stock: parseInt(variante.Stock || variante.stock, 10),
            Imagen: variante.Imagen || variante.imagen || "",
            Precio: parseFloat(variante.Precio || variante.precio || 0),
            Estado: variante.Estado !== undefined ? variante.Estado : variante.estado ? 1 : 0,
          };

      if (editandoVariante) {
        // updateVariante espera (id, data) en tus servicios — intenta usar updateVariante
        await updateVariante(payload.VarianteID || payload.id, payload);
        Swal.fire("Actualizado", "Variante actualizada correctamente", "success");
        setEditandoVariante(null);
      } else {
        await createVariante(payload);
        Swal.fire("Creado", "Variante agregada correctamente", "success");
      }

      // recargar variantes
      cargarVariantes(productoId);
      // limpiar formulario variante
      setVariante({ ColorID: "", TallaID: "", Stock: "", Imagen: "", Precio: "", Estado: true });
    } catch (err) {
      console.error("Error guardar variante:", err);
      const msg = err?.response?.data?.message || err?.response?.data || err.message || "Error al guardar variante";
      Swal.fire("Error", msg, "error");
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
      // recargar
      const prodId = modalProducto ? (modalProducto.ProductoID || modalProducto.id) : productoCreado?.ProductoID || productoCreado?.id;
      if (prodId) cargarVariantes(prodId);
    } catch (err) {
      console.error("Error eliminar variante:", err);
      Swal.fire("Error", "No se pudo eliminar variante", "error");
    }
  };

  // editar variante: cargar en formulario y marcar editando
  const handleEditarVariante = (v) => {
    // adaptar propiedades del objeto variante que llega del backend
    setEditandoVariante(v);
    setVariante({
      colorId: v.ColorID || v.ColorID || v.ColorID || v.colorId || v.Color || "",
      tallaId: v.TallaID || v.TallaID || v.tallaId || v.Talla || "",
      stock: v.Stock || v.stock || "",
      imagen: v.Imagen || v.imagen || v.Imagen || "",
      precio: v.Precio || v.precio || "",
      estado: v.Estado === 1 || v.Estado === true || v.estado === true,
      // also populate ColorID/TallaID keys for payload consistency
      ColorID: v.ColorID || v.ColorID || v.colorId || undefined,
      TallaID: v.TallaID || v.TallaID || v.tallaId || undefined,
    });

    // scroll up to variant form (optional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h3 className="mb-3">Registrar Producto</h3>

        {/* Form producto */}
        {!productoCreado && (
          <form onSubmit={guardarProducto}>
            <div className="mb-2">
              <label className="form-label">Nombre</label>
              <input name="Nombre" className="form-control" value={producto.Nombre} onChange={handleProductoChange} required />
            </div>

            <div className="mb-2">
              <label className="form-label">Descripción</label>
              <textarea name="Descripcion" className="form-control" value={producto.Descripcion} onChange={handleProductoChange} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Tela</label>
              <select name="TelaID" className="form-select" value={producto.TelaID} onChange={handleProductoChange} required>
                <option value="">Seleccione tela</option>
                {telas.map((t) => (
                  <option key={t.TelaID || t.id} value={t.TelaID || t.id}>
                    {t.Nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-success" type="submit">
                Guardar producto
              </button>
            </div>
          </form>
        )}

        {/* Si ya hay producto creado/seleccionado: sección variantes */}
        {productoCreado && (
          <>
            <div className="mt-3">
              <h5>
                Agregar Variante para: <small className="text-muted">{productoCreado.Nombre || productoCreado.nombre}</small>
              </h5>

              <form onSubmit={guardarVariante}>
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <label>Color</label>
                    <select name="ColorID" className="form-select" value={variante.ColorID || variante.colorId || ""} onChange={handleVarianteChange} required>
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
                    <select name="TallaID" className="form-select" value={variante.TallaID || variante.tallaId || ""} onChange={handleVarianteChange} required>
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

                <div className="mt-3 d-flex gap-2">
                  <button type="submit" className="btn btn-primary">
                    {editandoVariante ? "Actualizar Variante" : "Agregar Variante"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      // cancelar edición o volver a crear nuevo
                      setEditandoVariante(null);
                      setVariante({ ColorID: "", TallaID: "", Stock: "", Imagen: "", Precio: "", Estado: true });
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>

            {/* Lista de variantes locales (cargadas desde backend) */}
            <div className="mt-4">
              <h6>Variantes del producto</h6>
              <table className="table table-sm table-bordered">
                <thead>
                  <tr>
                    <th>VarianteID</th>
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
                  {variantesList.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No hay variantes (o recarga para ver)
                      </td>
                    </tr>
                  ) : (
                    variantesList.map((v) => (
                      <tr key={v.VarianteID || v.id}>
                        <td>{v.VarianteID || v.id}</td>
                        <td>{v.Color || v.NombreColor || v.colorNombre || v.color}</td>
                        <td>{v.Talla || v.NombreTalla || v.tallaNombre || v.talla}</td>
                        <td>{v.Stock}</td>
                        <td>{v.Precio}</td>
                        <td>
                          {v.Imagen ? <img src={v.Imagen} alt="img" style={{ width: 50 }} /> : "—"}
                        </td>
                        <td>{v.Estado === 1 || v.Estado === true ? "Disponible" : "No disponible"}</td>
                        <td>
                          <button className="btn btn-sm btn-warning me-1" onClick={() => handleEditarVariante(v)}>
                            ✏️
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleEliminarVariante(v)}>
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Tabla general de productos */}
        <div className="mt-5">
          <h4>Productos guardados</h4>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Tela</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.ProductoID || p.id}>
                  <td>{p.ProductoID || p.id}</td>
                  <td>{p.Nombre}</td>
                  <td>{p.Descripcion}</td>
                  <td>{p.Tela || p.Tela}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-1" onClick={() => handleVer(p)}>
                      Ver
                    </button>
                    <button className="btn btn-sm btn-warning me-1" onClick={() => editarProducto(p)}>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminarProducto(p)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal simple interno para ver variantes (no dependencia externa) */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Variantes de {modalProducto?.Nombre}</h5>
                  <button type="button" className="btn-close" onClick={handleCerrarModal}></button>
                </div>
                <div className="modal-body">
                  {variantesList.length === 0 ? (
                    <p>No hay variantes para este producto.</p>
                  ) : (
                    <table className="table table-bordered">
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
                            <td>{v.Color || v.colorNombre || v.NombreColor}</td>
                            <td>{v.Talla || v.tallaNombre || v.NombreTalla}</td>
                            <td>{v.Stock}</td>
                            <td>{v.Precio}</td>
                            <td>{v.Imagen ? <img src={v.Imagen} alt="" style={{ width: 50 }} /> : "—"}</td>
                            <td>{v.Estado === 1 || v.Estado === true ? "Disponible" : "No disponible"}</td>
                            <td>
                              <button className="btn btn-sm btn-warning me-1" onClick={() => { handleEditarVariante(v); setShowModal(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                                Editar
                              </button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleEliminarVariante(v)}>Eliminar</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={handleCerrarModal}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Productos;
