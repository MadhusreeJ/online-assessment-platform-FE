import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from "axios";
import { config } from '../../constants';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminError, setAdminError] = useState('');

  const formik = useFormik({
    initialValues: {
      mail: "",
      password: ""
    },
    onSubmit: async (values) => {
      try {
        event.preventDefault();
        const userResp = await axios.post(`${config.api}/student/student-login`, values);
        navigate(`/studentdashboard/userhome/${userResp.data.student.id}`);
        console.log(userResp);
      } catch (error) {
        console.log(error.response.data.message);
        alert(error.response.data.message);
      }
    }
  });

  const handleAdminLogin = async (values) => {
    try {
      const adminResp = await axios.post(`${config.api}/admin/admin-login`, values);
      navigate('/dashboard/home'); // Redirect to admin home page
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      console.log(errorMessage);
      setAdminError(errorMessage); // Set error message
    }
  };

  const adminFormik = useFormik({
    initialValues: {
      mail: "",
      password: ""
    },
    onSubmit: (values) => {
      handleAdminLogin(values);
    }
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    adminFormik.resetForm(); // Reset the form values
    setAdminError(''); // Clear any previous error messages
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-4">
        <h1 className="display-4">Test Sphere</h1>
        <p className="lead">Welcome to Test Sphere! Please login to continue.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center">Student Login</h3>
              <form onSubmit={formik.handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="staticEmail" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="mail"
                    value={formik.values.mail}
                    onChange={formik.handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="inputPassword" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputPassword"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success w-100">Login</button>
              </form>

              <div className="mt-3 text-center">
                <Link to="/register" style={{color:"black"}} className="btn btn-link">Don't have an account? Register</Link>
              </div>

              <div className="mt-3 text-center">
                <Button variant="outline-primary" onClick={() => setIsModalOpen(true)}>Admin Login</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      <Modal show={isModalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={adminFormik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="maillogin" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="maillogin"
                name="mail"
                value={adminFormik.values.mail}
                onChange={adminFormik.handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="secretCode" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="secretCode"
                name="password"
                value={adminFormik.values.password}
                onChange={adminFormik.handleChange}
                required
              />
            </div>

            {adminError && <div className="text-danger mb-2">{adminError}</div>}
            <Button type="submit"  style={{backgroundColor:"#5e0ec7"}} className="w-100">Login</Button>
          </form>
        </Modal.Body>
      </Modal>

      <Outlet />
    </div>
  );
};

export default Login;
