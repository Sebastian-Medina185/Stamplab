import axios from 'axios';

const API_URL = 'http://localhost:3000/api/detalleCotizacion';

export const getDetallesCotizacion = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje || 'Error al obtener los detalles de cotización');
    }
};

export const getDetalleCotizacionById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje || 'Error al obtener el detalle de cotización');
    }
};

export const createDetalleCotizacion = async (detalleData) => {
    try {
        const response = await axios.post(API_URL, detalleData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje || 'Error al crear el detalle de cotización');
    }
};

export const updateDetalleCotizacion = async (id, detalleData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, detalleData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje || 'Error al actualizar el detalle de cotización');
    }
};

export const deleteDetalleCotizacion = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.mensaje || 'Error al eliminar el detalle de cotización');
    }
};