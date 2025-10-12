
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import LoginInput from '../Login/LoginInput'
import { authService } from '../../services/authService'

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: 'Other',
        country: "Israel",
        city: "Jerusalem"

    })
    const [profileImage, setProfileImage] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        // Basic validation
        if (!form.username || !form.email || !form.password || !form.firstName || !form.lastName || !form.gender) {
            setError('Please fill in all required fields.')
            return
        }
        if (!form.email.includes('@')) {
            setError('Please enter a valid email address.')
            return
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }
        try {
            const data = new FormData()
            Object.entries(form).forEach(([key, value]) => data.append(key, value))
            if (profileImage) {
                data.append('profilePicture', profileImage)
            }
            console.log([...data.entries()]);
            await authService.register(data, true)

            setSuccess('Registration successful! Redirecting to feed...')
            setTimeout(() => navigate('/feed'), 1500)
        } catch (err) {
            setError(err.message || 'Registration failed.')
        }
    }

    return (
        <div className="register">
            <div className="card">
                <div className="right">
                    <h1>Register</h1>
                    <form onSubmit={handleRegister} encType="multipart/form-data">
                        <LoginInput text="User Name" type="text" name="username" value={form.username} onChange={handleChange} />
                        <LoginInput text="Email" type="email" name="email" value={form.email} onChange={handleChange} />
                        <LoginInput text="Password" type="password" name="password" value={form.password} onChange={handleChange} />
                        <LoginInput text="First Name" type="text" name="firstName" value={form.firstName} onChange={handleChange} />
                        <LoginInput text="Last Name" type="text" name="lastName" value={form.lastName} onChange={handleChange} />
                        <LoginInput text="Country" type="text" name="country" value={form.country} onChange={handleChange} />
                        <LoginInput text="City" type="text" name="city" value={form.city} onChange={handleChange} />
                        <label htmlFor="gender">Gender</label>
                        <select name="gender" value={form.gender} onChange={handleChange} required>
                            <option value="Other">Other</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <label htmlFor="profileImage">Add Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            id="profileImage"
                            onChange={e => setProfileImage(e.target.files[0])}
                        />
                        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                        {success && <div style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
                        <button type="submit">Register</button>
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