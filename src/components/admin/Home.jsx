import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { config } from '../../constants';
import { Link, Outlet } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../styles/userHome.css'

const Home = () => {
  const [exams, setExams] = useState([]);
   const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  let getAllExams = async() =>{
    const allExams = await axios.get(`${config.api}/exam/get-all-exams`)
    setExams(allExams.data);
  }

  useEffect(()=>{
     getAllExams();
  },[])

  const handleShowModal = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExam(null);
    console.log(selectedExam);
  };

  function handleChangeCourse(e) {
    setSelectedExam({ ...selectedExam, course: e.target.value });
}

function handleChangeTopic(e) {
  setSelectedExam({ ...selectedExam, topic: e.target.value });
}

function handleChangeDuration(e) {
  setSelectedExam({ ...selectedExam, duration: e.target.value + " mins" }); 
}

const handleSaveChanges = async () => {
  try {
    await axios.put(`${config.api}/exam/update-exam/${selectedExam._id}`, selectedExam);
    await getAllExams();
    handleCloseModal();
  } catch (error) {
    console.error("Error updating exam:", error);
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
<div style={{paddingTop:50}}className='d-flex flex-wrap'>
{
  exams.map((exam,index)=> (
    <div style={{padding:20}} key={index}>
    <div className="card" style={{"width": 18+"rem"}}>
      <div className="card-body">
        <h5 className="card-title">{exam.course}</h5>
        <p className="card-text">Topic: {exam.topic}</p>
        <p className="card-text">Total Questions : {exam.questions.length}</p>
        <p className="card-text">Duration : {exam.duration}</p>
        <div className= "row">
        <div className='col-lg-6'>
        <Link to = { `/dashboard/viewquestions/${exam._id}`}>
        <Button variant="primary">View</Button>
        </Link>
        </div>
        <div className='col-lg-6'>
        <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic" size="sm">
        Edit
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleShowModal(exam)}>Exam</Dropdown.Item>
        <Dropdown.Item href={ `/dashboard/editquestions/${exam._id}`}>Questions</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    </div>
    </div>
      </div>
    </div>
    </div>
  ))
}
</div>
<Outlet/>
<Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Exam Details</Modal.Title>
        </Modal.Header>
        <form>
        <Modal.Body>
          {selectedExam && (
            <div>
              <div className="col-lg-12" style={{padding:20}}>
    <label style={{fontWeight:"bold"}}>Course</label>
    <input type="text" className="form-control w-50" value={selectedExam.course} onChange={handleChangeCourse}/>
  </div>
  <div className="col-lg-12" style={{padding:20}}>
    <label style={{fontWeight:"bold"}}>Topic</label>
    <input type="text" className="form-control w-50" value={selectedExam.topic} onChange={handleChangeTopic}/>
  </div>
  
  <div className="col-lg-12" style={{padding:20}}>
    <label style={{fontWeight:"bold"}}>Duration (in mins)</label>
    <input type="number" className="form-control w-50"  onChange={handleChangeDuration}/>
  </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="success" onClick={handleSaveChanges}>
            Save
          </Button>
          <Button variant="danger" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
        </form>
      </Modal>
</div>
  )
}

export default Home