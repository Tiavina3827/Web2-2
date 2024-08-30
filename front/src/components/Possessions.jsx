import React, { useState, useEffect } from "react";
import PossessionForm from "./PossessionForm"; // Assure-toi que le chemin est correct
import { Table, Button } from 'react-bootstrap'; // Import des composants Bootstrap

function Possessions() {
    const [possessions, setPossessions] = useState([]);
    const [editPossession, setEditPossession] = useState(null); // Pour stocker la possession en cours d'édition
    const [isCreating, setIsCreating] = useState(false); // Pour déterminer si nous créons une nouvelle possession

    useEffect(() => {
        fetch('http://localhost:3001/possessions')
            .then(res => res.json())
            .then(data => setPossessions(data))
            .catch(err => console.error(err));
    }, []);

    const handleEditClick = (possession) => {
        setEditPossession(possession); // Active le mode édition
    };

    const handleSave = (possession) => {
        const method = editPossession ? 'PUT' : 'POST';
        const url = editPossession
            ? `http://localhost:3001/possession/${possession.libelle}/update`
            : 'http://localhost:3001/possession/create';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(possession),
        })
            .then(res => res.json())
            .then(data => {
                if (editPossession) {
                    setPossessions(possessions.map(p => p.libelle === data.libelle ? data : p));
                } else {
                    setPossessions([...possessions, data]);
                }
                setEditPossession(null); // Désactive le mode édition
                setIsCreating(false); // Désactive le mode création
            })
            .catch(err => console.error(err));
    };

    const handleDeleteClick = (libelle) => {
        fetch(`http://localhost:3001/possession/${libelle}/delete`, {
            method: 'DELETE',
        })
            .then(() => {
                setPossessions(possessions.filter(p => p.libelle !== libelle));
            })
            .catch(err => console.error(err));
    };

    const handleCancel = () => {
        setEditPossession(null); // Annule l'édition
        setIsCreating(false); // Annule la création
    };

    const handleCreateClick = () => {
        setIsCreating(true); // Active le mode création
    };

    return (
        <div className="possessions-container">
            <h1 className="headText">Liste des possessions</h1>
            {editPossession || isCreating ? (
                <PossessionForm
                    possession={editPossession}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            ) : (
                <div className="main">
                    <Table striped bordered hover id="Table">
                        <thead>
                        <tr>
                            <th>Libellé</th>
                            <th>Valeur</th>
                            <th>Date de début</th>
                            <th>Date de fin</th>
                            <th>Taux d'amortissement</th>
                            <th>Jour</th>
                            <th>Valeur constante</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {possessions.map((possession, index) => (
                            <tr key={index}>
                                <td>{possession.libelle}</td>
                                <td>{possession.valeur}</td>
                                <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                                <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : "N/A"}</td>
                                <td>{possession.tauxAmortissement || "N/A"}</td>
                                <td>{possession.jour || "N/A"}</td>
                                <td>{possession.valeurConstante || "N/A"}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEditClick(possession)}>Modifier</Button>
                                    <Button variant="danger" onClick={() => handleDeleteClick(possession.libelle)}>Supprimer</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Button className="add-button" variant="primary" onClick={handleCreateClick}>Ajouter une nouvelle possession</Button>
                </div>
            )}
        </div>
    );
}

export default Possessions;
