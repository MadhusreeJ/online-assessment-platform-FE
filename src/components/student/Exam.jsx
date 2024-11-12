import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../constants';
import { Outlet, Link } from 'react-router-dom';
import { useStream } from '../../StreamContext';
import '../../styles/exam.css'

const Exam = () => {
    const params = useParams();
    const { screenStream } = useStream();
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState(Array(questions.length).fill(0));
    const [finish, setFinish] = useState(false);
    const [marks, setMarks] = useState(0);
    const [timeLeft, setTimeLeft] = useState();
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [videoBlob, setVideoBlob] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const getAllQuestions = async () => {
        try {
            const allQuestions = await axios.get(`${config.api}/question/take-exam/${params.examId}`);
            setQuestions(allQuestions.data);
        } catch (error) {
            console.error("Error fetching questions:", error);
        } finally {
            setLoading(false); 
        }
    };

    const getDuration = async () => {
        try {
            const exam = await axios.get(`${config.api}/exam/get-exam-by-id/${params.examId}`);
            setTimeLeft(exam.data.duration.split(" ")[0] * 60);
        } catch (error) {
            console.error("Error fetching duration:", error);
        }
    };

    useEffect(() => {
        getAllQuestions();
        getDuration();
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            submitExam(); 
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    useEffect(() => {
        if (screenStream && screenStream.active) {
            console.log('Screen Stream:', screenStream);
            const recorder = new MediaRecorder(screenStream);
            let chunks = [];

            recorder.ondataavailable = (event) => {
                console.log('Data available:', event.data); 
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };
 
            recorder.onstop =() => {
                console.log('Recording stopped.');
                if (chunks.length > 0) {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    setVideoBlob(blob);
                   setTimeout(() => {
                    setIsSubmitted(true);
                   }, 200); 
                    console.log('Video Blob Size:', blob.size);
                } else {
                    console.warn('No video chunks available when stopping the recorder!');
                }
            };
                recorder.start();
                console.log('Recording started...');
                setMediaRecorder(recorder);
    
            return () => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop(); 
                }
            };
            
        }else {
            console.log('Stream not yet ready or active');
        }
    }, [screenStream]);

    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden' && finish === false && screenStream) {
            alert('You have switched tabs! Please stay on this tab to continue the exam.');
        }
    };

    useEffect(() => {
        if (!finish && screenStream) {
            document.addEventListener('visibilitychange', handleVisibilityChange);
        }
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange); 
        };
    }, [finish, screenStream]);

    const stopScreenShare = () => {
        if (screenStream) {
            screenStream.getTracks().forEach(track => track.stop()); 
            console.log('Screen sharing stopped');
            console.log('Screen Stream:', screenStream);
        }
    };
    
    useEffect(()=> {
     if(isSubmitted){
        console.log("submitted blob",videoBlob);
        const finalSubmit = async() =>{
            try{

                stopScreenShare();
    
                const formData = new FormData();
                formData.append('exam_id', params.examId);
                formData.append('answers', JSON.stringify(answers));
                if (videoBlob) {
                    formData.append('video', videoBlob, 'exam-video.webm');
                } else {
                    console.error('Video blob is not available');
                }
                const answerResp = await axios.post(`${config.api}/exam/submit-exam/${params.studentId}/${params.examId}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log(answerResp);
                setMarks(answerResp.data.Marks);
                setFinish(true);
                console.log(videoBlob);
            } catch (error) {
                console.log('Error during exam submission:', error);
            }
        }
        finalSubmit();
    }
     },[isSubmitted]);

    const submitExam = async () => {
        try {
            if (mediaRecorder && mediaRecorder.state === 'recording') { 
                mediaRecorder.stop();
                console.log("Recording is stopping...")
                }

    }catch(error){
        console.log(error);
    }
}

    const previousQuestion = () => {
        setIndex(index - 1);
    };

    const nextQuestion = () => {
        setIndex(index + 1);
    };

    const handleAnswerChange = (optionId) => {
        setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[index] = { questionId: questions[index].question_id, optionId }; 
            console.log(newAnswers);
            return newAnswers;
        });
    };

    const formatTimeLeft = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {finish === false && (
                <div className="exam-container">
                    <div className="timer">
                        <h6>Time Left: {formatTimeLeft(timeLeft)}</h6>
                    </div>

                    <div className="question-section">
                        <h6>{questions[index].question}</h6>
                        {questions[index].options.map((option) => (
                            <div key={option.option_id} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id={option.option_id}
                                    checked={answers[index]?.optionId === option.option_id}
                                    onChange={() => handleAnswerChange(option.option_id)}
                                />
                                <label className="form-check-label" htmlFor={option.option_id}>
                                    {option.value}
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="button-container">
                        <button className="btn btn-secondary" disabled={index === 0} onClick={previousQuestion}>Previous</button>
                        <button className="btn btn-secondary" disabled={index === questions.length - 1} onClick={nextQuestion}>Next</button>
                        <button className="btn btn-primary" onClick={submitExam}>Finish</button>
                    </div>
                </div>
            )}
            {finish === true && <div className="finish-message">
                Thank you! Your Marks: {marks}
                <div>
                   <Link to={`/studentdashboard/userhome/${params.studentId}`} style={{color:"green"}}>Go to home</Link>
                </div>
                </div>
                }
            <Outlet />
        </>
    );
    
    }
export default Exam;
