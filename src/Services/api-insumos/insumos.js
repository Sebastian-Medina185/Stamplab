// src/services/insumos/insumosService.js

import axios from "axios";

const API_URL = "http://localhost:3001/insumos"; // 👈 cámbialo si tu backend está en otro puerto o deployado

// Obtener todos los insumos
export const getInsumos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data; // { estado: true/false, datos: [...] }
  } catch (error) {
    console.error("❌ Error en getInsumos:", error);
    throw error;
  }
};

// Crear un insumo
export const createInsumo = async (nuevoInsumo) => {
  try {
    const response = await axios.post(API_URL, nuevoInsumo);
    return response.data;
  } catch (error) {
    console.error("❌ Error en createInsumo:", error);
    throw error;
  }
};

// Editar un insumo
export const updateInsumo = async (id, insumoActualizado) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, insumoActualizado);
    return response.data;
  } catch (error) {
    console.error("❌ Error en updateInsumo:", error);
    throw error;
  }
};
