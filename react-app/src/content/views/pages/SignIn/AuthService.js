import axios from "axios";

class AuthService {

    constructor() {
        this.apiKey = process.env.REACT_APP_TMDB_API_KEY;
        this.tmdbBaseUrl = 'https://api.themoviedb.org/3';
    }

    async validateTmdbApiKey(apiKey) {
        try {
            const response = await axios.get(`${this.tmdbBaseUrl}/configuration`, {
                params: { api_key: apiKey },
            });

            // API 키가 유효한 경우
            if (response.status === 200) {
                return true;
            } else {
                throw new Error('유효하지 않은 TMDb API 키입니다.');
            }
        } catch (error) {
            throw new Error('API 키가 유효하지 않습니다.');
        }
    }

    // getAuthenticated
    async checkAuthentication() {
        const accessToken = localStorage.getItem('kakao_access_token');
        if (!accessToken) {
            console.error('Access token is missing');
            return { isAuthenticated: false, userInfo: null };
        }

        try {
            const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return { isAuthenticated: true, userInfo: response.data };
        } catch (error) {
            console.error("failed to fetch user info:", error);
            return { isAuthenticated: false, userInfo: null };
        }
    }

    // logout kakao
    async logoutKakao() {
        const accssToken = localStorage.getItem('kakao_access_token');
        if (!accssToken) {
            console.error('Access token is missing');
            return;
        }
        try {
            const response = await axios.post('https://kapi.kakao.com/v1/user/logout', null, {
                headers: {
                    Authorization: `Bearer ${accssToken}`,
                },
            });
            console.log('Kakao logout:', response.data);
            localStorage.removeItem('kakao_access_token');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    }

    // 로그인 시도
    tryLogin(email, password, rememberMe) {
        return new Promise(async (resolve, reject) => {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(user => user.id === email);

            if (!user) {
                // 이메일이 존재하지 않는 경우
                reject(new Error('로그인 실패! 존재 하지 않는 이메일 입니다.'));
            } else if (user.password !== password) {
                // 비밀번호가 일치하지 않는 경우
                reject(new Error('로그인 실패! 비밀번호가 일치 하지 않습니다.'));
            } else {
                try {
                // TMDb API 키 유효성 검사
                await this.validateTmdbApiKey(password);

                // 로그인 성공
                const token = user.password;
                if (rememberMe) {
                    localStorage.setItem('TMDb-Key', token); // 로그인 여부 확인용 키 저장
                } else {
                    sessionStorage.setItem('TMDb-Key', token);
                }
                resolve(user);
                } catch (error) {
                    reject(new Error('로그인 실패! TMDb API 키가 유효하지 않습니다.'));
                }
            }
        });
    }
    // 회원가입 시도
    tryRegister(email, password, confirmPassword, acceptTerms) {
        return new Promise(async (resolve, reject) => {
            try {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const userExists = users.some(existingUser => existingUser.id === email);

                if (!email || !password || !confirmPassword){
                    throw new Error('모든 필드를 입력해주세요.');
                }

                if (userExists) {
                    throw new Error('이미 존재하는 이메일입니다.');
                }

                if (!acceptTerms) {
                    throw new Error('약관에 동의해야 가입이 가능합니다.');
                }

                if (password !== confirmPassword)
                {
                    throw new Error('확인 비밀번호가 일치하지 않습니다.');
                }

                // TMDb API 키 유효성 검사
                await this.validateTmdbApiKey(password);

                const newUser = { id: email, password: password };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    isLoggedIn(){
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('TMDb-Key') || sessionStorage.getItem('TMDb-Key');
            const kakaoToken = localStorage.getItem('kakao_access_token');
            if (token || (token && kakaoToken)) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }
}

export default new AuthService();