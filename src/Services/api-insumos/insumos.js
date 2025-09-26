// src/services/insumos/insumosService.js

import axios from "axios";

const API_URL = "http://localhost:3001/insumos"; 

// Obtener todos los insumos
export const getInsumos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // { estado: true/false, datos: [...] }
  } catch (error) {
    console.error("Error en getInsumos:", error);
    throw error;
  }
};

// Obtener un insumo por ID
export const getInsumoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error en getInsumoById:", error);
    throw error;
  }
};

// Crear un insumo
export const createInsumo = async (nuevoInsumo) => {
  try {
    const response = await axios.post(API_URL, nuevoInsumo);
    return response.data;
  } catch (error) {
    console.error("Error en createInsumo:", error);
    throw error;
  }
};

// Editar un insumo
export const updateInsumo = async (id, insumoActualizado) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, insumoActualizado);
    return response.data;
  } catch (error) {
    console.error("Error en updateInsumo:", error);
    throw error;
  }
};

// Eliminar un insumo
export const deleteInsumo = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Error del backend
      console.error("Respuesta del servidor:", error.response.data);
    } else if (error.request) {
      // No hay respuesta (problema de conexión con el backend)
      console.error("No se recibió respuesta del servidor:", error.request);
    } else {
      // Otro error
      console.error("Error al configurar la petición:", error.message);
    }
    throw error;
  }
};

// Cambiar estado de un insumo
export const cambiarEstadoInsumo = async (id, nuevoEstado) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/estado`, { estado: nuevoEstado });
    return response.data;
  } catch (error) {
    console.error("Error en cambiarEstadoInsumo:", error);
    throw error;
  }
};
