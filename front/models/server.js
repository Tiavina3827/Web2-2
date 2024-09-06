const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware pour analyser les requêtes JSON
app.use(bodyParser.json());

// Route pour ajouter une nouvelle possession
app.post('/add-possession', (req, res) => {
  const newPossession = req.body;

  // Lire le fichier db.json
  const filePath = path.join(__dirname, 'data2.json');
  let data = [];

  if (fs.existsSync(filePath)) {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  // Ajouter la nouvelle possession
  data.push(newPossession);

  // Écrire les données mises à jour dans db.json
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

  res.status(200).send('Possession ajoutée avec succès!');
});

// Route pour obtenir toutes les possessions
app.get('/possessions', (req, res) => {
  const filePath = path.join(__dirname, 'db.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.json(data);
  } else {
    res.json([]);
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
