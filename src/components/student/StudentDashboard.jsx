import React from 'react'
import { Link, Outlet, useParams } from 'react-router-dom';
import { useState } from 'react';


const StudentDashboard = () => {
   const params = useParams();
   const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div>
        <div className="dashboard">
        <h2 style={{textAlign:"center", fontWeight:"bolder" , color:"black"}}>Dashboard</h2>
        <ul className="nav flex-column" style={{marginTop:20}}>
            <li className={activeIndex === 0 ? 'active' : ''} onClick={() => handleClick(0)}>
            <Link to = {`/studentdashboard/userhome/${params.studentId}`} className='linkstyle'>Home</Link>
            </li> 
            <li className={activeIndex === 1 ? 'active' : ''} onClick={() => handleClick(1)}>
            <Link to = {`/studentdashboard/reports/${params.studentId}`} className='linkstyle'>Reports</Link>
            </li>
            <li className={activeIndex === 2 ? 'active' : ''}onClick={() => handleClick(2)}>
            <Link to = {`/studentdashboard/myexams/${params.studentId}`} className='linkstyle'>My Exams</Link>
            </li>
            {/*<li className={activeIndex === 3 ? 'active' : ''}onClick={() => handleClick(3)}>
            <Link to = "/assignmentor" className='linkstyle'>Assign Mentor</Link>
            </li> */}
        </ul>
    </div>
    <Outlet/>
    </div>
  )
}

export default StudentDashboard