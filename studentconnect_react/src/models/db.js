// models/db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "tu_usuario",
  password: "tu_contraseña",
  database: "tu_base_de_datos"
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Conectado a MySQL");
});

module.exports = db;
