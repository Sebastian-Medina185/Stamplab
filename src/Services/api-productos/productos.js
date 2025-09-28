// services/api-productos/productos.js
import axios from "axios";

const API_URL = "http://localhost:3001/productos";

// ✅ Obtener todos los productos
export const getProductos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    throw error;
  }
};

// ✅ Crear un nuevo producto
export const createProducto = async (productoData) => {
  console.log("📦 Datos que se envían al backend:", productoData); // 👈 añade esto
  try {

    const response = await axios.post(API_URL, productoData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al crear producto:", error);
    throw error;
  }
};

// ✅ Obtener producto por ID
export const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener producto:", error);
    throw error;
  }
};

// ✅ Actualizar producto
export const updateProducto = async (id, productoData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productoData);
    return response.data;
  } catch (error) {
    console.error("❌ Error al actualizar producto:", error);
    throw error;
  }
};

// ✅ Eliminar producto
export const deleteProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error al eliminar producto:", error);
    throw error;
  }
};
