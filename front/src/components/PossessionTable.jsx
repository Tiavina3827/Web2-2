import { Table, Button, Form, Modal } from 'react-bootstrap';
import '../bootstrap-5.0.2-dist/css/bootstrap.min.css'
import '../root.css'

function PossessionsTable({
                              possessions,
                              showModal,
                              modalMode,
                              formData,
                              handleShowModal,
                              handleCloseModal,
                              handleFormChange,
                              handleSubmit,
                              handleClosePossession
                          }) {
    return (
        <div>
            <h1 className="text-center mb-4">Gestion des Possessions</h1>
            <Button variant="primary" onClick={() => handleShowModal('create')}>Ajouter une Possession</Button>
            <Table striped bordered hover responsive className="mt-3">
                <thead className="thead-dark">
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
                        <td>{possession.valeur.toLocaleString()} XOF</td>
                        <td>{possession.dateDebut ? new Date(possession.dateDebut).toLocaleDateString() : 'N/A'}</td>
                        <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : 'N/A'}</td>
                        <td>{possession.tauxAmortissement}%</td>
                        <td>{possession.jour || 'N/A'}</td>
                        <td>{possession.valeurConstante ? possession.valeurConstante.toLocaleString() : 'N/A'} XOF</td>
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
                            <Form.Label>Taux Amortissement (%)</Form.Label>
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
                            {modalMode === 'create' ? 'Ajouter' : 'Modifier'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default PossessionsTable;
