import React from 'react'
import { Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from "axios";
import { config } from '../../constants';
import '../../styles/userHome.css'

const CreateExam = () => {
  const navigate = useNavigate();
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");

  function handleChangeCourse(e) {
    setCourse(e.target.value);
}

function handleChangeTopic(e) {
  setTopic(e.target.value);
}

function handleChangeDuration(e) {
  setDuration(e.target.value + " mins");
}


const saveExam = async () => {
  try {
    event.preventDefault();
    const examResp = await axios.post(`${config.api}/exam/create-exam`, { course, topic, duration});
    console.log(examResp.data)
    navigate(`/dashboard/createquiz/${examResp.data.examId}/${examResp.data.questions+1}`);
  } catch (error) {
    console.log(error);
  }
};
const handleLogout = () => {
  // Perform logout logic here, like clearing session or token
  localStorage.removeItem('authToken'); // Example
  navigate('/'); // Redirect to login page
};
  return (
    <div style={{marginLeft:200}}>
      
 <nav className="navbar bg-body-tertiary">
        <div className="container-fluid d-flex justify-content-between flex-wrap">
          {/* Website Name */}
          <span className="navbar-brand mb-0 h1">TestSphere</span>

          {/* Username */}
          <h5 className="username" style={{position:"absolute", paddingLeft:900}}>Admin</h5>

          {/* Logout Button */}
          <button onClick={handleLogout} className="btn btn-danger btn-sm logout-btn" style={{width:80}}>
            Logout
          </button>
        </div>
      </nav>
      <h1 style={{textAlign:'center',paddingTop:100}}>Create Exam</h1>
      <form className="row">
  <div className="col-lg-12" style={{padding:20}}>
    <label style={{fontWeight:"bold"}}>Course</label>
    <input type="text" className="form-control w-25" value={course} onChange={handleChangeCourse}/>
  </div>
  <div className="col-lg-12" style={{padding:20}}>
    <label style={{fontWeight:"bold"}}>Topic</label>
    <input type="text" className="form-control w-25" value={topic} onChange={handleChangeTopic}/>
  </div>
  <div className="col-lg-12" style={{padding:20}}>
    <label style={{fontWeight:"bold"}}>Duration (in mins)</label>
    <input type="number" className="form-control w-25"  onChange={handleChangeDuration}/>
  </div>
  <div className="col-lg-12" style={{padding:20}}>
    <button type="submit" className="btn mb-3" style={{backgroundColor:"#5e0ec7", fontWeight:"bold"}} onClick={saveExam}>Create Quiz</button>
  </div>
</form>
      </div>
  )
}

export default CreateExam