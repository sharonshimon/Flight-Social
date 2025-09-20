import React from 'react'
import { Link } from 'react-router-dom'
import './Register.css'

const handleRegister = (e) => {
    e.preventDefault()
    // Add register logic here
}

const Register = () => {
    return (
        <div className="register">
            <div className="card">
                <div className="right">
                    <h1>Register</h1>
                    <form>
                        <input type="text" placeholder="Username" />
                        <input type="email" placeholder="Email" />
                        <input type="password" placeholder="Password" />
                        <input type="text" placeholder="Full Name" />
                        <input type="text" placeholder="Country" />
                        <input type="text" placeholder="City" />
                        <label htmlFor="profileImage">Add Profile Image</label>
                        <input type="file" accept="image/*" placeholder="Profile Image" />
                        <button onClick={handleRegister}>Register</button>
                    </form>
                </div>
                <div className="left">
                    <h1>Flight Social</h1>
                    <p>
                        Join our community of flight lovers! Create your account to connect with fellow travelers,
                        plan exciting trips, and share your adventures with new friends.
                    </p>
                    <span>Already have an account?</span>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Register