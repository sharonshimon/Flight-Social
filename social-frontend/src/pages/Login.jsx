
import React from 'react'
import { Link } from 'react-router-dom'
import './Login.css'

const handleLogin = (e) => {
  e.preventDefault()
  // Add your login logic here
}

const Login = () => {
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Flight Social</h1>
          <p>
            Connect with fellow flight enthusiasts!<br/>
            Share your location, find flight buddies for trips, and plan your next adventure together.<br/>
            Discover new friends, share your journeys, and make every trip unforgettable.
          </p>
          <span>Ready to join the sky community?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login