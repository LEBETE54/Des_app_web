const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'foto' ? 'profiles' : 'certificates';
    cb(null, `uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'foto': ['image/jpeg', 'image/png'],
    'certificado': ['application/pdf']
  };
  
  const fieldType = file.fieldname === 'foto' ? 'foto' : 'certificado';
  
  if (allowedTypes[fieldType].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;