import axios from "axios";

const API_URL = "http://localhost:3000/api/proveedores";

// Obtener todos los proveedores
export const getProveedores = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log("Respuesta del backend:", response.data);
        
        // ✅ CAMBIO: Retornar response.data directamente
        return response.data;
    } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        console.error("Detalles del error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.mensaje || 
                           error.response?.data?.error ||
                           "Error al obtener los proveedores";
        
        throw new Error(errorMessage);
    }
};

// Crear un nuevo proveedor
export const createProveedor = async (proveedor) => {
    try {
        const response = await axios.post(API_URL, proveedor);
        
        // ✅ CAMBIO: Retornar un objeto con estado y mensaje
        return {
            estado: true,
            mensaje: response.data.message || "Proveedor creado exitosamente",
            proveedor: response.data.proveedor
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.mensaje || 
                           "Error al crear el proveedor";
        console.error("Error al crear el proveedor:", error);
        
        throw new Error(errorMessage);
    }
};

// Actualizar un proveedor existente
export const updateProveedor = async (nit, proveedor) => {
    try {
        const response = await axios.put(`${API_URL}/${nit}`, proveedor);
        
        return {
            estado: true,
            mensaje: response.data.message || "Proveedor actualizado exitosamente",
            proveedor: response.data.proveedor
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.mensaje || 
                           "Error al actualizar el proveedor";
        console.error("Error al actualizar el proveedor:", error);
        
        throw new Error(errorMessage);
    }
};

// Eliminar un proveedor
export const deleteProveedor = async (nit) => {
    try {
        const response = await axios.delete(`${API_URL}/${nit}`);
        
        return {
            estado: true,
            mensaje: response.data.message || "Proveedor eliminado exitosamente"
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.mensaje || 
                           "Error al eliminar el proveedor";
        console.error("Error al eliminar el proveedor:", error);
        
        throw new Error(errorMessage);
    }
};

// Cambiar estado de un proveedor (PATCH)
export const cambiarEstadoProveedor = async (nit, estado) => {
    try {
        const response = await axios.patch(`${API_URL}/${nit}`, { Estado: estado });
        
        return {
            estado: true,
            mensaje: response.data.message || "Estado actualizado exitosamente",
            proveedor: response.data.proveedor
        };
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.mensaje || 
                           "Error al cambiar el estado del proveedor";
        console.error("Error al cambiar estado:", error);
        
        throw new Error(errorMessage);
    }
};