import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import '../bootstrap-5.0.2-dist/css/bootstrap.css'

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
        <div className="container mt-4">
            <h1>Gestion des Possessions</h1>
            <Button variant="primary" onClick={() => handleShowModal('create')}>Ajouter une Possession</Button>
            <Table striped bordered hover className="mt-3">
                <thead>
                <tr>
                    <th>Possesseur</th>
                    <th>Libellé</th>
                    <th>Valeur</th>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Taux Amortissement</th>
                    <th>Jour</th>
                    <th>Valeur Constante</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {possessions.map((possession, index) => (
                    <tr key={index}>
                        <td>{possession.possesseur.nom}</td>
                        <td>{possession.libelle}</td>
                        <td>{possession.valeur}</td>
                        <td>{possession.dateDebut ? new Date(possession.dateDebut).toLocaleDateString() : 'N/A'}</td>
                        <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'N/A'}</td>
                        <td>{possession.tauxAmortissement}</td>
                        <td>{possession.jour || 'N/A'}</td>
                        <td>{possession.valeurConstante || 'N/A'}</td>
                        <td>
                            <Button variant="warning" onClick={() => handleShowModal('update', possession)}>Modifier</Button>
                            <Button variant="secondary" onClick={() => handleClosePossession(possession.libelle)} className="ml-2">Clôturer</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Modal pour Ajouter/Modifier une Possession */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalMode === 'create' ? 'Ajouter une Possession' : 'Modifier une Possession'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formPossesseur">
                            <Form.Label>Possesseur</Form.Label>
                            <Form.Control
                                type="text"
                                name="possesseur"
                                value={formData.possesseur}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formLibelle">
                            <Form.Label>Libellé</Form.Label>
                            <Form.Control
                                type="text"
                                name="libelle"
                                value={formData.libelle}
                                onChange={handleFormChange}
                                required
                                readOnly={modalMode === 'update'}
                            />
                        </Form.Group>
                        <Form.Group controlId="formValeur">
                            <Form.Label>Valeur</Form.Label>
                            <Form.Control
                                type="number"
                                name="valeur"
                                value={formData.valeur}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateDebut">
                            <Form.Label>Date Début</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateDebut"
                                value={formData.dateDebut}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateFin">
                            <Form.Label>Date Fin</Form.Label>
                            <Form.Control
                                type="date"
                                name="dateFin"
                                value={formData.dateFin}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formTauxAmortissement">
                            <Form.Label>Taux Amortissement</Form.Label>
                            <Form.Control
                                type="number"
                                name="tauxAmortissement"
                                value={formData.tauxAmortissement}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formJour">
                            <Form.Label>Jour</Form.Label>
                            <Form.Control
                                type="number"
                                name="jour"
                                value={formData.jour}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formValeurConstante">
                            <Form.Label>Valeur Constante</Form.Label>
                            <Form.Control
                                type="number"
                                name="valeurConstante"
                                value={formData.valeurConstante}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {modalMode === 'create' ? 'Ajouter' : 'Mettre à jour'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Possessions;
