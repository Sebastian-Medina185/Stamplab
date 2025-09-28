import axios from "axios";

const API_URL = "http://localhost:3001";

export const getTelas = async () => {
  const res = await axios.get(`${API_URL}/telas`);
  return res.data;
};

export const getColores = async () => {
  const res = await axios.get(`${API_URL}/colores`);
  return res.data;
};

export const getTallas = async () => {
  const res = await axios.get(`${API_URL}/tallas`);
  return res.data.datos;
};
