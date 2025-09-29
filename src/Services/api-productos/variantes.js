import axios from "axios";

const API_URL = "http://localhost:3001/productosVariantes"; 

// Obtener variantes de un producto
export const getVariantesByProducto = async (productoId) => {
  const res = await axios.get(`${API_URL}/producto/${productoId}`);
  return res.data;
};

// Crear variante
export const createVariante = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

// Actualizar variante
export const updateVariante = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

// Eliminar variante
export const deleteVariante = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
