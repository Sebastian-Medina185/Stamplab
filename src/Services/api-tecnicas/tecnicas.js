import axios from 'axios';

const API_URL = "http://localhost:3001/tecnicas";

// Obtener todas las técnicas
export const getTecnicas = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Error en getTecnicas:", error);
        throw error;
    }
};

// Crear una técnica
export const createTecnica = async (nuevaTecnica) => {
    try {
        const response = await axios.post(API_URL, nuevaTecnica);
        return response.data;
    } catch (error) {
        console.error("Error en createTecnica:", error);
        throw error;
    }
};

// Editar una técnica
export const updateTecnica = async (id, tecnicaActualizada) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, tecnicaActualizada);
        return response.data;
    } catch (error) {
        console.error("Error en updateTecnica:", error);
        throw error;
    }
};

// Eliminar una técnica
export const deleteTecnica = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error en deleteTecnica:", error);
        throw error;
    }
};