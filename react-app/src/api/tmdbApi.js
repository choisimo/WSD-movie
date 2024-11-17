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

export const getCategoryList = async (type, page = 1) => {
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

export const getGenreMovieList = async (genreId, page = 1) => {
    try {
        const response = await api.get(`/discover/movie`, {
            params: {
                api_key: process.env.REACT_APP_TMDB_API_KEY,
                language: 'ko-KR',
                page,
                with_genres: genreId, // 장르 ID 추가
                sort_by: 'popularity.desc', // 기본 정렬
            },
        });
        return response.data;
    } catch (error) {
        console.error('TMDB API Error:', error);
        return {results: [], total_pages: 1};
    }
};


export const getGenres = async () => {
    try {
        const response = await api.get('/genre/movie/list', {
            params: {
                api_key: process.env.REACT_APP_TMDB_API_KEY,
                language: 'ko-KR', // 한국어로 장르 이름 가져오기
            },
        });
        return response.data.genres; // 장르 배열 반환
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
};


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

export const searchMovies = async ({ query, page = 1, genre, rating, sort, year }) => {
    const params = {
        api_key: process.env.REACT_APP_TMDB_API_KEY, // API 키
        language: 'ko-KR',
        page,
    };

    if (query) {
        params.query = query;
    } else {
        params.sort_by = sort || 'popularity.desc'; // 인기순 정렬
        if (genre) {
            params.with_genres = genre;
        }
        if (rating) {
            params['vote_average.gte'] = rating;
        }
        if (year) {
            params['primary_release_year'] = year;
        }
    }

    const endpoint = query ? `/search/movie` : `/discover/movie`; // 키워드가 없을 경우 discover 사용

    try {
        const response = await api.get(endpoint, {params });
        return response.data;
    } catch (error) {
        console.error('TMDB API Error:', error);
        return { results: [], total_pages: 1 }; // 오류 시 빈 결과 반환
    }

    if (query) {
        params.query = query;
    }

    const response = await api.get(endpoint, { params });
    return response.data;
};


