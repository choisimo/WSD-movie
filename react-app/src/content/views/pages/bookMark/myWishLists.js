import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getDetailMovie } from 'api/tmdbApi';
import route from 'routes.json';
import './categoryList.css';
import './myWishLists.css'

const MyWishLists = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // 찜한 영화 ID 목록 가져오기
    const getLikedMovies = () => {
        return JSON.parse(localStorage.getItem("likedMovies")) || [];
    };

    const fetchFavoriteMovies = useCallback(async () => {
        const likedMovieIds = getLikedMovies();
        if (likedMovieIds.length === 0) {
            setMovies([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const moviePromises = likedMovieIds.map(id => getDetailMovie(id)); // 각 영화 ID로 영화 데이터 가져오기
            const moviesData = await Promise.all(moviePromises);
            setMovies(moviesData);
        } catch (error) {
            console.error("Error fetching favorite movies:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavoriteMovies();
    }, [fetchFavoriteMovies]);

    return (
        <div className="category-page">
            <h1>내가 찜한 영화</h1>
            {loading ? (
                <div className="loading-spinner">Loading...</div>
            ) : movies.length === 0 ? (
                <p>찜한 영화가 없습니다.</p>
            ) : (
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
            )}
        </div>
    );
};

export default MyWishLists;

