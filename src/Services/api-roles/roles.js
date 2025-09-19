// src/services/roles/rolesService.js

import axios from "axios";

const API_URL = "http://localhost:3001/roles"; // Cambia el puerto si es necesario

// Obtener todos los roles
export const getRoles = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // { estado: true/false, datos: [...] }
    } catch (error) {
        console.error("Error en getRoles:", error);
        throw error;
    }
};

// Crear un rol
export const createRol = async (nuevoRol) => {
    try {
        const response = await axios.post(API_URL, nuevoRol);
        return response.data;
    } catch (error) {
        console.error("Error en createRol:", error);
        throw error;
    }
};

// Editar un rol
export const updateRol = async (id, rolActualizado) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, rolActualizado);
        return response.data;
    } catch (error) {
        console.error("Error en updateRol:", error);
        throw error;
    }
};

// Eliminar un rol
// export const deleteRol = async (id) => {
//     try {
//         const response = await axios.delete(`${API_URL}/${id}`);
//         return response.data;
//     } catch (error) {
//         console.error("Error en deleteRol:", error);
//         throw error;
//     }
// };
export const deleteRol = async (id) => {
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
