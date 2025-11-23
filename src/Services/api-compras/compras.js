import axios from "axios";

const API_URL = "http://localhost:3000/api/compras";

// Obtener todas las compras
export const getCompras = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log("Respuesta del backend:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las compras:", error);
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.mensaje || 
                           error.response?.data?.error ||
                           "Error al obtener las compras";
        throw new Error(errorMessage);
    }
};

// Obtener una compra por ID
export const getCompraById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.mensaje || 
                           "Error al obtener la compra";
        console.error("Error al obtener compra:", error);
        throw new Error(errorMessage);
    }
};

// Crear una nueva compra
export const createCompra = async (compra) => {
    try {
        const response = await axios.post(API_URL, compra);
        return {
            estado: true,
            mensaje: response.data.message || "Compra creada exitosamente",
            compra: response.data.compra
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.mensaje || 
                           "Error al crear la compra";
        console.error("Error al crear la compra:", error);
        throw new Error(errorMessage);
    }
};

// Actualizar una compra
export const updateCompra = async (id, compra) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, compra);
        return {
            estado: true,
            mensaje: response.data.message || "Compra actualizada exitosamente",
            compra: response.data.compra
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.mensaje || 
                           "Error al actualizar la compra";
        console.error("Error al actualizar la compra:", error);
        throw new Error(errorMessage);
    }
};

// Eliminar una compra
export const deleteCompra = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return {
            estado: true,
            mensaje: response.data.message || "Compra eliminada exitosamente"
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.mensaje || 
                           "Error al eliminar la compra";
        console.error("Error al eliminar la compra:", error);
        throw new Error(errorMessage);
    }
};

// Obtener todos los proveedores (para el dropdown)
export const getProveedores = async () => {
    try {
        const response = await axios.get("http://localhost:3000/api/proveedores");
        return response.data;
    } catch (error) {
        console.error("Error al obtener proveedores:", error);
        throw new Error("Error al cargar proveedores");
    }
};

