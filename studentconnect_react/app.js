const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
const asesoriasRoutes = require("./routes/asesoriasRoutes");
app.use("/api/asesorias", asesoriasRoutes); // Ahora los endpoints son /api/asesorias/...

// Servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
