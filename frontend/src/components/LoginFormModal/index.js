// frontend/src/components/LoginFormModal/index.js
import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [emptyField, setEmptyField] = useState('true');
  const { closeModal } = useModal();

  useEffect(() => {
    if (credential.length < 4 || password.length < 6) {
        setEmptyField(true);
    } else setEmptyField(false);
  }, [credential, password])


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  };

  const demoSignIn = (e) => {
    e.preventDefault();
    const password = 'password'
    const credential = 'demo@user.io'
    dispatch(sessionActions.login({ credential, password }));
    closeModal();
  }

  return (
    <>
        <div className='login-form'>
            <h1>Log In</h1>
            <ul className='errors-messages'>
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit} className='form'>
                <div className='input-fields'>
                    <label>
                        Username or Email
                    </label>
                    <input
                        type='text'
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </div>
                <div className='input-fields'>
                    <label>
                        Password
                    </label>
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type='submit'
                        className={emptyField ? 'login-disabled' : 'login-button'}
                        disabled={Boolean(emptyField)}
                        id='login-button'>Log In
                </button>
            </form>
        </div>
        <span onClick={demoSignIn} type="submit" className='demoLog-button' id='demouser-log-button'>Demo User</span>
      </>
    );
}

export default LoginFormModal;
      