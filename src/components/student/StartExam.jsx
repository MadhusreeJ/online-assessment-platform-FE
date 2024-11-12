import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { useStream } from '../../StreamContext';
import '../../styles/startExam.css'; // Import the CSS for styling

const StartExam = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { setScreenStream } = useStream();

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const isActive = stream.getVideoTracks().some((track) => track.readyState === 'live');

      if (isActive) {
        setScreenStream(stream);
        console.log('Screen sharing started', stream);
        navigate(`/exam/${params.studentId}/${params.examId}`);
      } else {
        console.error('Stream is not active');
      }
    } catch (err) {
      console.error('Error starting screen share:', err);
    }
  };

  const handleStartExam = () => {
    startScreenShare();
    // You can also navigate to the exam page here if needed
  };

  return (
    <div className="start-exam-container">
      <div className="instructions-container">
        <h2>Welcome to the Online Exam!</h2>
        <p>Please make sure to read the instructions before starting the exam:</p>
        <ul className="exam-instructions">
          <li>Ensure you share your entire screen when asked for screen sharing.</li>
          <li>Read each question carefully before answering.</li>
          <li>Once you start the exam, you cannot pause or leave the screen.</li>
          <li>You will be sharing your screen throughout the exam.</li>
          <li>Ensure a stable internet connection to avoid disruptions.</li>
        </ul>
      </div>

      <div className="start-exam-btn-container">
        <button className="btn btn-success start-exam-btn" onClick={handleStartExam}>
          Start Exam
        </button>
      </div>

      <Outlet />
    </div>
  );
};

export default StartExam;
