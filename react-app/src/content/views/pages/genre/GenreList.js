import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGenreMovieList } from 'api/tmdbApi';
import './GenreList.css';
import MovieCard from 'content/views/pages/movieCardView/MovieCard';
import { getLikedMovies, toggleLikeMovie } from 'content/components/utility/bookMark/likeMovies';

const GenreList = () => {
    const { id: genreId } = useParams();
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [likedMovies, setLikedMovies] = useState(getLikedMovies() || []);

    const fetchMovies = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getGenreMovieList(genreId, page);
            setMovies((prevMovies) => [...prevMovies, ...data.results]);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Error fetching genre movies:', error);
        } finally {
            setLoading(false);
        }
    }, [genreId, page]);

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

    return (
        <div className="genre-page">
            <h1>장르별 영화</h1>
            <div className="movies-grid">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        likedMovies={likedMovies}
                        onToggleRecommend={handleToggleRecommend}
                        onMovieClick={() => console.log(`Clicked movie ID: ${movie.id}`)}
                    />
                ))}
            </div>
            {loading && <div className="loading-spinner">Loading...</div>}
        </div>
    );
};

export default GenreList;
