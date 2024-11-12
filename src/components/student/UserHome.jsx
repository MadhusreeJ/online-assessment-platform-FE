import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '../../constants';
import { Link, Outlet, useParams, useNavigate } from 'react-router-dom';
import '../../styles/userHome.css'; // Import the CSS file for styling

const UserHome = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [student, setStudent] = useState([]);

  // Fetch all exams
  const getAllExams = async () => {
    const allExams = await axios.get(`${config.api}/exam/get-all-exams`);
    setExams(allExams.data);
  };

  // Fetch student info
  const getStudent = async () => {
    const studentInfo = await axios.get(`${config.api}/student/get-student-by-id/${params.studentId}`);
    setStudent(studentInfo.data);
  };

  // Use effect to load data when the component mounts
  useEffect(() => {
    getAllExams();
    getStudent();
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Perform logout logic here, like clearing session or token
    localStorage.removeItem('authToken'); // Example
    navigate('/'); // Redirect to login page
  };

  return (
    <div style={{ marginLeft: 200 }}>
      {/* Navbar */}
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
      

      {/* Exams Display */}
      <div className="d-flex flex-wrap">
        
        {exams.map((exam, index) => (
          <div style={{ padding: 20 }} key={index}>
            <div className="card exam-card">
              <div className="card-body">
                <h5 className="card-title">{exam.course}</h5>
                <p className="card-text">Topic: {exam.topic}</p>
                <p className="card-text">Total Questions: {exam.questions.length}</p>
                <p className="card-text">Duration: {exam.duration}</p>
                {student.exams &&
                student.exams.some((item) => item.exam === exam.course) ? (
                  <button className="btn btn-secondary" disabled>
                    Completed
                  </button>
                ) : (
                  <Link to={`/startexam/${params.studentId}/${exam._id}`}>
                    <button className="btn btn-primary">Take Exam</button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Outlet />
    </div>
  );
};

export default UserHome;
