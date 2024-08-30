import React, { useState, useEffect } from "react";

function PossessionForm({ possession, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        possesseur: possession ? possession.possesseur.nom : "",
        libelle: possession ? possession.libelle : "",
        valeur: possession ? possession.valeur : "",
        dateDebut: possession ? possession.dateDebut : "",
        dateFin: possession ? possession.dateFin : "",
        tauxAmortissement: possession ? possession.tauxAmortissement : "",
        jour: possession ? possession.jour : "",
        valeurConstante: possession ? possession.valeurConstante : "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="contForm">
            <label>
                Nom du possesseur:
                <input
                    type="text"
                    name="possesseur"
                    value={formData.possesseur}
                    onChange={handleChange}
                />
            </label>
            <label>
                Libellé:
                <input
                    type="text"
                    name="libelle"
                    value={formData.libelle}
                    onChange={handleChange}
                />
            </label>
            <label>
                Valeur:
                <input
                    type="number"
                    name="valeur"
                    value={formData.valeur}
                    onChange={handleChange}
                />
            </label>
            <label>
                Date de début:
                <input
                    type="date"
                    name="dateDebut"
                    value={formData.dateDebut}
                    onChange={handleChange}
                />
            </label>
            <label>
                Date de fin:
                <input
                    type="date"
                    name="dateFin"
                    value={formData.dateFin}
                    onChange={handleChange}
                />
            </label>
            <label>
                Taux d'amortissement:
                <input
                    type="number"
                    name="tauxAmortissement"
                    value={formData.tauxAmortissement}
                    onChange={handleChange}
                />
            </label>
            <label>
                Jour:
                <input
                    type="number"
                    name="jour"
                    value={formData.jour}
                    onChange={handleChange}
                />
            </label>
            <label>
                Valeur constante:
                <input
                    type="number"
                    name="valeurConstante"
                    value={formData.valeurConstante}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onCancel}>Annuler</button>
        </form>
    );
}

export default PossessionForm;
