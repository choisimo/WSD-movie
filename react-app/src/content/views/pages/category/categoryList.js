import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {getCategoryList, getMovies} from 'api/tmdbApi';
import './categoryList.css';
import route from 'routes.json';
import MovieCard from 'content/views/pages/movieCardView/MovieCard'
import { getLikedMovies, toggleLikeMovie } from "content/components/utility/bookMark/likeMovies";

const CategoryList = ({ category: propCategory }) => {
    const { category: paramCategory } = useParams();
    const category = propCategory || paramCategory;

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [likedMovies, setLikedMovies] = useState(getLikedMovies || []);


    const categoryName = (category) => {
        if (category === 'popular') return '인기 영화';
        if (category === 'now_playing') return '현재 상영 중인 영화';
        if (category === 'top_rated') return '평점이 높은 영화';
        if (category === 'upcoming') return '개봉 예정 영화';
        return '알 수 없는 카테고리';
    };

    const fetchMovies = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCategoryList(category, page);
            setMovies((prevMovies) => [...prevMovies, ...data.results]);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    }, [category, page]);

    useEffect(() => {
        fetchMovies();
    }, [fetchMovies]);

    const handleToggleRecommend = (movie) => {
        setLikedMovies((prevLikedMovies) => {
            const updatedMovies = prevLikedMovies.some((m) => m.id === movie.id)
                ? prevLikedMovies.filter((m) => m.id !== movie.id)
                : [...prevLikedMovies, movie];
            localStorage.setItem('likedMovies', JSON.stringify(updatedMovies));
            return updatedMovies;
        });
    };

    const handleScroll = useCallback(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
            if (page < totalPages) {
                setPage((prevPage) => prevPage + 1);
            }
        }
    }, [loading, page, totalPages]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);


    return (
        <div className="category-page">
            <h1>{categoryName(category)}</h1>
            <div className="movies-grid">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        likedMovies={likedMovies}
                        onToggleRecommend={handleToggleRecommend}
                        onMovieClick={() => console.log(`Clicked movie ID: ${movie.id}`)}
                    />                ))}
            </div>
            {loading && <div className="loading-spinner">Loading...</div>}
        </div>
    );
};



export default CategoryList;
