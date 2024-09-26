import { useEffect, useState } from "react";
import { Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BubbleChart({ chart = [], label = "", sort = "" }) {

  const [coordinate, setCoordinate] = useState({
    datasets: [
      {
        label,
        data: [],
      }
    ]
  });

  useEffect(() => {
    setCoordinate({
      datasets: [
        {
          label,
          data: chart,
        }
      ]
    })
  }, [chart, label, sort]);

  return (
    <>
    <Bubble data={coordinate} />
    </>
  );
}