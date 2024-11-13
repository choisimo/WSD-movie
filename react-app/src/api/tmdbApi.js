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

export const getGenreMovieList = async (type, page = 1) => {
    try{
        const response = await api.get(`/movie/${type}`, {
            params: {
                api_key: process.env.REACT_APP_TMDB_API_KEY,
                language: 'ko-KR',
                page: page
            }
        });
        console.log('current page is ', page);
        return response.data;
    } catch (error) {
        console.error('TMDB API Error:', error);
        return {results: [], total_pages: 1}
    }
}

// 영화 세부 정보를 불러오는 함수
export const getDetailMovie = async (movieId) => {
    try {
        const response = await api.get(`/movie/${movieId}`, {
            params: {
                api_key: process.env.REACT_APP_TMDB_API_KEY,
                language: 'ko-KR',
                append_to_response: 'videos,images'
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('영화 세부 정보:', response.data);
        return response.data;
    } catch (error) {
        console.error('TMDB Detail API Error:', error);
        return null;
    }
};

export const getSimilarMovies = async (genreIds, page = 1) => {
    const response = await api.get(`/discover/movie`, {
        params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            with_genres: genreIds.join(','),
            sort_by: 'popularity.desc',
            page,
        },
    });
    return response.data; // 전체 데이터를 반환
};




