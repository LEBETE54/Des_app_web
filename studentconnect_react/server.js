const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const asesoriasRoutes = require('./routes/asesoriasRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/asesorias', asesoriasRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
