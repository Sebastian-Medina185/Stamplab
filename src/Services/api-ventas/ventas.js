import axios from "axios";

const API_URL = "http://localhost:3000/api/ventas";

// Obtener token del localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

// Obtener todas las ventas
export const getVentas = async () => {
    try {
        const response = await axios.get(API_URL, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        throw error;
    }
};

// Obtener una venta por ID
export const getVentaById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error al obtener venta:", error);
        throw error;
    }
};

// Crear una nueva venta
export const createVenta = async (ventaData) => {
    try {
        const response = await axios.post(API_URL, ventaData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error al crear venta:", error);
        throw error;
    }
};

// Actualizar una venta
export const updateVenta = async (id, ventaData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, ventaData, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error al actualizar venta:", error);
        throw error;
    }
};

// Actualizar solo el estado de una venta
export const updateEstadoVenta = async (id, estadoID) => {
    try {
        const response = await axios.put(
            `${API_URL}/${id}`,
            { EstadoID: estadoID },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar estado:", error);
        throw error;
    }
};

// Eliminar una venta
export const deleteVenta = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        return response.data;
    } catch (error) {
        console.error("Error al eliminar venta:", error);
        throw error;
    }
};