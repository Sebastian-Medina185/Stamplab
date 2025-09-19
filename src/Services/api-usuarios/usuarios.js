// src/services/usuarios/usuariosService.js

import axios from "axios";

const API_URL = "http://localhost:3001/usuarios"; // Cambia el puerto si es necesario

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
        const response = await axios.put(`${API_URL}/${documentoID}`, usuarioActualizado);
        return response.data;
    } catch (error) {
        console.error("Error en updateUsuario:", error);
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