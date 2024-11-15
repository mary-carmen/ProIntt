import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ListaAlumnos = () => {
    const [alumnos, setAlumnos] = useState([]);

    // Definimos un arreglo de colores más fuertes y vivos
    const colores = [
        '#FF5733', '#33FF57', '#3357FF', '#FF33A5', '#A533FF',
        '#FF8C33', '#33FFF1', '#FF3333', '#FF33F0', '#33FF9E'
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://alex.starcode.com.mx/apiAlumnos.php');
                const data = await response.json();
                setAlumnos(data);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
    }, []);

    const calcularPromedio = (practicas) => {
        const notas = Object.values(practicas).map(Number);
        const suma = notas.reduce((a, b) => a + b, 0);
        return (suma / notas.length).toFixed(2);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center" style={{ fontWeight: 'bold', fontSize: '2rem', letterSpacing: '1px' }}>
                CALIFICACIONES DEL ING. ALEX RAMÍREZ GALINDO
            </h1>
            <div className="row">
                {alumnos.map((alumno, index) => {
                    const practicas = alumno.practicas;
                    const promedio = calcularPromedio(practicas);
                    const aprobado = promedio >= 7;

                    const chartData = {
                        labels: ['Promedio'],
                        datasets: [
                            {
                                label: 'Promedio de Calificaciones',
                                data: [promedio], // Solo se muestra el promedio
                                backgroundColor: colores[index % colores.length],
                            },
                        ],
                    };

                    return (
                        <div key={index} className="col-md-6 mb-4">
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <strong>ID:</strong> {alumno.id}
                                    </h5>
                                    <p className="card-text"><strong>Cuenta:</strong> {alumno.cuenta}</p>
                                    <p className="card-text"><strong>Nombre:</strong> {alumno.nombre}</p>
                                    <p className="card-text"><strong>Promedio:</strong> {promedio}</p>
                                    <Bar data={chartData} />
                                    <div className="text-center mt-3">
                                        <button className={`btn ${aprobado ? 'btn-success' : 'btn-danger'}`}>
                                            {aprobado ? 'Aprobado' : 'Reprobado'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );   
};

export default ListaAlumnos;
