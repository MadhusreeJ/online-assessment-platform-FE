// src/StudentPerformance.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {config} from '../../constants';
import { useParams } from 'react-router-dom';
import '../../styles/reports.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reports = () => {
    const params = useParams();
    const [students, setStudents] = useState([]);
    const [examsOfStudents, setExamsOfStudents] = useState([]);

    const fetchStudents = async () => {
        const studentsInfo = await axios.get(`${config.api}/student/get-all-students`);
        setStudents(studentsInfo.data);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchExamScores = async (examId) => {
        console.log(`Fetching scores for exam ID: ${examId}`);
        const examsByStudents = await axios.get(`${config.api}/exam/exam-scores/${examId}`);
        return examsByStudents.data; // Return the fetched data
    };

    const loggedInStudent = students.find(student => student._id === params.studentId);

    useEffect(() => {
        if (loggedInStudent) {
            // Fetch scores for each exam taken by the logged-in student
            const fetchAllExamScores = async () => {
                const scores = await Promise.all(
                    loggedInStudent.exams.map(exam => fetchExamScores(exam.exam_id))
                );
                setExamsOfStudents(scores);
            };
            fetchAllExamScores();
        }
    }, [loggedInStudent]);

    const generateChartData = (examScores, examName) => {
        const studentsWithScores = students.filter(student => {
            // Check if the student has taken the exam and has a score
            return examScores.some(score => score.studentName === student.name);
        });
        const labels = studentsWithScores.map(student => student.name); // X-axis: Student names
        const data = labels.map(studentName => {
            // Find the student's score for this exam
            const studentScore = examScores.find(score => score.studentName === studentName);
            return studentScore ? (studentScore.score / studentScore.max_score) * 100 : 0; // Convert to percentage
        });

        return {
            labels, 
            datasets: [
                {
                    label: `${examName} Scores (%)`,
                    data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
            ],
        };
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

          {/* Logout Button */}
          <button onClick={handleLogout} className="btn btn-danger btn-sm logout-btn" style={{width:80}}>
            Logout
          </button>
        </div>
      </nav>
            {loggedInStudent && ( // Render only if the logged-in student exists
                <div key={loggedInStudent._id}>
                    <h2>{loggedInStudent.name}</h2>
                    <Bar
                        data={{
                            labels: loggedInStudent.exams.map(exam => exam.exam),
                            datasets: [
                                {
                                    label: `${loggedInStudent.name}'s Scores (%)`,
                                    data: loggedInStudent.exams.map(exam => {
                                        // Calculate percentage
                                        return (exam.score / exam.max_score) * 100;
                                    }),
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                },
                            ],
                        }}

                        options={{
                            scales: {
                                y: {
                                    min: 0, // Set minimum value for y-axis
                                    max: 100, // Set maximum value for y-axis
                                    title: {
                                        display: true,
                                        text: 'Scores (%)', // Optional: Add a title for the y-axis
                                    },
                                },
                            },
                        }}


                        width={1200}
                        height={650}
                    />
                </div>
            )}
            {loggedInStudent && examsOfStudents.length > 0 && (
                <div>
                    <h2>Overall Scores Comparison</h2>
                    {loggedInStudent.exams.map((exam, index) => {
                        const examScores = examsOfStudents[index]; // Get scores for the current exam
                        return (
                            <Bar
                                key={exam.exam_id} // Use exam_id as key
                                data={generateChartData(examScores,exam.exam)}
                                options={{
                                    scales: {
                                        y: {
                                            min: 0, // Set minimum value for y-axis
                                            max: 100, // Set maximum value for y-axis
                                            title: {
                                                display: true,
                                                text: 'Scores (%)', // Title for Y-axis
                                            },
                                        },
                                    },
                                }}
                                width={1200}
                                height={650}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Reports;
