// src/services/proveedores/proveedoresService.js
import axios from "axios";

const API_URL = "http://localhost:3001/proveedores";

// Obtener todos los proveedores
export const getProveedores = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error en getProveedores:", error);
        throw error;
    }
};

// Obtener un proveedor por NIT
export const getProveedorByNit = async (nit) => {
    try {
        const response = await axios.get(`${API_URL}/${nit}`);
        return response.data;
    } catch (error) {
        console.error("Error en getProveedorByNit:", error);
        throw error;
    }
};

// Crear un proveedor
export const createProveedor = async (nuevoProveedor) => {
    try {
        // Transformar los datos al formato que espera el backend
        const proveedorData = {
            Nit: nuevoProveedor.nit,
            Nombre: nuevoProveedor.nombre,
            Correo: nuevoProveedor.correo,
            Telefono: nuevoProveedor.telefono,
            Direccion: nuevoProveedor.direccion,
            Estado: Boolean(nuevoProveedor.estado)
        };

        console.log('Datos enviados al servidor:', proveedorData);
        const response = await axios.post(API_URL, proveedorData);
        return response.data;
    } catch (error) {
        console.error("Error en createProveedor:", error.response?.data || error);
        throw error;
    }
};

// Editar un proveedor
export const updateProveedor = async (nit, proveedorActualizado) => {
    try {
        // Transformar los datos al mismo formato que createProveedor
        const proveedorData = {
            Nombre: proveedorActualizado.nombre,
            Correo: proveedorActualizado.correo,
            Telefono: proveedorActualizado.telefono,
            Direccion: proveedorActualizado.direccion,
            Estado: Boolean(proveedorActualizado.estado)
        };

        console.log('Datos enviados al servidor:', proveedorData);
        const response = await axios.put(`${API_URL}/${nit}`, proveedorData);
        return response.data;
    } catch (error) {
        console.error("Error en updateProveedor:", error.response?.data || error);
        throw error;
    }
};

// Eliminar un proveedor
export const deleteProveedor = async (nit) => {
    try {
        const response = await axios.delete(`${API_URL}/${nit}`);
        return response.data;
    } catch (error) {
        console.error("Error en deleteProveedor:", error);
        throw error;
    }
};