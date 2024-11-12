import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from '../../constants';
import '../../styles/userHome.css'
import { useNavigate } from 'react-router-dom';

const Proctor = () => {
    const [videosByExam, setVideosByExam] = useState({});
    const [flags, setFlags] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the video data from your API
        axios.get(`${config.api}/exam/get-all-videos-by-exam`)
            .then(response => {
                setVideosByExam(response.data.data); // Store the videos grouped by exam
            })
            .catch(error => {
                console.error('Error fetching video data:', error);
            });
    }, []);

    const handleRedFlagToggle = (examName, studentEmail) => {
        setFlags(prevFlags => {
            const newFlags = { ...prevFlags };
            if (!newFlags[examName]) {
                newFlags[examName] = {};
            }
            newFlags[examName][studentEmail] = !newFlags[examName][studentEmail];
            return newFlags;
        });
    };

    const saveRedFlagStatus = (examName, studentEmail) => {
        const isRedFlagged = flags[examName]?.[studentEmail];

        // Find the student's exam record
        const student = Object.values(videosByExam[examName]).find(
            (video) => video.studentEmail === studentEmail
        );

        if (!student || isRedFlagged === undefined) return;

    axios.post(`${config.api}/exam/update-red-flag`, {
        studentId: student._id, // Assuming the student has an _id field
        examId: student.examId, // Assuming the exam has an examId field
        redFlag: isRedFlagged
    })
        .then(response => {
            console.log('Red flag status saved:', response.data);
        })
        .catch(error => {
            console.error('Error saving red flag status:', error);
        });
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

            <h1 style={{paddingTop:100}}
            >Exam Videos</h1>

            {/* Iterate over each exam */}
            {Object.keys(videosByExam).map(examName => (
                <div key={examName}>
                    <h2>{examName}</h2>

                    {/* List all students and their videos for this exam */}
                    {videosByExam[examName].map((video, index) => (
                        <div key={index}>
                            <h3>{video.studentName} ({video.studentEmail})</h3>
                            <video width="600" controls>
                                <source src={video.videoUrl} type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                            <div>
                                <label>Red Flag:</label>
                                <input
                                    type="checkbox"
                                    checked={flags[examName]?.[video.studentEmail] || false}
                                    onChange={() => handleRedFlagToggle(examName, video.studentEmail)}
                                />
                                <button onClick={() => saveRedFlagStatus(examName, video.studentEmail)}>
                                    Save
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Proctor