const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.put(
  '/',
  authMiddleware,
  upload.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'certificado', maxCount: 5 }
  ]),
  profileController.updateProfile
);

module.exports = router;