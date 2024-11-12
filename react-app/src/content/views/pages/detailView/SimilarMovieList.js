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


    const lastMovieElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
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

    return (
        <div className="similar-movies-container">
            <h3>비슷한 영화 추천</h3>
            <div className="similar-movies-list">
                {similarMovies.map((movie, index) => (
                    <div
                        key={movie.id}
                        className="similar-movie"
                        ref={index === similarMovies.length - 1 ? lastMovieElementRef : null}
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
            <div className="scroll-button left">
                <button className="scroll-btn" onClick={() => document.querySelector('.similar-movies-list').scrollBy({ left: -300, behavior: 'smooth' })}>&lt;</button>
            </div>
            <div className="scroll-button right">
                <button className="scroll-btn" onClick={() => document.querySelector('.similar-movies-list').scrollBy({ left: 300, behavior: 'smooth' })}>&gt;</button>
            </div>
        </div>
    );
};

export default SimilarMoviesList;
