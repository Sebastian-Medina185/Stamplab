import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; 


// NUEVO ENDPOINT INTELIGENTE
export const createCotizacionInteligente = async (cotizacionData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/cotizaciones/inteligente`, cotizacionData);
        return response.data;
    } catch (error) {
        console.error('Error al crear cotización inteligente:', error);
        throw error.response?.data || error;
    }
};


// ==================== PRODUCTOS ====================
export const getProductos = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/productos`);
    if (!res.ok) throw new Error("Error al cargar productos");
    const data = await res.json();
    return data.datos || data;
  } catch (error) {
    console.error("Error en getProductos:", error);
    throw error;
  }
};

// ==================== TÉCNICAS ====================
export const getTecnicas = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/tecnicas`);
    if (!res.ok) throw new Error("Error al cargar técnicas");
    const data = await res.json();
    return data.datos || data;
  } catch (error) {
    console.error("Error en getTecnicas:", error);
    throw error;
  }
};

// ==================== PARTES ====================
export const getPartes = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/partes`);
    if (!res.ok) throw new Error("Error al cargar partes");
    const data = await res.json();
    return data.datos || data;
  } catch (error) {
    console.error("Error en getPartes:", error);
    throw error;
  }
};

// ==================== COLORES ====================
export const getColores = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/colores`);
    if (!res.ok) throw new Error("Error al cargar colores");
    const data = await res.json();
    return data.datos || data;
  } catch (error) {
    console.error("Error en getColores:", error);
    throw error;
  }
};

// ==================== TALLAS ====================
export const getTallas = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/tallas`);
    if (!res.ok) throw new Error("Error al cargar tallas");
    const data = await res.json();
    return data.datos || data;
  } catch (error) {
    console.error("Error en getTallas:", error);
    throw error;
  }
};

// ==================== TELAS (INSUMOS TIPO TELA) ====================
export const getTelas = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/insumos`);
    if (!res.ok) throw new Error("Error al cargar telas");
    const data = await res.json();
    const insumos = data.datos || data;
    // Filtrar solo insumos de tipo "Tela"
    return insumos.filter(i => i.Tipo?.toLowerCase() === "tela");
  } catch (error) {
    console.error("Error en getTelas:", error);
    throw error;
  }
};

// ==================== CREAR COTIZACIÓN COMPLETA ====================
export const createCotizacionCompleta = async (cotizacionData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/cotizaciones/completa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cotizacionData)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al crear cotización");
    }

    return await res.json();
  } catch (error) {
    console.error("Error en createCotizacionCompleta:", error);
    throw error;
  }
};