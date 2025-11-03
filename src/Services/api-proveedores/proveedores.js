import axios from "axios";

const API_URL = "http://localhost:3000/api/proveedores"; // Cambia el puerto si tu backend usa otro

// Obtener todos los proveedores
export const getProveedores = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // ya es data
    } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        throw error;
    }
};

// Crear un nuevo proveedor
export const createProveedor = async (proveedor) => {
    try {
        const response = await axios.post(API_URL, proveedor);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            throw new Error("Ya existe un proveedor con ese nombre.");
        }
        console.error("Error al crear el proveedor:", error);
        throw error;
    }
};

// Actualizar un proveedor existente
export const updateProveedor = async (id, proveedor) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, proveedor);
        return response.data;
    } catch (error) {
        console.error("Error al actualizar el proveedor:", error);
        throw error;
    }
};

// Eliminar un proveedor
export const deleteProveedor = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al eliminar el proveedor:", error);
        throw error;
    }
};
