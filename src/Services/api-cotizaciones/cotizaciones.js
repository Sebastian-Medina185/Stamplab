import axios from 'axios';

const API_URL = 'http://localhost:3000/api/cotizaciones';

export const getCotizaciones = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje || 'Error al obtener las cotizaciones');
    }
};

export const getCotizacionById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje || 'Error al obtener la cotización');
    }
};

export const createCotizacion = async (cotizacionData) => {
    try {
        const response = await axios.post(API_URL, cotizacionData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje || 'Error al crear la cotización');
    }
};

export const updateCotizacion = async (id, cotizacionData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, cotizacionData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje || 'Error al actualizar la cotización');
    }
};

export const deleteCotizacion = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje || 'Error al eliminar la cotización');
    }
};