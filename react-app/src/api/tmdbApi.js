// api/tmdbApi.js
import axios from 'axios';

export class TMDBApi {
    constructor() {
        this.api = axios.create({
            baseURL: 'https://api.themoviedb.org/3',
            params: {
                api_key: process.env.REACT_APP_TMDB_API_KEY,
                language: 'ko-KR'
            }
        });
    }

    // 영화 목록을 불러오는 메서드
    async getMovies(type) {
        try {
            const response = await this.api.get(`/movie/${type}`);
            return response.data.results;
        } catch (error) {
            console.error('TMDB API Error:', error);
            return [];
        }
    }

    // 영화 세부 정보를 불러오는 메서드
    async getDetailMovie(movieId) {
        try {
            const response = await this.api.get(`/movie/${movieId}`, {
                params: {
                    append_to_response: 'videos,images'
                }
            });
            return response.data;
        } catch (error) {
            console.error('TMDB Detail API Error:', error);
            return null;
        }
    }
}

export default new TMDBApi(); // 인스턴스를 생성하여 내보내기
