import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import AuthService from "content/views/pages/SignIn/AuthService";

const SignIn = () => {
    const navigate = useNavigate();

    const [isLoginVisible, setIsLoginVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isLoginFormValid = email && password;
    const isRegisterFormValid =
        registerEmail &&
        registerPassword &&
        confirmPassword &&
        registerPassword === confirmPassword &&
        acceptTerms;

    const toggleCard = () => {
        setIsAnimating(true);
        setError('');

        setTimeout(() => {
            setIsLoginVisible(!isLoginVisible);
        }, 300);

        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    };

    const resetFormFields = () => {
        setEmail('');
        setPassword('');
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');
        setRememberMe(false);
        setAcceptTerms(false);
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('모든 필드를 입력하세요');
            return;
        }

        try {
            await AuthService.tryLogin(email, password);
            navigate('/');
            setError('');
        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await AuthService.tryRegister(registerEmail, registerPassword, confirmPassword, acceptTerms);
            toggleCard();
            setError('');
        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    return (
        <div className="container">
            <div id="phone">
                <div id="content-wrapper">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <div className={`card ${isAnimating ? 'jumping' : ''} ${!isLoginVisible ? 'fading-in' : ''}`} id="login">
                        {isLoginVisible && (
                            <form onSubmit={handleLogin}>
                                <h1>로그인</h1>
                                <div className="input">
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="email">Username or Email</label>
                                </div>
                                <div className="input">
                                    <input
                                        id="password"
                                        type={showLoginPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="password">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                        className="show-password-btn"
                                    >
                                        {showLoginPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <span className="checkbox remember">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <label htmlFor="remember" className="read-text">Remember me</label>
                                </span>
                                <button type="submit" disabled={!isLoginFormValid}>Login</button>
                            </form>
                        )}
                        {isLoginVisible && (
                            <span className="account-check" onClick={toggleCard}>
                                계정이 없나요? <b>회원가입</b>
                            </span>
                        )}
                    </div>

                    <div className={`card ${isAnimating ? 'jumping' : ''} ${isLoginVisible ? 'fading-in' : ''}`} id="register">
                        {!isLoginVisible && (
                            <form onSubmit={handleRegister}>
                                <h1>회원가입</h1>
                                <div className="input">
                                    <input
                                        id="register-email"
                                        type="email"
                                        value={registerEmail}
                                        onChange={(e) => setRegisterEmail(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="register-email">Email</label>
                                </div>
                                <div className="input">
                                    <input
                                        id="register-password"
                                        type={showRegisterPassword ? 'text' : 'password'}
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="register-password">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                        className="show-password-btn"
                                    >
                                        {showRegisterPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <div className="input">
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="confirm-password">Confirm Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="show-password-btn"
                                    >
                                        {showConfirmPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <span className="checkbox remember">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={acceptTerms}
                                        onChange={(e) => setAcceptTerms(e.target.checked)}
                                    />
                                    <label htmlFor="terms" className="read-text">
                                        I agree to the <b>Terms and Conditions</b>
                                    </label>
                                </span>
                                <button type="submit" disabled={!isRegisterFormValid}>Register</button>
                            </form>
                        )}
                        {!isLoginVisible && (
                            <span className="account-check" onClick={toggleCard}>
                                이미 계정이 있다면 <b>로그인</b>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
