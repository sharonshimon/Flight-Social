
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoginInput from './LoginInput'
import { authService } from '../../services/authService'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (!email || !password) {
        setError('Please fill in all fields')
        return
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email address')
        return
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters long')
        return
      }

      console.log('Attempting login with:', { email, password })
      await authService.login({ email, password })
      console.log('Login successful')

      navigate('/feed')
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    }
  }
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Flight Social</h1>
          <p>
            Connect with fellow flight enthusiasts!<br />
            Share your location, find flight buddies for trips, and plan your next adventure together.<br />
            Discover new friends, share your journeys, and make every trip unforgettable.
          </p>
          <span>Ready to join the sky community?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <LoginInput
              text="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <LoginInput
              text="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login