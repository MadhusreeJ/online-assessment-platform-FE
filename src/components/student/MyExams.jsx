import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../../constants';
import { useParams } from 'react-router-dom';
import '../../styles/userHome.css'

const MyExams = () => {
  const params = useParams();
  const [student, setStudent] = useState({ exams: [] }); // Default student with exams as an empty array

  const getStudent = async () => {
    try {
      const studentInfo = await axios.get(`${config.api}/student/get-student-by-id/${params.studentId}`);
      setStudent(studentInfo.data); // Update state with fetched student data
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  useEffect(() => {
    getStudent();
  }, [params.studentId]);
  
  const handleLogout = () => {
    // Perform logout logic here, like clearing session or token
    localStorage.removeItem('authToken'); // Example
    navigate('/'); // Redirect to login page
  };// Re-fetch student data when the studentId changes

  return (
    <div className="container mt-5" style={{ marginLeft: 200 }}>
     <nav className="navbar bg-body-tertiary">
        <div className="container-fluid d-flex justify-content-between flex-wrap">
          {/* Website Name */}
          <span className="navbar-brand mb-0 h1">TestSphere</span>

          {/* Username */}
          <h5 className="username" style={{position:"absolute", paddingLeft:900}}>{student.name}</h5>

          {/* Logout Button */}
          <button onClick={handleLogout} className="btn btn-danger btn-sm logout-btn" style={{width:80}}>
            Logout
          </button>
        </div>
      </nav>
      <hr/>

      {
        student.exams && student.exams.length > 0 ? (
          <div className="row" style={{paddingTop:10}}>
            {student.exams.map((exam, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{exam.exam}</h5>
                    <p className="card-text">Score: {exam.score} / {exam.max_score}</p>
                    <p className="card-text">Max Score: {exam.max_score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">
            No exams available.
          </div>
        )
      }
    </div>
  );
};

export default MyExams;
