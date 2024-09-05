import React, { useState, useEffect } from 'react';
import PossessionsTable from './PossessionTable';

function Possessions() {
    const [possessions, setPossessions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedPossession, setSelectedPossession] = useState(null);
    const [formData, setFormData] = useState({
        possesseur: '',
        libelle: '',
        valeur: '',
        dateDebut: '',
        dateFin: '',
        tauxAmortissement: '',
        jour: '',
        valeurConstante: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/possessions')
            .then(response => response.json())
            .then(data => {
                setPossessions(data);
                setLoading(false);
            })
            .catch(error => {
                setError('Erreur de chargement des possessions');
                setLoading(false);
                console.error('Erreur:', error);
            });
    }, []);

    const handleShowModal = (mode, possession = null) => {
        setModalMode(mode);
        setSelectedPossession(possession);
        setFormData(possession || {
            possesseur: '',
            libelle: '',
            valeur: '',
            dateDebut: '',
            dateFin: '',
            tauxAmortissement: '',
            jour: '',
            valeurConstante: ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (modalMode === 'create') {
            fetch('http://localhost:3001/possession/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(newPossession => {
                    setPossessions([...possessions, newPossession]);
                    handleCloseModal();
                })
                .catch(error => console.error('Erreur:', error));
        } else if (modalMode === 'update') {
            fetch(`http://localhost:3001/possession/${selectedPossession.libelle}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(updatedPossession => {
                    setPossessions(possessions.map(p => p.libelle === updatedPossession.libelle ? updatedPossession : p));
                    handleCloseModal();
                })
                .catch(error => console.error('Erreur:', error));
        }
    };

    const handleClosePossession = (libelle) => {
        const today = new Date().toISOString();
        fetch(`http://localhost:3001/possession/${libelle}/update`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dateFin: today })
        })
            .then(response => response.json())
            .then(updatedPossession => {
                setPossessions(possessions.map(p => p.libelle === updatedPossession.libelle ? updatedPossession : p));
            })
            .catch(error => console.error('Erreur:', error));
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>{error}</p>;

    return (
        <PossessionsTable
            possessions={possessions}
            showModal={showModal}
            modalMode={modalMode}
            formData={formData}
            handleShowModal={handleShowModal}
            handleCloseModal={handleCloseModal}
            handleFormChange={handleFormChange}
            handleSubmit={handleSubmit}
            handleClosePossession={handleClosePossession}
        />
    );
}

export default Possessions;
