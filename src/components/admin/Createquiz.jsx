import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { config } from '../../constants';
import '../../styles/userHome.css'

const Createquiz = () => {
  
  const params = useParams();
  const navigate = useNavigate();
  const [questionType, setquestionType] = useState("multipleChoice");
  const [buttonValue , setButtonValue] = useState("");
    function handleChange(e) {
        setquestionType(e.target.value);
    }


    const getInitialValues = () => {
      if (questionType === 'true/false') {
        return {
          question: '',
          mark: '',
          options: [
            { value: 'true', isCorrect: false },
            { value: 'false', isCorrect: false },
          ],
          explanation: '',
        };
      } else {
        return {
          question: '',
          mark: '',
          options: [
            { value: '', isCorrect: false },
            { value: '', isCorrect: false },
            { value: '', isCorrect: false },
            { value: '', isCorrect: false },
          ],
          explanation : '',
        };
      }
    };

    const formik = useFormik({
      initialValues: getInitialValues(),
      enableReinitialize: true,
      onSubmit : async (values) =>{
        event.preventDefault();
        try{
          await axios.post(`${config.api}/question/create-question/${params.examId}`, values);
          console.log(buttonValue);
          if(buttonValue === "save"){
            navigate('/dashboard/home');
          }else{
            navigate(`/dashboard/createquiz/${params.examId}/${Number(params.questionNo)+1}`);
            location.reload();
          }
        }catch(error){
          console.log(error);
        }
      }
      }
    )

      const checkedOption = (index)=>{
        const updatedOptions = formik.values.options.map((option, i) => ({
          ...option,
          isCorrect: i === index, // Set isCorrect to true for the selected option
        }));
        formik.setFieldValue('options', updatedOptions);
      }
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
        <h1 style={{paddingTop:100}}>Createquiz</h1>
        <div>
            <form className="row" onSubmit = {formik.handleSubmit}>
                <div className='col-lg-12' style={{paddingTop:8, paddingLeft:20}}>
                <label style={{fontWeight:"bold"}}>Question</label>
                <textarea className="form-control w-75" aria-label="With textarea"
                name='question' value={formik.values.question} onChange={formik.handleChange} required></textarea>
                </div>
                <div style={{paddingTop:8, paddingLeft:20}}>
               <label style={{fontWeight:"bold"}}>Mark</label>
                <input className="form-control" style={{width:100}} type='number' required
                name='mark' value={formik.values.mark} onChange={formik.handleChange}/>
                </div>
                <div style={{paddingTop:10, paddingLeft:20}}>
                <label style={{fontWeight:"bold"}}>Question Type : </label>
                <select className="form-select w-25" aria-label="Default select example" onChange={handleChange}>
                <option default value="multipleChoice">Multiple choice</option>
                <option value="true/false">True/False</option>
                </select>
                </div>
                {
                  questionType=="multipleChoice" ? <div className='row'>
                  <div className='col-lg-6' style={{padding:10, paddingLeft:20}}>
                  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" 
                  value = {0} onChange={() => checkedOption(0)}/>
                  <label style={{fontWeight:"bold"}}>Option 1</label>
                  <textarea className="form-control" aria-label="With textarea" required
                  name='options[0].value' value={formik.values.options[0].value} onChange={formik.handleChange}></textarea>
                  </div>

                  <div className='col-lg-6' style={{padding:10, paddingLeft:20}}>
                  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                  value = {1} onChange={() => checkedOption(1)}/>
                  <label style={{fontWeight:"bold"}}>Option 2</label>
                  <textarea className="form-control" aria-label="With textarea" required
                  name='options[1].value' value={formik.values.options[1].value} onChange={formik.handleChange}></textarea> 
                  </div>

                  <div className='col-lg-6' style={{padding:10, paddingLeft:20}}>
                  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                  value = {2} onChange={() => checkedOption(2)}/>
                  <label style={{fontWeight:"bold"}}>Option 3</label>
                  <textarea className="form-control" aria-label="With textarea" required
                  name='options[2].value' value={formik.values.options[2].value} onChange={formik.handleChange}></textarea>
                  </div>

                  <div className='col-lg-6' style={{padding:10, paddingLeft:20}}>
                  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"
                  value = {3} onChange={() => checkedOption(3)}/>
                  <label style={{fontWeight:"bold"}}>Option 4</label>
                  <textarea className="form-control" aria-label="With textarea" required
                  name='options[3].value' value={formik.values.options[3].value} onChange={formik.handleChange}></textarea>
                  </div>
                  </div> : <div>
                <div className="form-check">
  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" 
  value = {0} onChange={() => checkedOption(0)}/>
  <label className="form-check-label" for="flexRadioDefault1">
  True
  </label>
</div>
<div className="form-check">
  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"
  value = {1} onChange={() => checkedOption(1)}/>
  <label className="form-check-label" for="flexRadioDefault2">
    False
  </label>
</div>
                </div>
                }
<div>
<div className='col-lg-12' style={{paddingTop:8, paddingLeft:10}}>
                <label style={{fontWeight:"bold"}}>Explanation</label>
                <textarea className="form-control w-75" aria-label="With textarea" required
                name='explanation' value={formik.values.explanation} onChange={formik.handleChange}></textarea>
                </div>
  </div>
                
                
                

  <div className="col-lg-3" style={{padding:20}}>
    <button type="submit" className="btn mb-3" style={{backgroundColor:"#5e0ec7", fontWeight:"bold"}}
    value = "save" onClick={() => setButtonValue(event.target.value)}>submit</button>
  </div>
  <div className="col-lg-3" style={{padding:20}}>
     <button type="submit" className="btn mb-3" style={{backgroundColor:"#5e0ec7", fontWeight:"bold"}}
      value="saveNext" onClick={() => setButtonValue(event.target.value)}>Save & Next</button>
   </div>
            </form>
        </div>
        </div>
  )
}

export default Createquiz
