import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

function Patrimoine() {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [chartData, setChartData] = useState({ datasets: [] });
    const [patrimoineValue, setPatrimoineValue] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/possessions')
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        // Afficher le graphique avec une période par défaut de 30 jours
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

        const values = dateRange.map(date => {
            const possessionsOnDate = data.filter(possession =>
                (!possession.dateDebut || new Date(possession.dateDebut) <= date) &&
                (!possession.dateFin || new Date(possession.dateFin) >= date)
            );

            return possessionsOnDate.reduce((total, possession) => total + parseFloat(possession.valeur), 0);
        });

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

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '100px' }}>
            <h1 style={{textAlign: 'center',padding:'4%'}}>Patrimoine de John Doe</h1>
            <div style={{ width: '80%', margin: '0 auto' }}>
                <Line data={chartData} />
            </div>
            {patrimoineValue !== null && (
                <div style={{ marginTop: '20px',marginLeft: '30%' }}>
                    <h2>Valeur du patrimoine au {new Date(endDate).toLocaleDateString()} :</h2>
                    <p style={{marginLeft:"20%"}}>{patrimoineValue} </p>
                </div>
            )}
            <div style={{  bottom: '20px', width: '80%', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' , flexDirection:"column",alignItems:"center",left:"40%"}}>
                    <div>
                        <label htmlFor="start-date">Date de début :</label>
                        <input
                            type="date"
                            id="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="end-date">Date de fin :</label>
                        <input
                            type="date"
                            id="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <button onClick={handleCheckValue} style={{ marginLeft: '10px' }}>Valider</button>
                </div>
            </div>
        </div>
    );
}

export default Patrimoine;
