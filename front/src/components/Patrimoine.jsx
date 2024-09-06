import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import Possession from '../../models/possessions/Possession.js';
import PatrimoineClass from '../../models/Patrimoine.js';
import '../root.css'

import '../bootstrap-5.0.2-dist/css/bootstrap.min.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

function Patrimoine() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [chartData, setChartData] = useState({ datasets: [] });
    const [patrimoineValue, setPatrimoineValue] = useState(null);
    const [specificDate, setSpecificDate] = useState('');

    useEffect(() => {
        fetch('https://back-api1.onrender.com/possessions')
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);

        updateChartData(data, thirtyDaysAgo.toISOString().split('T')[0], today.toISOString().split('T')[0]);
    }, [data]);

    const updateChartData = (data, startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const dateRange = [];

        for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
            dateRange.push(new Date(date));
        }

        const possessions = data.map(p => new Possession(p.possesseur, p.libelle, p.valeur, new Date(p.dateDebut), p.dateFin ? new Date(p.dateFin) : null, p.tauxAmortissement));
        const patrimoine = new PatrimoineClass('John Doe', possessions);

        const values = dateRange.map(date => patrimoine.getValeur(date));
        const labels = dateRange.map(date => date.toLocaleDateString());

        setChartData({
            labels,
            datasets: [
                {
                    label: 'Valeur du patrimoine',
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1,
                },
            ],
        });

        const totalValue = values[values.length - 1] || 0;
        setPatrimoineValue(totalValue);
    };

    const handleCheckValue = () => {
        if (startDate && endDate) {
            updateChartData(data, startDate, endDate);
        } else {
            alert('Veuillez sélectionner une date de début et une date de fin.');
        }
    };

    const handleSpecificDateChange = (e) => {
        setSpecificDate(e.target.value);

        if (specificDate) {
            const specificDateObj = new Date(specificDate);
            const possessions = data.map(p => new Possession(p.possesseur, p.libelle, p.valeur, new Date(p.dateDebut), p.dateFin ? new Date(p.dateFin) : null, p.tauxAmortissement));
            const patrimoine = new PatrimoineClass('John Doe', possessions);
            const valueAtSpecificDate = patrimoine.getValeur(specificDateObj);

            setPatrimoineValue(valueAtSpecificDate);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Patrimoine de John Doe</h1>
            <div className="mb-4">
                <Line data={chartData} />
            </div>
            <div className="text-center mb-4">

                <div className="d-flex justify-content-center mb-3">
                    <div className="me-3">
                        <label htmlFor="start-date" className="form-label">Date de début :</label>
                        <input
                            type="date"
                            id="start-date"
                            className="form-control"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="end-date" className="form-label">Date de fin :</label>
                        <input
                            type="date"
                            id="end-date"
                            className="form-control"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <button onClick={handleCheckValue} className="btn btn-primary">Valider</button>
            </div>
            <div className="text-center mt-4">
                <div className="d-flex justify-content-center mb-3">
                    <div>
                        <label htmlFor="specific-date" className="form-label">Date spécifique :</label>
                        <input
                            type="date"
                            id="specific-date"
                            className="form-control"
                            value={specificDate}
                            onChange={handleSpecificDateChange}
                        />
                        {patrimoineValue !== null && (
                            <div>
                                <h2>Valeur du patrimoine au {new Date(specificDate).toLocaleDateString()} :</h2>
                                <h3>{patrimoineValue} Ar</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Patrimoine;
