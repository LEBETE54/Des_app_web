const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // Ajusta la ruta si es necesario


router.post('/register', register);


router.post('/login', login);

module.exports = router;