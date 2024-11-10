import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import AuthService from "./AuthService";

const SignIn = () => {
    const navigate = useNavigate();

    // 상태
    const [isLoginVisible, setIsLoginVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 상태 추가
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const isLoginFormValid = email && password;
    const isRegisterFormValid =
        registerEmail &&
        registerPassword &&
        confirmPassword &&
        registerPassword === confirmPassword &&
        acceptTerms;

    const toggleCard = () => {
        setIsAnimating(true); // 애니메이션 시작

        setTimeout(() => {
            setIsLoginVisible(!isLoginVisible); // 폼 변경
        }, 300); // 애니메이션 시간 (0.3초)

        setTimeout(() => {
            setIsAnimating(false); // 애니메이션 종료
        }, 600); // 폼이 변경되고 다시 원래 위치로 돌아오는 시간
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await AuthService.tryLogin(email, password);
            navigate('/');
        } catch (error) {
            alert('Login failed');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await AuthService.tryRegister(registerEmail, registerPassword);
            toggleCard();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container">
            <div id="phone">
                <div id="content-wrapper">
                    {/* 로그인 카드 */}
                    <div className={`card ${isAnimating ? 'jumping' : ''} ${!isLoginVisible ? 'fading-in' : ''}`} id="login">
                        {isLoginVisible && (
                            <form onSubmit={handleLogin}>
                                <h1>Sign In</h1>
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
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="password">Password</label>
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
                        <span className="account-check" onClick={toggleCard}>
                            Don't have an account? <b>Sign up</b>
                        </span>
                    </div>

                    {/* 회원가입 카드 */}
                    <div className={`card ${isAnimating ? 'jumping' : ''} ${isLoginVisible ? 'fading-in' : ''}`} id="register">
                        {!isLoginVisible && (
                            <form onSubmit={handleRegister}>
                                <h1>Sign Up</h1>
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
                                        type="password"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="register-password">Password</label>
                                </div>
                                <div className="input">
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <label htmlFor="confirm-password">Confirm Password</label>
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
                        <span className="account-check" onClick={toggleCard}>
                            Already have an account? <b>Sign in</b>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
