import  { useState, useEffect } from 'react';
import PossessionsTable from './PossessionTable';
import { Container, Spinner, Alert } from 'react-bootstrap';
import '../bootstrap-5.0.2-dist/css/bootstrap.min.css'

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
        fetch('https://back-api1.onrender.com/possessions')
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
            fetch('https://back-api1.onrender.com/possession/create', {
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
            fetch(`https://back-api1.onrender.com/possession/${selectedPossession.libelle}/update`, {
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
        fetch(`https://back-api1.onrender.com/possession/${libelle}/update`, {
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

    if (loading) return <Container className="mt-4 text-center"><Spinner animation="border" /></Container>;
    if (error) return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;

    return (
        <Container className="mt-4">
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
        </Container>
    );
}

export default Possessions;
