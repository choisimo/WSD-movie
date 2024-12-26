import React, {useEffect} from 'react';
import kakaoIcon from 'artifacts/kakao-login-icon.png';
import style from './OauthLogin.module.css';
import {useNavigate} from "react-router-dom";

const OauthLogin = () => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY; // .env에서 API 키 불러오기
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI; // .env에서 리다이렉트 URI 불러오기
    const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const navigate = useNavigate();

    // 부모 창에서 메시지를 처리
    useEffect(() => {
        const handleMessage = (event) => {
            // 메시지 유효성 확인
            if (event.origin !== window.location.origin) return;

            const { loggedIn } = event.data;
            if (loggedIn) {
                console.log('User logged in successfully!');
                navigate('/'); // 홈으로 이동
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [navigate]);

    const openPopup = () => {
        const popupWidth = 500;
        const popupHeight = 600;
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const popupX = (screenWidth - popupWidth) / 2;
        const popupY = (screenHeight - popupHeight) / 2;

        window.open(
            link,
            'kakaoLoginPopup',
            `width=${popupWidth},height=${popupHeight},left=${popupX},top=${popupY},resizable=no,scrollbars=yes,status=no`
        );
    };

    return (
        <div>
            <button type="button" className={style.kakaoBtn} onClick={openPopup}>
                <img src={kakaoIcon} alt="kakao" /> {/* 불러온 아이콘 사용 */}
            </button>
        </div>
    );
};

export default OauthLogin;
