
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

export const KakaoRedirectHandler = () => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const authorizationCode = params.get('code');

        if (authorizationCode) {
            console.log('Authorization Code:', authorizationCode);

            getAccessToken(authorizationCode)
                .then(async (accessToken) => {
                    if (accessToken) {
                        console.log('로그인 성공!');

                        // 로컬 스토리지에 저장
                        localStorage.setItem('kakao_access_token', accessToken);
                        localStorage.setItem('Kakao-user-info', JSON.stringify(await getUserInfo(accessToken)));
                        localStorage.setItem('TMDb-Key', process.env.REACT_APP_TMDB_API_KEY);

                        const userInfo = await getUserInfo(accessToken);
                        console.log('User Info:', userInfo);
                        console.log(localStorage.getItem('Kakao-user-info'));

                        // 부모 창으로 메시지 전송
                        if (window.opener) {
                            window.opener.postMessage({ loggedIn: true, userInfo }, window.location.origin);
                        } else {
                            console.error('Parent window is not available');
                        }

                        // 팝업 창 닫기
                        window.close();
                    }
                })
                .catch((error) => {
                    console.error('Error during token or user info retrieval:', error);
                })
                .finally(() => {
                    if (window.opener) {
                        window.opener.postMessage({loggedIn: true}, window.location.origin);
                        window.close();
                    }
                });
        } else {
            console.error('Authorization code not found');
        }
    }, []);

    return (
        <div>
            {userInfo ? (
                <p>Welcome, {userInfo.name}!</p>
            ) : (
                <p>카카오 로그인 처리 중...</p>
            )}
        </div>
    );
};


export const getAccessToken = async (code) => {
    const REST_API_KEY = process.env.REACT_APP_KAKAO_LOGIN_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    try {
        const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: REST_API_KEY,
                redirect_uri: REDIRECT_URI,
                code: code,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Failed to get access token:', error.response?.data || error.message);
        throw error;
    }
};


export const getUserInfo = async (accessToken) => {
    if (!accessToken) {
        accessToken = localStorage.getItem('kakao_access_token');
        if (!accessToken) {
            console.error('Access token is missing');
            return null;
        }
    }

    try {
        const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userInfo = {
            id: response.data.id,
            name: response.data.properties?.nickname || 'Unknown', // 닉네임이 없으면 기본값 설정
            email: response.data.kakao_account?.email || 'No Email', // 이메일이 없으면 기본값 설정
        };

        console.log('Fetched User Info:', userInfo);
        return userInfo;
    } catch (error) {
        console.error('Failed to fetch user info:', error.response?.data || error.message);
        return null; // 에러 발생 시 null 반환
    }
};


export const kakaoLogout = async () => {
    const accessToken = localStorage.getItem('kakao_access_token');
    if (!accessToken) {
        console.error('Access token is missing');
        return;
    }

    try {
        const response = await axios.post('https://kapi.kakao.com/v1/user/logout', null, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log('Logout:', response.data);
        localStorage.removeItem('kakao_access_token');
        localStorage.removeItem('Kakao-user-info');
        localStorage.removeItem('TMDb-Key');
        console.log('Logged out successfully');
    } catch (error) {
        console.error('Failed to logout:', error);
    }
};
