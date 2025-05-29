const Asesoria = require('../models/asesoriaModel');

exports.getAsesorias = (req, res) => {
  Asesoria.getAll((err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.createAsesoria = (req, res) => {
  Asesoria.create(req.body, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ id: result.insertId, ...req.body });
  });
};

exports.updateAsesoria = (req, res) => {
  Asesoria.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).send(err);
    res.send('Actualizado');
  });
};

exports.deleteAsesoria = (req, res) => {
  Asesoria.delete(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    res.send('Eliminado');
  });
};
