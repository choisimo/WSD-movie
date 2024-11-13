import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {getGenreMovieList, getMovies} from 'api/tmdbApi';
import './categoryList.css';
import route from 'routes.json';
import BookmarkButton from "content/views/pages/bookMark/myWishLists";
import { getLikedMovies, toggleLikeMovie } from "content/components/utility/bookMark/likeMovies";

const CategoryList = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const useCallback = require('react').useCallback;
    console.log(category);
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
            const data = await getGenreMovieList(category, page);
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
                    <Link key={movie.id} to={route.movieInfo.replace(":id", movie.id)} className="movie-item">
                        <div className="movie-image-container">
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                            <div className="movie-overlay">
                                <p className="movie-title">{movie.title}</p>
                                <div className="movie-info">
                                    <span className="movie-release">개봉일: {movie.release_date}</span>
                                    <span className="movie-rating">평점: {movie.vote_average} ★</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {loading && <div className="loading-spinner">Loading...</div>}
        </div>
    );
};



export default CategoryList;
