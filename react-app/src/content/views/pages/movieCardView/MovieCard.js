import React, { useState, useEffect, forwardRef } from 'react';
import BookmarkButton from 'content/components/utility/bookMark/bookMarkButton';
import './MovieCard.css';
import {useNavigate} from "react-router-dom";
import route from "routes";
import movieDetailPage from "content/views/pages/detailView/MovieDetailPage";

const MovieCard = forwardRef(({ movie, likedMovies, onToggleRecommend }, ref) => {
    const [isLiked, setIsLiked] = useState(likedMovies ? likedMovies.some((m) => m.id === movie.id) : false);
    const navigate = useNavigate();

    useEffect(() => {
        const likedMovies = JSON.parse(localStorage.getItem('likedMovies')) || [];
        setIsLiked(likedMovies.some((m) => m.id === movie.id));
    }, [movie.id]);

    const handleBookmarkClick = () => {
        onToggleRecommend(movie);
        setIsLiked(!isLiked);
    };

    const handleCardClick = () => {
        if (route.movieInfo) {
            const movieDetailPath = route.movieInfo.replace(':id', movie.id);
            navigate(movieDetailPath); // 경로 이동
        } else {
            console.error('movieInfo 경로가 올바르지 않습니다.');
        }
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
        <div className="movie-card" ref={ref} onClick={handleCardClick}>
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
});

MovieCard.defaultProps = {
    onToggleRecommend: () => {
    },
}


export default MovieCard;
