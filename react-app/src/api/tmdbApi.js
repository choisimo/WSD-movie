// api/tmdbApi.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: process.env.REACT_APP_TMDB_API_KEY,
        language: 'ko-KR'
    }
});

// 영화 목록을 불러오는 함수
export const getMovies = async (type) => {
    try {
        const response = await api.get(`/movie/${type}`);
        return response.data.results;
    } catch (error) {
        console.error('TMDB API Error:', error);
        return [];
    }
};

// 영화 세부 정보를 불러오는 함수
export const getDetailMovie = async (movieId) => {
    try {
        console.log('API Key:', process.env.REACT_APP_TMDB_API_KEY); // API 키 확인용 로그
        const response = await api.get(`/movie/${movieId}`, {
            params: {
                append_to_response: 'videos,images' // 추가 데이터 요청
            }
        });
        console.log('영화 세부 정보:', response.data);
        return response.data;
    } catch (error) {
        console.error('TMDB Detail API Error:', error);
        return null;
    }
};



