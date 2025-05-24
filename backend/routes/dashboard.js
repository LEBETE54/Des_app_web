// Agrega este nuevo endpoint
router.get('/public/dashboard', async (req, res) => {
  try {
    // Datos de demostración (puedes personalizarlos)
    const demoData = {
      usuario: {
        nombre: "Invitado",
        carrera: "Ingeniería de Ejemplo",
        semestre: 3,
        foto_perfil: "/default-profile.png",
        habilidades: ["React", "Node.js", "JavaScript"]
      },
      asesorias: [
        {
          id: 1,
          titulo: "Introducción a React",
          fecha: "2024-01-15",
          estado: "completada"
        },
        {
          id: 2,
          titulo: "Fundamentos de Node.js",
          fecha: "2024-02-01",
          estado: "pendiente"
        }
      ]
    };

    res.status(200).json(demoData);

  } catch (error) {
    console.error('Error en endpoint público:', error);
    res.status(500).json({ message: 'Error cargando datos públicos' });
  }
});