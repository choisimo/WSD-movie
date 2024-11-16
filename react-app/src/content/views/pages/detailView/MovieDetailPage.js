import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { getDetailMovie } from 'api/tmdbApi';
import './MovieDetailPage.css';
import SimilarMoviesList from "content/views/pages/detailView/SimilarMovieList";
import route from 'routes.json'

const MovieDetailPage = () => {

    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                const detail = await getDetailMovie(id);
                if (detail) {
                    setMovie(detail);
                } else {
                    setError('영화를 찾을 수 없습니다.');
                }
            } catch (error) {
                console.error('Error fetching movie:', error);
                setError('영화 정보를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const shortOverview = movie.overview.slice(0, 60);
    const selectedGenres = movie.genres.slice(0, 3);
    const trailerUrl = movie.videos && movie.videos.results.length > 0
        ? `https://www.youtube.com/embed/${movie.videos.results[0].key}`
        : null;
    const handleGenreClick = (genre) => {
        navigate(route["category/genre/:id"].replace(':id', genre));
    }

    return (
        <div className="movie-detail">
            <div
                className="movie-banner"
                style={{backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`}}
            >
                <div className="overlay">
                    <div className="content">
                        <h1>{movie.title}</h1>
                        <p className="movie-description">{movie.overview}</p>
                        <p className="movie-info">
                            <strong>평점:</strong> {movie.vote_average}<br/>
                            <strong>장르:</strong>
                            {movie.genres ? movie.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="genre-link"
                                    onClick={() => handleGenreClick(genre.id)}
                                >
                                    {genre.name}
                                </span>
                            )) : 'N/A'} <br/>
                            <strong>개봉일:</strong> {movie.release_date}
                        </p>
                    </div>
                </div>
            </div>
            <div className="movie-content">
                <div className="movie-videos">
                    {trailerUrl ? (
                        <div className="responsive-iframe">
                            <iframe
                                src={trailerUrl}
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                title="Movie Trailer"
                            ></iframe>
                        </div>
                    ) : (
                        <div className="trailer-placeholder">비디오 없음</div>
                    )}
                </div>
            </div>
            <SimilarMoviesList genreIds={selectedGenres.map((genre) => genre.id)}/>
        </div>
    );
};

export default MovieDetailPage;
