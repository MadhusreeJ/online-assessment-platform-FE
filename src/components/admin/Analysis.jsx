import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { config } from '../../constants';
import axios from "axios";
import '../../styles/userHome.css'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analysis = () => {
  const [examsData, setExamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamsData = async () => {
      try {
        const response = await axios.get(`${config.api}/exam/get-exams-with-scores`); 
        setExamsData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamsData();
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    navigate('/'); 
  };


  return (
    <div style={{marginLeft:200}}>
       <nav className="navbar bg-body-tertiary">
        <div className="container-fluid d-flex justify-content-between flex-wrap">
          <span className="navbar-brand mb-0 h1">TestSphere</span>
          <h5 className="username" style={{position:"absolute", paddingLeft:900}}>Admin</h5>
          <button onClick={handleLogout} className="btn btn-danger btn-sm logout-btn" style={{width:80}}>
            Logout
          </button>
        </div>
      </nav>
      <h1 style={{paddingTop:100}}>Exam Scores</h1>
      {examsData.map((exam) => {
        const { exam_id, exam_name, studentScores, max_score } = exam;
        const labels = studentScores.map(student => student.name);
        const scores = studentScores.map(student => {
          return max_score > 0 ? (student.score / max_score) * 100 : 0;
        });

        const data = {
          labels: labels.length > 0 ? labels : ['No Students'],
          datasets: [
            {
              label: 'Scores (%)',
              data: scores.length > 0 ? scores : [0],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        };

        const options = {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100, 
              title: {
                display: true,
                text: 'Percentage (%)',
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: exam_name,
            },
          },
        };

        return (
          <div key={exam_id} style={{ marginBottom: '40px' }}>
            <Bar data={data} options={options} />
          </div>
        );
      })}
    </div>
  );
};

export default Analysis;
