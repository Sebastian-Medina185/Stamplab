// src/services/proveedores/proveedoresService.js
import axios from "axios";

const API_URL = "http://localhost:3001/proveedores"; // Cambia el puerto si es necesario

// Obtener todos los proveedores
export const getProveedores = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // { estado: true/false, datos: [...] }
    } catch (error) {
        console.error("Error en getProveedores:", error);
        throw error;
    }
};

// Crear un proveedor
export const createProveedor = async (nuevoProveedor) => {
    try {
        const response = await axios.post(API_URL, nuevoProveedor);
        return response.data;
    } catch (error) {
        console.error("Error en createProveedor:", error);
        throw error;
    }
};

// Editar un proveedor (usando NIT como ID)
export const updateProveedor = async (nit, proveedorActualizado) => {
    try {
        const response = await axios.put(`${API_URL}/${nit}`, proveedorActualizado);
        return response.data;
    } catch (error) {
        console.error("Error en updateProveedor:", error);
        throw error;
    }
};

// Eliminar un proveedor (usando NIT como ID)
export const deleteProveedor = async (nit) => {
    try {
        const response = await axios.delete(`${API_URL}/${nit}`);
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

// Obtener un proveedor específico por NIT (opcional)
export const getProveedorByNit = async (nit) => {
    try {
        const response = await axios.get(`${API_URL}/${nit}`);
        return response.data;
    } catch (error) {
        console.error("Error en getProveedorByNit:", error);
        throw error;
    }
};