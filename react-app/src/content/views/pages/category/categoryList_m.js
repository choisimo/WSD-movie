import React from 'react';
import './mobileCategoryList.css';

const MobileCategoryList = ({ movies, handleToggleRecommend }) => {
    return (
        <div className="mobile-category-list">
            {movies.map((movie) => (
                <div className="movie-card" key={movie.id}>
                    <img
                        src={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                                : '/images/default-poster.png'
                        }
                        alt={movie.title}
                        className="movie-poster"
                    />
                    <div className="movie-info">
                        <h3 className="movie-title">{movie.title}</h3>
                        <p className="movie-rating">평점: {movie.vote_average}</p>
                        <button
                            onClick={() => handleToggleRecommend(movie)}
                            className={`bookmark-button ${
                                likedMovies.some((m) => m.id === movie.id) ? 'active' : ''
                            }`}
                        >
                            {likedMovies.some((m) => m.id === movie.id) ? '취소' : '북마크'}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MobileCategoryList;
