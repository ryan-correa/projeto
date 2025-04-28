const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Listar contatos
app.get('/contatos', (req, res) => {
  db.query('SELECT * FROM contatos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Adicionar contato
app.post('/contatos', (req, res) => {
  const { nome, telefone, email, favorito } = req.body;
  db.query('INSERT INTO contatos (nome, telefone, email, favorito) VALUES (?, ?, ?, ?)',
    [nome, telefone, email, favorito || false],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, nome, telefone, email, favorito });
    }
  );
});

// Atualizar contato
app.put('/contatos/:id', (req, res) => {
  const { nome, telefone, email, favorito } = req.body;
  const { id } = req.params;
  db.query('UPDATE contatos SET nome=?, telefone=?, email=?, favorito=? WHERE id=?',
    [nome, telefone, email, favorito, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, nome, telefone, email, favorito });
    }
  );
});

// Remover contato
app.delete('/contatos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM contatos WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});