import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Papa from 'papaparse';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import classes from './Graphics.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Graphics() {
  const [equipmentTypeCounts, setEquipmentTypeCounts] = useState<Record<string, number>>({});
  const [failurePointCounts, setFailurePointCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    Papa.parse('/final_dataset_filtered1.csv', {
      download: true,
      header: true,
      complete: (result) => {
        const data = result.data as Record<string, string | undefined>[];

        const equipmentCounts: Record<string, number> = {};
        const failureCounts: Record<string, number> = {};

        data.forEach((row) => {
          const equipmentType = row["Тип оборудования"];
          const failurePoint = row["Точка отказа"];

          if (equipmentType) {
            equipmentCounts[equipmentType] = (equipmentCounts[equipmentType] || 0) + 1;
          }

          if (failurePoint) {
            failureCounts[failurePoint] = (failureCounts[failurePoint] || 0) + 1;
          }
        });

        setEquipmentTypeCounts(equipmentCounts);
        setFailurePointCounts(failureCounts);
      }
    });
  }, []);

  const generateRandomColors = (count: number) => {
    return Array.from({ length: count }, () =>
      `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
    );
  };

  const equipmentTypeData = {
    labels: Object.keys(equipmentTypeCounts),
    datasets: [
      {
        label: 'Частота поломок по типу оборудования',
        data: Object.values(equipmentTypeCounts),
        backgroundColor: '#6c68df',
      }
    ]
  };

  const failurePointData = {
    labels: Object.keys(failurePointCounts),
    datasets: [
      {
        label: 'Частота поломок по точке отказа',
        data: Object.values(failurePointCounts),
        backgroundColor: generateRandomColors(Object.keys(failurePointCounts).length),
      }
    ]
  };

  return (
    <main className={classes.main}>
      <div className={classes.container}>
        <h2>График частоты поломок по типу оборудования</h2>
        <Bar data={equipmentTypeData} />

        <h2>График частоты поломок по точке отказа</h2>
        <Pie data={failurePointData} />
      </div>
    </main>
  );
}

export default Graphics;
