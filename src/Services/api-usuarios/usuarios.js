// src/services/usuarios/usuariosService.js

import axios from "axios";

const API_URL = "http://localhost:3000/api/usuarios"; 

// Obtener todos los usuarios
export const getUsuarios = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // { estado: true/false, datos: [...] }
    } catch (error) {
        console.error("Error en getUsuarios:", error);
        throw error;
    }
};

// Obtener un usuario por ID
export const getUsuarioById = async (documentoID) => {
    try {
        const response = await axios.get(`${API_URL}/${documentoID}`);
        return response.data;
    } catch (error) {
        console.error("Error en getUsuarioById:", error);
        throw error;
    }
};

// Crear un usuario
export const createUsuario = async (nuevoUsuario) => {
    try {
        const response = await axios.post(API_URL, nuevoUsuario);
        return response.data;
    } catch (error) {
        console.error("Error en createUsuario:", error);
        throw error;
    }
};

// Editar un usuario
export const updateUsuario = async (documentoID, usuarioActualizado) => {
    try {
        // Asegurar que RolID sea string y tenga máximo 2 caracteres
        if (usuarioActualizado.RolID) {
            usuarioActualizado.RolID = usuarioActualizado.RolID.toString().substring(0, 2);
        }
        
        console.log("Enviando actualización:", { documentoID, usuarioActualizado });
        const response = await axios.put(`${API_URL}/${documentoID}`, usuarioActualizado);
        console.log("Respuesta del servidor:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error en updateUsuario:", error);
        console.error("Detalles del error:", {
            mensaje: error.message,
            respuesta: error.response?.data
        });
        throw error;
    }
};


// Eliminar un usuario
export const deleteUsuario = async (documentoID) => {
    try {
        const response = await axios.delete(`${API_URL}/${documentoID}`);
        return response.data;
    } catch (error) {
        console.error("Error en deleteUsuario:", error);
        throw error;
    }
};

// Obtener roles disponibles
export const getRoles = async () => {
    try {
        const response = await axios.get(`${API_URL}/util/roles`);
        return response.data;
    } catch (error) {
        console.error("Error en getRoles:", error);
        throw error;
    }
};