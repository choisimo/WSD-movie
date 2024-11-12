// SimilarMoviesList.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSimilarMovies } from 'api/tmdbApi';
import './SimilarMoviesList.css';
import {useNavigate} from "react-router-dom";

const SimilarMoviesList = ({ genreIds }) => {
    const [similarMovies, setSimilarMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observer = useRef();
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();


    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const movies = await getSimilarMovies(genreIds, page);
                setSimilarMovies(movies.results);
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

    const handlePrevious = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };


    /*
    // 페이지 하단에 도달할 때 페이지 번호를 증가시키기 위한 콜백
    const lastMovieElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading]);
*/

    return (
        <div className="similar-movies">
            <h3>비슷한 영화 추천</h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="similar-movie-list">
                    {similarMovies.map((movie) => (
                        <div
                            key={movie.id}
                            className="similar-movie"
                            onClick={() => handleMovieClick(movie.id)}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <p>{movie.title}</p>
                        </div>
                    ))}
                </div>
            )}
            <div className="pagination-controls">
                <button onClick={handlePrevious} disabled={page === 1}>
                    이전
                </button>
                <span>{page} / {totalPages}</span>
                <button onClick={handleNext} disabled={page === totalPages}>
                    다음
                </button>
            </div>
        </div>
    );
};

export default SimilarMoviesList;
