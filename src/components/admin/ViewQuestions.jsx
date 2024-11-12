import React from 'react'
import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { config } from '../../constants';
import { FcCheckmark } from "react-icons/fc";

const ViewQuestions = () => {

    const params = useParams();
    const [questions, setQuestions] = useState([]);

  let getAllQuestions = async() =>{
    const allQuestions = await axios.get(`${config.api}/question/get-questions-by-id/${params.examId}`);
    setQuestions(allQuestions.data.questions);
  }

  useEffect(()=>{
     getAllQuestions();
  },[])

  return (
    <div style={{marginLeft:200}}>
        {
            questions.map((question,index) => {
                return <div> 
                    <h6> Question {index+1} : {question.question}</h6>
                    {
                        question.options.map((option,index)=>{
                            return <div>
                                <p>{index+1}. {option.value}   
                                {
                                  option.isCorrect == true && <FcCheckmark/>
                                }
                                </p>
                            </div>
                        })
                    }
                    <h6>Explanation: {question.explanation}</h6>
                    <hr/>
                </div>
            })
        }
        </div>
  )
}

export default ViewQuestions