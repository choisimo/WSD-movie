import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import AuthService from "content/views/pages/SignIn/AuthService";

const SignIn = () => {
    const navigate = useNavigate();

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const registerEmailRef = useRef(null);
    const registerPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const rememberMeRef = useRef(null);
    const acceptTermsRef = useRef(null);

    const [isLoginVisible, setIsLoginVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [error, setError] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

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
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const registerEmail = registerEmailRef.current.value;
        const registerPassword = registerPasswordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;
        const acceptTerms = acceptTermsRef.current.checked;

        if (!registerEmail || !registerPassword || !confirmPassword) {
            setError('모든 필드를 입력하세요');
            return;
        }

        if (!acceptTerms){
            setError('가입 약관에 동의하셔야 합니다.');
            return;
        }

        if (registerPassword !== confirmPassword) {
            setError('확인 비밀번호가 일치하지 않습니다');
            return;
        }

        try {
            await AuthService.tryRegister(registerEmail, registerPassword, confirmPassword);
            toggleCard();
            setError('');
        } catch (error) {
            setError(error.message);
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
                                        ref={emailRef}
                                        id="email"
                                        type="email"
                                        required
                                    />
                                    <label htmlFor="email">Username or Email</label>
                                </div>
                                <div className="input">
                                    <input
                                        ref={passwordRef}
                                        id="password"
                                        type={showLoginPassword ? "text" : "password"}
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
                                        ref={rememberMeRef}
                                        type="checkbox"
                                        id="remember"
                                    />
                                    <label htmlFor="remember" className="read-text">사용자 기억</label>
                                </span>
                                <button type="submit">Login</button>
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
                                        ref={registerEmailRef}
                                        id="register-email"
                                        type="email"
                                        required
                                    />
                                    <label htmlFor="register-email">Email</label>
                                </div>
                                <div className="input">
                                    <input
                                        ref={registerPasswordRef}
                                        id="register-password"
                                        type={showRegisterPassword ? "text" : "password"}
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
                                        ref={confirmPasswordRef}
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
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
                                <span className="checkbox terms">
                                    <input
                                        ref={acceptTermsRef}
                                        type="checkbox"
                                        id="terms"
                                    />
                                    <label htmlFor="terms" className="read-text">
                                        <b>이용약관</b>에 동의합니다
                                    </label>
                                </span>
                                <button type="submit">Register</button>
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
