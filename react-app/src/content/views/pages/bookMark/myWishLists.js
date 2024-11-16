import React, { useEffect, useState } from 'react';
import MovieCard from 'content/views/pages/movieCardView/MovieCard';
import './myWishListLayout.css';
import './myWishLists.css';

const MyWishLists = () => {
    const [movies, setMovies] = useState([]);

    // 찜한 영화 목록 가져오기
    useEffect(() => {
        const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
        setMovies(likedMovies);
    }, []);

    // 찜한 영화 목록 업데이트 (북마크 취소 시 사용)
    const toggleRecommend = (movie) => {
        const updatedMovies = movies.some((m) => m.id === movie.id)
            ? movies.filter((m) => m.id !== movie.id) // 영화 제거
            : [...movies, movie]; // (Optional) 영화 추가 기능

        setMovies(updatedMovies);
        localStorage.setItem('likedMovies', JSON.stringify(updatedMovies));
    };

    return (
        <div className="category-page">
            <h1>내가 찜한 영화</h1>
            {movies.length === 0 ? (
                <p>찜한 영화가 없습니다.</p>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            likedMovies={movies}
                            onToggleRecommend={toggleRecommend}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyWishLists;
