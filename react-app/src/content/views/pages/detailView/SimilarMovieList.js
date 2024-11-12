import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSimilarMovies } from 'api/tmdbApi';
import './SimilarMoviesList.css';
import { useNavigate } from "react-router-dom";

const SimilarMoviesList = ({ genreIds }) => {
    const [similarMovies, setSimilarMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const [totalPages, setTotalPages] = useState(1);
    const [showExpand, setShowExpand] = useState(false);
    const navigate = useNavigate();

    const lastMovieElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && page < totalPages) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, page, totalPages]);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const movies = await getSimilarMovies(genreIds, page);
                setSimilarMovies((prevMovies) =>
                    page === 1 ? movies.results : [...prevMovies, ...movies.results]
                );
                setTotalPages(movies.total_pages);
            } catch (error) {
                console.error('Error fetching similar movies:', error);
            } finally {
                setLoading(false);
            }
        };

        if (genreIds && genreIds.length > 0) {
            fetchMovies();
        }
    }, [genreIds, page]);

    const handleMovieClick = (movieId) => {
        navigate(`/movie/detail/${movieId}`);
    };

    const toggleShowExpand = () => {
        setShowExpand((prevShowExpand) => !prevShowExpand);
    };

    return (
        <div className="similar-movies-container">
            <h3>비슷한 영화 추천</h3>
            <div className={`similar-movies-list ${showExpand ? 'expanded' : ''}`}>
                {similarMovies.map((movie, index) => (
                    <div
                        key={movie.id}
                        className="similar-movie"
                        onClick={() => handleMovieClick(movie.id)}
                        ref={index === similarMovies.length - 1 ? lastMovieElementRef : null}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                        />
                        <p>{movie.title}</p>
                    </div>
                ))}
            </div>
            <button className="show-all-btn" onClick={toggleShowExpand}>
                {showExpand ? '간략히 보기' : '전체 보기'}
            </button>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default SimilarMoviesList;
