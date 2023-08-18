import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
    // const [signupData, setSignupData] = useState({
    //     name: '',
    //     email: '',
    //     password: '',
    //     confirmPassword: '',
    // });
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // const handleInputChange = (event) => {
    //     const { name, value, type } = event.target;
    //     setSignupData({ ...signupData, [name]: type === 'file' ? event.target.files[0] : value });
    // };

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    }

    const handleSubmit = async(event) => {
        if (password !== confirmPassword) {
            alert('Password and Confirm Password must match.');
            return;
        }

        // console.log(signupData);
        // setName(signupData.name);
        // setEmail(signupData.email);
        // setPassword(signupData.password);
        console.log({name, email, password, pic});

        try {
            const config = {
                headers:{
                    'Content-type':'application/json',
                },
            };

            const { data } = await axios.post('/api/user', { name, email, password, pic }, config);

            alert('Regsitered User successfully!');

            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats")
        } catch(err) {
            alert('Error occured!');
            setLoading(false);
        }
    };

    const postDetails = async(pics) => {
        setLoading(true);

        if(pics.type === 'image/jpeg' || pics.type === 'image/jpg' || pics.type === 'image/png') {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "ChatApp");
            await fetch("https://api.cloudinary.com/v1_1/ddjpa24tr/image/upload", {
                method:'post',
                body:data,
            }).then((res) => res.json()).then((data) => {
                const pic_url = data.url.toString();
                console.log(pic_url);
                setPic(pic_url);
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            });
        } else {
            alert('Image not supported!');
            setLoading(false);
            return;
        }
    };

    return (
        <div>
            <div className="mb-3 signup-field">
                <label htmlFor="name" className="form-label">
                Name:
                </label>
                <input
                type="text"
                name="name"
                value={name}
                onChange={handleNameChange}
                className="form-control"
                required
                />
            </div>
            <div className="mb-3 signup-field">
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
            <div className="mb-3 signup-field">
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
            <div className="mb-3 signup-field">
                <div id='pass-error'></div>
                <label htmlFor="confirmPassword" className="form-label">
                Confirm Password:
                </label>
                <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="form-control"
                required
                />
            </div>
            <div className="mb-3 signup-field">
                <label htmlFor="pic" className="form-label">
                Profile Picture:
                </label>
                <input type="file" name="pic" accept='image/*' onChange={async(e) => await postDetails(e.target.files[0])} className="form-control" />
            </div>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                Signup
            </button>
        </div>
    );
}

export default Signup;