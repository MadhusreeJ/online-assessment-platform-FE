import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../constants';
import '../../styles/userHome.css'

const UpdateQuestion = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null); // Initialize as null

  const getQuestion = async () => {
    try {
      const questionResp = await axios.get(
        `${config.api}/question/get-question-by-id/${params.examId}/${params.questionId}`
      );
      setQuestion(questionResp.data);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  useEffect(() => {
    getQuestion();
  }, []);

  // Function to safely get initial form values
  const getInitialValues = (question) => {
    if (question && Array.isArray(question.options)) {
      const options = question.options.map((option) => ({
        value: option.value,
        isCorrect: option.isCorrect,
      }));
      return {
        question: question.question,
        mark: question.mark,
        options: options, // Safely copy options
        explanation: question.explanation,
      };
    }
    return { options: [] }; // Return empty options if not defined
  };

  const formik = useFormik({
    initialValues: question ? getInitialValues(question) : { options: [] }, // Safely initialize options
    enableReinitialize: true,
    onSubmit: async (values) => {
      event.preventDefault();
      try {
        await axios.put(`${config.api}/question/update-question/${params.examId}/${params.questionId}`, values);
        navigate(`/dashboard/editquestions/${params.examId}`);
      } catch (error) {
        console.log(error);
      }
    },
  });

  // Function to handle option selection (marking correct answers)
  const checkedOption = (index) => {
    const updatedOptions = formik.values.options.map((option, i) => ({
      ...option,
      isCorrect: i === index, // Mark the selected option as correct
    }));
    formik.setFieldValue('options', updatedOptions);
  };

  // Show loading while question is being fetched
  if (!question) {
    return <div>Loading...</div>;
  }
  const handleLogout = () => {
    // Perform logout logic here, like clearing session or token
    localStorage.removeItem('authToken'); // Example
    navigate('/'); // Redirect to login page
  };

  // Safely access options with conditional rendering
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

      <h1 style={{paddingTop:100}}>Createquiz</h1>
      <div>
        <form className="row" onSubmit={formik.handleSubmit}>
          <div className="col-lg-12" style={{ paddingTop: 8, paddingLeft: 20 }}>
            <label style={{ fontWeight: 'bold' }}>Question</label>
            <textarea
              className="form-control w-75"
              aria-label="With textarea"
              name="question"
              value={formik.values.question}
              onChange={formik.handleChange}
            ></textarea>
          </div>
          <div style={{ paddingTop: 8, paddingLeft: 20 }}>
            <label style={{ fontWeight: 'bold' }}>Mark</label>
            <input
              className="form-control"
              style={{ width: 100 }}
              type="number"
              name="mark"
              value={formik.values.mark}
              onChange={formik.handleChange}
            />
          </div>

          {/* Check if question.options exists and render options */}
          {question.options && Array.isArray(question.options) && question.options.length === 4 ? (
            <div className="row">
              {question.options.map((option, index) => (
                <div key={index} className="col-lg-6" style={{ padding: 10, paddingLeft: 20 }}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="flexRadioDefault"
                    id={`flexRadioDefault${index}`}
                    value={index}
                    onChange={() => checkedOption(index)}
                    checked={formik.values.options[index]?.isCorrect}
                  />
                  <label style={{ fontWeight: 'bold' }}>Option {index + 1}</label>
                  <textarea
                    className="form-control"
                    aria-label="With textarea"
                    name={`options[${index}].value`}
                    value={formik.values.options[index]?.value || ''}
                    onChange={formik.handleChange}
                  ></textarea>
                </div>
              ))}
            </div>
          ) : (
            // Render for True/False Question if options have only 2 items
            <div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  value={0}
                  onChange={() => checkedOption(0)}
                  checked={formik.values.options[0]?.isCorrect}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  True
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  value={1}
                  onChange={() => checkedOption(1)}
                  checked={formik.values.options[1]?.isCorrect}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  False
                </label>
              </div>
            </div>
          )}

          <div className="col-lg-12" style={{ paddingTop: 8, paddingLeft: 10 }}>
            <label style={{ fontWeight: 'bold' }}>Explanation</label>
            <textarea
              className="form-control w-75"
              aria-label="With textarea"
              name="explanation"
              value={formik.values.explanation}
              onChange={formik.handleChange}
            ></textarea>
          </div>

          <div className="col-lg-3" style={{ padding: 20 }}>
            <button
              type="submit"
              className="btn mb-3"
              style={{ backgroundColor: '#5e0ec7', fontWeight: 'bold' }}>
              Save Changes
            </button>
          </div>
          <div className="col-lg-3" style={{ padding: 20 }}>
            <Link to = {`/dashboard/editquestions/${params.examId}`}>
            <button className="btn mb-3" style={{ backgroundColor: '#5e0ec7', fontWeight: 'bold' }}>
              Cancel
            </button>
            </Link>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestion;
