import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaArrowLeft, FaCheck, FaPlus, FaTrash, FaImage, FaEdit } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

// Importar servicios
import {
    createProducto,
    getProductoById,
    updateProducto
} from "../../Services/api-productos/productos";
import {
    createVariante,
    getVariantesByProducto,
    updateVariante,
    deleteVariante
} from "../../Services/api-productos/variantes";
import { getColores, getTallas } from "../../Services/api-productos/atributos";

const AgregarProducto = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const modoEdicion = Boolean(id);

    // Estados del producto
    const [producto, setProducto] = useState({
        Nombre: "",
        Descripcion: "",
        ImagenProducto: ""
    });

    const [productoOriginal, setProductoOriginal] = useState(null); // Para comparar cambios

    // Estados de variantes
    const [colores, setColores] = useState([]);
    const [tallas, setTallas] = useState([]);
    const [variantes, setVariantes] = useState([]);
    const [variantesOriginales, setVariantesOriginales] = useState([]);

    // Estado del paso actual
    const [paso, setPaso] = useState(1);
    const [productoCreado, setProductoCreado] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [cargandoDatos, setCargandoDatos] = useState(false);

    // Nuevo estado para controlar si se están editando los datos del producto
    const [editandoDatosProducto, setEditandoDatosProducto] = useState(false);

    // Nueva variante temporal
    const [nuevaVariante, setNuevaVariante] = useState({
        ColorID: "",
        TallaID: "",
        Stock: 0,
        Estado: true
    });

    // Cargar datos al montar
    useEffect(() => {
        cargarAtributos();

        if (modoEdicion) {
            cargarProductoExistente();
        }
    }, [id]);

    const cargarAtributos = async () => {
        try {
            const [coloresRes, tallasRes] = await Promise.all([
                getColores(),
                getTallas()
            ]);

            setColores(coloresRes.datos || coloresRes);
            setTallas(tallasRes.datos || tallasRes);
        } catch (error) {
            console.error("Error al cargar atributos:", error);
            Swal.fire("Error", "No se pudieron cargar colores y tallas", "error");
        }
    };

    const cargarProductoExistente = async () => {
        setCargandoDatos(true);
        try {
            const [productoRes, variantesRes] = await Promise.all([
                getProductoById(id),
                getVariantesByProducto(id)
            ]);

            const productoData = productoRes.datos || productoRes;
            const variantesData = variantesRes.datos || variantesRes;

            const productoInfo = {
                Nombre: productoData.Nombre,
                Descripcion: productoData.Descripcion || "",
                ImagenProducto: productoData.ImagenProducto || ""
            };

            setProducto(productoInfo);
            setProductoOriginal(JSON.parse(JSON.stringify(productoInfo)));
            setProductoCreado(productoData);

            const variantesFormateadas = variantesData.map(v => ({
                InventarioID: v.InventarioID,
                ColorID: v.ColorID,
                TallaID: v.TallaID,
                Stock: v.Stock,
                Estado: v.Estado,
                nombreColor: v.color?.Nombre,
                nombreTalla: v.talla?.Nombre,
                precioTalla: null,
                esExistente: true
            }));

            setVariantes(variantesFormateadas);
            setVariantesOriginales(JSON.parse(JSON.stringify(variantesFormateadas)));
            setPaso(2);

        } catch (error) {
            console.error("Error al cargar producto:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo cargar el producto",
            }).then(() => {
                navigate("/dashboard/productos");
            });
        } finally {
            setCargandoDatos(false);
        }
    };

    const handleProductoChange = (e) => {
        const { name, value } = e.target;
        setProducto(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGuardarProducto = async (e) => {
        e.preventDefault();

        if (!producto.Nombre.trim()) {
            Swal.fire("Error", "El nombre del producto es obligatorio", "error");
            return;
        }

        setCargando(true);
        try {
            let nuevoProducto;

            if (modoEdicion) {
                const response = await updateProducto(id, producto);
                nuevoProducto = response.datos || response.producto;

                Swal.fire({
                    title: "¡Actualizado!",
                    text: "Producto actualizado correctamente",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });

                // Actualizar el producto original para futuras comparaciones
                setProductoOriginal(JSON.parse(JSON.stringify(producto)));
                setEditandoDatosProducto(false);
            } else {
                const response = await createProducto(producto);
                nuevoProducto = response.datos || response.producto;

                Swal.fire({
                    title: "¡Producto creado!",
                    text: "Ahora puedes agregar variantes (colores y tallas)",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }

            setProductoCreado(nuevoProducto);
            setPaso(2);

        } catch (error) {
            console.error("Error al guardar producto:", error);
            Swal.fire(
                "Error",
                error.response?.data?.mensaje || "No se pudo guardar el producto",
                "error"
            );
        } finally {
            setCargando(false);
        }
    };

    const handleAgregarVariante = () => {
        const { ColorID, TallaID, Stock } = nuevaVariante;

        if (!ColorID || !TallaID) {
            Swal.fire("Error", "Selecciona color y talla", "warning");
            return;
        }

        const existe = variantes.some(
            v => v.ColorID === parseInt(ColorID) && v.TallaID === parseInt(TallaID)
        );

        if (existe) {
            Swal.fire("Error", "Ya existe una variante con ese color y talla", "warning");
            return;
        }

        const talla = tallas.find(t => t.TallaID === parseInt(TallaID));

        const varianteTemporal = {
            ColorID: parseInt(ColorID),
            TallaID: parseInt(TallaID),
            Stock: parseInt(Stock) || 0,
            Estado: nuevaVariante.Estado,
            nombreColor: colores.find(c => c.ColorID === parseInt(ColorID))?.Nombre,
            nombreTalla: talla?.Nombre,
            precioTalla: talla?.Precio,
            esExistente: false
        };

        setVariantes(prev => [...prev, varianteTemporal]);

        setNuevaVariante({
            ColorID: "",
            TallaID: "",
            Stock: 0,
            Estado: true
        });
    };

    const handleEditarVariante = (index) => {
        const variante = variantes[index];

        Swal.fire({
            title: `Editar Variante: ${variante.nombreColor} - ${variante.nombreTalla}`,
            html: `
                <div class="text-start">
                    <label class="form-label fw-medium">Stock</label>
                    <input type="number" id="stock" class="form-control mb-3" value="${variante.Stock}" min="0">
                    
                    <label class="form-label fw-medium">Estado</label>
                    <select id="estado" class="form-select">
                        <option value="true" ${variante.Estado ? 'selected' : ''}>Disponible</option>
                        <option value="false" ${!variante.Estado ? 'selected' : ''}>No disponible</option>
                    </select>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Guardar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                const stock = parseInt(document.getElementById('stock').value);
                const estado = document.getElementById('estado').value === 'true';

                if (isNaN(stock) || stock < 0) {
                    Swal.showValidationMessage('El stock debe ser un número válido');
                    return false;
                }

                return { stock, estado };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { stock, estado } = result.value;

                setVariantes(prev => prev.map((v, i) =>
                    i === index
                        ? { ...v, Stock: stock, Estado: estado }
                        : v
                ));

                Swal.fire({
                    icon: 'success',
                    title: 'Variante actualizada',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };

    const handleEliminarVariante = async (index) => {
        const variante = variantes[index];

        const result = await Swal.fire({
            title: "¿Eliminar variante?",
            text: `${variante.nombreColor} - ${variante.nombreTalla}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!result.isConfirmed) return;

        if (variante.esExistente && variante.InventarioID) {
            setCargando(true);
            try {
                await deleteVariante(variante.InventarioID);

                Swal.fire({
                    icon: 'success',
                    title: 'Variante eliminada',
                    timer: 1500,
                    showConfirmButton: false
                });
            } catch (error) {
                console.error("Error al eliminar variante:", error);
                Swal.fire("Error", "No se pudo eliminar la variante", "error");
                setCargando(false);
                return;
            } finally {
                setCargando(false);
            }
        }

        setVariantes(prev => prev.filter((_, i) => i !== index));
    };

    const handleGuardarVariantes = async () => {
        if (variantes.length === 0 && !modoEdicion) {
            const result = await Swal.fire({
                title: "Sin variantes",
                text: "¿Deseas guardar el producto sin variantes?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Sí, guardar",
                cancelButtonText: "Cancelar"
            });

            if (!result.isConfirmed) return;
        }

        setCargando(true);
        try {
            const promesas = [];

            for (const variante of variantes) {
                if (variante.esExistente) {
                    const original = variantesOriginales.find(v => v.InventarioID === variante.InventarioID);
                    if (!original || original.Stock !== variante.Stock || original.Estado !== variante.Estado) {
                        promesas.push(
                            updateVariante(variante.InventarioID, {
                                Stock: variante.Stock,
                                Estado: variante.Estado
                            })
                        );
                    }
                } else {
                    promesas.push(
                        createVariante({
                            ProductoID: productoCreado.ProductoID,
                            ColorID: variante.ColorID,
                            TallaID: variante.TallaID,
                            Stock: variante.Stock,
                            Estado: variante.Estado
                        })
                    );
                }
            }

            await Promise.all(promesas);

            Swal.fire({
                title: modoEdicion ? "¡Actualizado!" : "¡Éxito!",
                text: modoEdicion
                    ? "Producto y variantes actualizados correctamente"
                    : `Producto creado con ${variantes.length} variante(s)`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

            setTimeout(() => {
                navigate("/dashboard/productos");
            }, 2000);

        } catch (error) {
            console.error("Error al guardar variantes:", error);
            Swal.fire(
                "Error",
                "Hubo un problema al guardar las variantes",
                "error"
            );
        } finally {
            setCargando(false);
        }
    };

    const handleVolver = () => {
        if (paso === 2) {
            if (modoEdicion) {
                Swal.fire({
                    title: "¿Descartar cambios?",
                    text: "Los cambios no guardados se perderán",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, descartar",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/dashboard/productos");
                    }
                });
            } else {
                Swal.fire({
                    title: "¿Volver al paso anterior?",
                    text: "Se perderán las variantes agregadas",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí, volver",
                    cancelButtonText: "Cancelar"
                }).then((result) => {
                    if (result.isConfirmed) {
                        setPaso(1);
                        setVariantes([]);
                    }
                });
            }
        } else {
            navigate("/dashboard/productos");
        }
    };

    // Función para editar datos del producto en modo edición
    const handleEditarDatosProducto = () => {
        setEditandoDatosProducto(true);
    };

    const handleCancelarEdicionProducto = () => {
        // Restaurar datos originales
        setProducto(JSON.parse(JSON.stringify(productoOriginal)));
        setEditandoDatosProducto(false);
    };

    const obtenerPrecioTalla = (tallaId) => {
        const talla = tallas.find(t => t.TallaID === tallaId);
        return talla?.Precio || 0;
    };

    if (cargandoDatos) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3">Cargando producto...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #ffffff 0%, #fafcff 100%)",
                padding: "20px 30px"
            }}
        >
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
                <button
                    className="btn btn-outline-secondary me-3"
                    onClick={handleVolver}
                    disabled={cargando}
                >
                    <FaArrowLeft />
                </button>
                <h1 className="fs-4 fw-bold mb-0 text-primary">
                    {modoEdicion
                        ? (paso === 1 ? "Editar Producto" : "Gestionar Producto y Variantes")
                        : (paso === 1 ? "Crear Nuevo Producto" : "Agregar Variantes")
                    }
                </h1>
            </div>

            {/* Indicador de pasos (solo en modo creación) */}
            {!modoEdicion && (
                <div className="d-flex justify-content-center mb-4">
                    <div className="d-flex align-items-center">
                        <div
                            className={`rounded-circle d-flex align-items-center justify-content-center ${paso >= 1 ? "bg-primary text-white" : "bg-secondary text-white"
                                }`}
                            style={{ width: 40, height: 40 }}
                        >
                            {paso > 1 ? <FaCheck /> : "1"}
                        </div>
                        <div
                            className={`mx-3 ${paso >= 2 ? "bg-primary" : "bg-secondary"}`}
                            style={{ width: 80, height: 3 }}
                        ></div>
                        <div
                            className={`rounded-circle d-flex align-items-center justify-content-center ${paso >= 2 ? "bg-primary text-white" : "bg-secondary text-white"
                                }`}
                            style={{ width: 40, height: 40 }}
                        >
                            2
                        </div>
                    </div>
                </div>
            )}

            {/* PASO 1: Datos del Producto */}
            {paso === 1 && (
                <div className="card shadow-sm mx-auto" style={{ maxWidth: 700 }}>
                    <div className="card-body p-4">
                        <h5 className="fw-bold mb-3">Información del Producto</h5>

                        <form onSubmit={handleGuardarProducto}>
                            <div className="mb-3">
                                <label className="form-label fw-medium">
                                    Nombre del Producto <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Nombre"
                                    value={producto.Nombre}
                                    onChange={handleProductoChange}
                                    placeholder="Ej: Camiseta Básica"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Descripción</label>
                                <textarea
                                    className="form-control"
                                    name="Descripcion"
                                    value={producto.Descripcion}
                                    onChange={handleProductoChange}
                                    rows="3"
                                    placeholder="Describe el producto..."
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-medium">
                                    <FaImage className="me-2" />
                                    URL de la Imagen
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="ImagenProducto"
                                    value={producto.ImagenProducto}
                                    onChange={handleProductoChange}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                {producto.ImagenProducto && (
                                    <div className="mt-2">
                                        <img
                                            src={producto.ImagenProducto}
                                            alt="Vista previa"
                                            className="img-thumbnail"
                                            style={{ maxWidth: 200, maxHeight: 200 }}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => navigate("/dashboard/productos")}
                                    disabled={cargando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={cargando}
                                >
                                    {cargando ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            {modoEdicion ? "Actualizando..." : "Creando..."}
                                        </>
                                    ) : (
                                        modoEdicion ? "Actualizar y Continuar" : "Crear y Continuar"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* PASO 2: Variantes CON tarjeta de info del producto editable */}
            {paso === 2 && productoCreado && (
                <div className="card shadow-sm mx-auto" style={{ maxWidth: 900 }}>
                    <div className="card-body p-4">
                        {/* Tarjeta de información del producto (EDITABLE en modo edición) */}
                        <div className="card mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold mb-0">Información del Producto</h5>
                                    {modoEdicion && !editandoDatosProducto && (
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={handleEditarDatosProducto}
                                        >
                                            <FaEdit className="me-1" /> Editar datos
                                        </button>
                                    )}
                                </div>

                                {editandoDatosProducto ? (
                                    // Formulario de edición
                                    <form onSubmit={handleGuardarProducto}>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="Nombre"
                                                value={producto.Nombre}
                                                onChange={handleProductoChange}
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">Descripción</label>
                                            <textarea
                                                className="form-control"
                                                name="Descripcion"
                                                value={producto.Descripcion}
                                                onChange={handleProductoChange}
                                                rows="2"
                                            ></textarea>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label fw-medium">URL de la Imagen</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="ImagenProducto"
                                                value={producto.ImagenProducto}
                                                onChange={handleProductoChange}
                                            />
                                            {producto.ImagenProducto && (
                                                <div className="mt-2">
                                                    <img
                                                        src={producto.ImagenProducto}
                                                        alt="Vista previa"
                                                        className="img-thumbnail"
                                                        style={{ maxWidth: 150, maxHeight: 150 }}
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-secondary"
                                                onClick={handleCancelarEdicionProducto}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-sm btn-primary"
                                                disabled={cargando}
                                            >
                                                {cargando ? "Guardando..." : "Guardar cambios"}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    // Vista de solo lectura
                                    <div className="row">
                                        <div className="col-md-3">
                                            {producto.ImagenProducto ? (
                                                <img
                                                    src={producto.ImagenProducto}
                                                    alt={producto.Nombre}
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: 150, objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div
                                                    className="bg-secondary bg-opacity-10 rounded d-flex align-items-center justify-content-center"
                                                    style={{ height: 150 }}
                                                >
                                                    <span className="text-muted">Sin imagen</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-md-9">
                                            <h6 className="fw-bold">{producto.Nombre}</h6>
                                            <p className="text-muted mb-2">{producto.Descripcion || "Sin descripción"}</p>
                                            <small className="text-muted">ID: {productoCreado.ProductoID}</small>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <h5 className="fw-bold mb-3">
                            {modoEdicion ? "Gestionar Variantes" : "Agregar Variantes"}
                        </h5>

                        {/* Formulario para agregar variante */}
                        <div className="card bg-light mb-4">
                            <div className="card-body">
                                <h6 className="fw-bold mb-3">Nueva Variante</h6>
                                <div className="row g-3">
                                    <div className="col-md-3">
                                        <label className="form-label fw-medium">Color</label>
                                        <select
                                            className="form-select"
                                            value={nuevaVariante.ColorID}
                                            onChange={(e) =>
                                                setNuevaVariante(prev => ({
                                                    ...prev,
                                                    ColorID: e.target.value
                                                }))
                                            }
                                        >
                                            <option value="">Seleccionar...</option>
                                            {colores.map(color => (
                                                <option key={color.ColorID} value={color.ColorID}>
                                                    {color.Nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label fw-medium">Talla</label>
                                        <select
                                            className="form-select"
                                            value={nuevaVariante.TallaID}
                                            onChange={(e) =>
                                                setNuevaVariante(prev => ({
                                                    ...prev,
                                                    TallaID: e.target.value
                                                }))
                                            }
                                        >
                                            <option value="">Seleccionar...</option>
                                            {tallas.map(talla => (
                                                <option key={talla.TallaID} value={talla.TallaID}>
                                                    {talla.Nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label fw-medium">Stock</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={nuevaVariante.Stock}
                                            onChange={(e) =>
                                                setNuevaVariante(prev => ({
                                                    ...prev,
                                                    Stock: e.target.value
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <label className="form-label fw-medium">Estado</label>
                                        <select
                                            className="form-select"
                                            value={nuevaVariante.Estado}
                                            onChange={(e) =>
                                                setNuevaVariante(prev => ({
                                                    ...prev,
                                                    Estado: e.target.value === "true"
                                                }))
                                            }
                                        >
                                            <option value="true">Disponible</option>
                                            <option value="false">No disponible</option>
                                        </select>
                                    </div>

                                    <div className="col-md-2 d-flex align-items-end">
                                        <button
                                            type="button"
                                            className="btn btn-success w-100"
                                            onClick={handleAgregarVariante}
                                        >
                                            <FaPlus /> Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tabla de variantes */}
                        <h6 className="fw-bold mb-2">
                            Variantes ({variantes.length})
                        </h6>

                        {variantes.length === 0 ? (
                            <div className="alert alert-info">
                                No hay variantes. Agrega al menos una combinación de color y talla.
                            </div>
                        ) : (
                            <div className="table-responsive mb-4">
                                <table className="table table-sm table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Color</th>
                                            <th>Talla</th>
                                            <th>Precio</th>
                                            <th className="text-center">Stock</th>
                                            <th className="text-center">Estado</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variantes.map((variante, index) => (
                                            <tr key={index}>
                                                <td>{variante.nombreColor}</td>
                                                <td>{variante.nombreTalla}</td>
                                                <td className="text-success fw-medium">
                                                    ${(variante.precioTalla || obtenerPrecioTalla(variante.TallaID))?.toLocaleString() || "—"}
                                                </td>
                                                <td className="text-center">
                                                    <span className={`badge ${variante.Stock > 10 ? 'bg-success' :
                                                        variante.Stock > 0 ? 'bg-warning text-dark' :
                                                            'bg-danger'
                                                        }`}>
                                                        {variante.Stock}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <span className={`badge ${variante.Estado ? 'bg-success' : 'bg-secondary'
                                                        }`}>
                                                        {variante.Estado ? 'Disponible' : 'No disponible'}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex justify-content-center gap-1">
                                                        <button
                                                            className="btn btn-outline-warning btn-sm"
                                                            onClick={() => handleEditarVariante(index)}
                                                            title="Editar"
                                                        >
                                                            <FaCheck size={12} />
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleEliminarVariante(index)}
                                                            title="Eliminar"
                                                        >
                                                            <FaTrash size={12} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Botones finales */}
                        <div className="d-flex justify-content-end gap-2">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleVolver}
                                disabled={cargando}
                            >
                                {modoEdicion ? "Cancelar" : "Volver"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleGuardarVariantes}
                                disabled={cargando}
                            >
                                {cargando ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <FaCheck className="me-2" />
                                        {modoEdicion ? "Guardar Cambios" : "Finalizar"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgregarProducto;