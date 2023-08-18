import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    // const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // const handleInputChange = (event) => {
    //     const { name, value } = event.target;
    //     setLoginData({ ...loginData, [name]: value });
    // };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async() => {
        try {
            const config = {
                headers:{
                    "Content-type":"application/json",
                },
            };

            const { data } = await axios.post('/api/user/login', { email, password }, config);
            localStorage.setItem("userInfo", JSON.stringify(data));
            
            alert('Login Successful!');
            navigate("/chats");
            window.location.reload();
        } catch(err) {
            alert('Error occured!');
            return;
        }
    };

    return (
        <div>
            <div className="mb-3 login-field">
                <label htmlFor="email" className="form-label">
                Email: 
                </label>
                <input
                type="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                className="form-control"
                required
                />
            </div>
            <div className="mb-3 login-field">
                <label htmlFor="password" className="form-label">
                Password:
                </label>
                <input
                type="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                className="form-control"
                required
                />
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Login
            </button>
        </div>
    );
}

export default Login;