import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { config } from '../../constants';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/userRegister.css' // Import the custom CSS

const UserRegister = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      mail: "",
      password: ""
    },
    onSubmit: async (values) => {
      try {
        await axios.post(`${config.api}/student/register-student`, values);
        navigate("/"); // Redirect to the login page after successful registration
      } catch (error) {
        console.log(error);
      }
    }
  });

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-body">
          {/* Website Name Header */}
          <div className="site-header">
            <h1>Test Sphere</h1>
            <p className="tagline">Your platform for success</p>
          </div>

          <h2 className="text-center mb-4">Create an Account</h2>
          <form onSubmit={formik.handleSubmit}>
            {/* Name Input */}
            <div className="form-group form-row">
              <label htmlFor="name" className="col-form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                required
              />
            </div>

            {/* Email Input */}
            <div className="form-group form-row">
              <label htmlFor="mail" className="col-form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="mail"
                value={formik.values.mail}
                onChange={formik.handleChange}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-group form-row">
              <label htmlFor="password" className="col-form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                required
              />
            </div>

            {/* Register Button */}
            <button type="submit" className="btn btn-success">Register</button>
          </form>
          <div className="mt-3 text-center">
            <p>Already have an account? <Link to="/" className="text-primary">Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
