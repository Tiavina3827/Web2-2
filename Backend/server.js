const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, '../Data/db.json');
let rawData = fs.readFileSync(dataFilePath);
let data = JSON.parse(rawData);

const saveData = () => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.get('/data', (req, res) => {
    res.json(data);
});

app.get('/data/0', (req, res) => {
    res.json(data[0]);
});

app.get('/api/personne/:nom', (req, res) => {
    const nom = req.params.nom;
    const personne = data.find(item => item.model === "Personne" && item.data.nom === nom);
    if (personne) {
        res.json(personne);
    } else {
        res.status(404).json({ message: "Personne non trouvée" });
    }
});

app.get('/api/patrimoine/:nom', (req, res) => {
    const nom = req.params.nom;
    const patrimoine = data.find(item => item.model === "Patrimoine" && item.data.possesseur.nom === nom);
    if (patrimoine) {
        res.json(patrimoine);
    } else {
        res.status(404).json({ message: "Patrimoine non trouvé" });
    }
});

app.get('/possessions', (req, res) => {
    const patrimoine = data.find(item => item.model === 'Patrimoine');
    if (patrimoine && patrimoine.data && patrimoine.data.possessions) {
        res.json(patrimoine.data.possessions);
    } else {
        res.status(404).json({ message: 'Aucune possession trouvée' });
    }
});

// POST /possession/create - Créer une nouvelle possession
app.post('/possession/create', (req, res) => {
    const patrimoine = data.find(item => item.model === 'Patrimoine');
    if (!patrimoine || !patrimoine.data || !patrimoine.data.possessions) {
        return res.status(404).json({ message: 'Patrimoine non trouvé' });
    }

    const newPossession = req.body;
    patrimoine.data.possessions.push(newPossession);
    saveData();

    res.status(201).json(newPossession);
});

// PUT /possession/:libelle/update - Mettre à jour une possession par son libellé
app.put('/possession/:libelle/update', (req, res) => {
    const { libelle } = req.params;
    const updatedPossession = req.body;

    const patrimoine = data.find(item => item.model === 'Patrimoine');
    if (!patrimoine || !patrimoine.data || !patrimoine.data.possessions) {
        return res.status(404).json({ message: 'Patrimoine non trouvé' });
    }

    const index = patrimoine.data.possessions.findIndex(p => p.libelle === libelle);
    if (index === -1) {
        return res.status(404).json({ message: 'Possession non trouvée' });
    }

    patrimoine.data.possessions[index] = { ...patrimoine.data.possessions[index], ...updatedPossession };
    saveData();

    res.json(patrimoine.data.possessions[index]);
});

// DELETE /possession/:libelle/delete - Supprimer une possession par son libellé
app.delete('/possession/:libelle/delete', (req, res) => {
    const { libelle } = req.params;

    const patrimoine = data.find(item => item.model === 'Patrimoine');
    if (!patrimoine || !patrimoine.data || !patrimoine.data.possessions) {
        return res.status(404).json({ message: 'Patrimoine non trouvé' });
    }

    const index = patrimoine.data.possessions.findIndex(p => p.libelle === libelle);
    if (index === -1) {
        return res.status(404).json({ message: 'Possession non trouvée' });
    }

    patrimoine.data.possessions.splice(index, 1);
    saveData();

    res.status(204).end(); // No Content
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
