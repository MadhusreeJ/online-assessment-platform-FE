import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../constants';
import { FcCheckmark } from "react-icons/fc";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import '../../styles/userHome.css'

const EditQuestion = () => {
    const params = useParams();
    const [questions, setQuestions] = useState([]);

    let getAllQuestions = async () => {
        const allQuestions = await axios.get(`${config.api}/question/get-questions-by-id/${params.examId}`);
        setQuestions(allQuestions.data.questions);
    }

    useEffect(() => {
        getAllQuestions();
    }, []);

    const deleteQuestion = async (questionId) => {
        const isConfirmed = confirm("Do you want delete this question");
        if (isConfirmed) {
            try {
                await axios.delete(`${config.api}/question/delete-question-by-id/${params.examId}/${questionId}`);
                getAllQuestions();
            } catch (error) {
                console.error("Error deleting question:", error);
            }
    } 
    }
    const handleLogout = () => {
        // Perform logout logic here, like clearing session or token
        localStorage.removeItem('authToken'); // Example
        navigate('/'); // Redirect to login page
      };

    return (
        <div style={{ marginLeft: 200 }}>
            
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
            {
                questions.map((question, index) => (
                    <div key={question._id} style={{paddingTop:100}}> {/* Add a key prop here */}
                        <div className='d-flex'>
                            <h6> Question {index + 1} : {question.question}</h6>
                            <Link to = {`/dashboard/updatequestion/${params.examId}/${question._id}`}>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <FaPencilAlt style={{ position: 'absolute', left: 1250, fontSize: "20px" }} />
                            </button>
                            </Link>
                            <button onClick={() => deleteQuestion(question._id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <FaTrashAlt style={{ position: 'absolute', left: 1300, fontSize: "20px" }} />
                            </button>
                        </div>
                        {
                            question.options.map((option, index) => (
                                <div key={option._id}> {/* Add a key prop here as well */}
                                    <p>{index + 1}. {option.value}
                                        {
                                            option.isCorrect === true && <FcCheckmark />
                                        }
                                    </p>
                                </div>
                            ))
                        }
                        <h6>Explanation: {question.explanation}</h6>
                        <hr />
                    </div>
                ))
            }
        </div>
    )
}

export default EditQuestion;
