// src/services/colores/coloresService.js

import axios from "axios";

const API_URL = "http://localhost:3001/colores"; // Cambia el puerto si es necesario

// =================== LISTAR ===================
export const getColores = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data; // { estado: true/false, datos: [...] }
    } catch (error) {
        console.error("Error en getColores:", error);
        throw error;
    }
};

// =================== OBTENER POR ID ===================
export const getColorById = async (colorID) => {
    try {
        const response = await axios.get(`${API_URL}/${colorID}`);
        return response.data;
    } catch (error) {
        console.error("Error en getColorById:", error);
        throw error;
    }
};

// =================== CREAR ===================
export const createColor = async (nuevoColor) => {
    try {
        const response = await axios.post(API_URL, nuevoColor);
        return response.data;
    } catch (error) {
        console.error("Error en createColor:", error);
        throw error;
    }
};

// =================== EDITAR ===================
export const updateColor = async (colorActualizado) => {
    try {
        const response = await axios.put(`${API_URL}/${colorActualizado.ColorID}`, colorActualizado);
        return response.data;
    } catch (error) {
        console.error("Error en updateColor:", error);
        throw error;
    }
};

// =================== ELIMINAR ===================
export const deleteColor = async (colorID) => {
    try {
        const response = await axios.delete(`${API_URL}/${colorID}`);
        return response.data;
    } catch (error) {
        console.error("Error en deleteColor:", error);
        throw error;
    }
};
