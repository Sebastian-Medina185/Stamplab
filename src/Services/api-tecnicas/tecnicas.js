import axios from "axios";

const API_URL = "http://localhost:3000/api/tecnicas";

export const getAllTecnicas = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createTecnica = async (data) => {
  // ¡Asegurarnos que se envíe un objeto JSON correctamente!
  const response = await axios.post(API_URL, {
    Nombre: data.Nombre,
    Descripcion: data.Descripcion || "",
    ImagenTecnica: data.ImagenTecnica || "",
    Estado: data.Estado !== undefined ? data.Estado : true
  });
  return response.data;
};

export const updateTecnica = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteTecnica = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
