require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // <- Nuevo
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profile'); // <- Nuevo

const app = express();

// Mejorar configuración CORS
app.use(cors({
  origin: 'http://localhost:3000', // Permitir solo tu frontend
  methods: ['GET', 'POST', 'PUT'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Headers permitidos
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // <- Nuevo

// Rutas existentes
app.use('/api/auth', authRoutes);

app.use('/api/profile', profileRoutes); // <- Nuevo

const PORT = process.env.PORT || 3001; // Cambiar puerto para evitar conflictos
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});