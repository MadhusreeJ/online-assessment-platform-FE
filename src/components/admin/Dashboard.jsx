import React from 'react'
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';


const Dashboard = () => {
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
            <Link to = "/dashboard/createexam" className='linkstyle'>Create Exam</Link>
            </li> 
            <li className={activeIndex === 1 ? 'active' : ''} onClick={() => handleClick(1)}>
            <Link to = "/dashboard/home" className='linkstyle'>All Exams</Link>
            </li>
            <li className={activeIndex === 2 ? 'active' : ''}onClick={() => handleClick(2)}>
            <Link to = "/dashboard/analysis" className='linkstyle'>Analysis</Link>
            </li>
            <li className={activeIndex === 3 ? 'active' : ''}onClick={() => handleClick(3)}>
            <Link to = "/dashboard/proctoring" className='linkstyle'>Proctoring </Link>
            </li> 
        </ul>
    </div>
    <Outlet/>
    </div>
  )
}

export default Dashboard