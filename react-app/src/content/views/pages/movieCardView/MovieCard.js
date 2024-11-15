import React, { useState, useEffect } from 'react';
import BookmarkButton from 'content/components/utility/bookMark/bookMarkButton';
import './MovieCard.css';

const MovieCard = ({ movie, likedMovies, onMovieClick, onToggleRecommend }) => {
    const [isLiked, setIsLiked] = useState(likedMovies.some((m) => m.id === movie.id));

    useEffect(() => {
        setIsLiked(likedMovies.some((m) => m.id === movie.id));
    }, [likedMovies, movie.id]);

    const handleBookmarkClick = () => {
        onToggleRecommend(movie);
        setIsLiked(!isLiked);
    };

    const renderStarRating = (voteAverage) => {
        const rating = voteAverage / 2;
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<span key={i} className="full-star">★</span>);
            } else if (i - 0.5 <= rating) {
                stars.push(<span key={i} className="half-star">★</span>);
            } else {
                stars.push(<span key={i} className="empty-star">☆</span>);
            }
        }
        return stars;
    };

    return (
        <div className="movie-card" onClick={() => onMovieClick(movie.id)}>
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
            />
            <BookmarkButton
                isLiked={isLiked}
                onClick={handleBookmarkClick}
                className="bookmark-icon"
            />
            <div className="movie-info-hover">
                <p className="movie-title">평점: {movie.vote_average}</p>
                <div className="star-rating">{renderStarRating(movie.vote_average)}</div>
                <p><strong>개봉일:</strong> {movie.release_date}</p>
            </div>
            <p className="movie-title">{movie.title}</p>
        </div>
    );
};

export default MovieCard;
