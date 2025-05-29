import axios from 'axios';

const API = 'http://localhost:4000/api/asesorias';

export const obtenerAsesorias = () => axios.get(API);
export const crearAsesoria = (data) => axios.post(API, data);
export const actualizarAsesoria = (id, data) => axios.put(`${API}/${id}`, data);
export const eliminarAsesoria = (id) => axios.delete(`${API}/${id}`);
