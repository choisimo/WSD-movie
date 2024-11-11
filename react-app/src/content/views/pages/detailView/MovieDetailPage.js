import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TMDBApi } from 'api/tmdbApi';
import './MovieDetailPage.css';


const MovieDetailPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            const detail = await TMDBApi.getDetailMovie(id);
            console.log('Fetched movie detail:', detail); // 이곳에서 로그 확인
            setMovie(detail);
        };
        fetchMovie();
    }, [id]);

    if (!movie) return <p>Loading...</p>;

    return (
        <div className="movie-detail">
            <div className="movie-banner" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` }}>
                <div className="banner-content">
                    <h1>{movie.title}</h1>
                    <p>{movie.overview}</p>
                    <p><strong>개봉일:</strong> {movie.release_date}</p>
                </div>
            </div>
            <div className="movie-info">
                <img className="poster" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="details">
                    <h2>{movie.title}</h2>
                    <p><strong>평점:</strong> {movie.vote_average}</p>
                    <p><strong>장르:</strong> {movie.genres.map((genre) => genre.name).join(', ')}</p>
                    <p><strong>개봉일:</strong> {movie.release_date}</p>
                    <p>{movie.overview}</p>
                </div>
            </div>
            {movie.videos && movie.videos.results.length > 0 && (
                <div className="movie-videos">
                    <h3>트레일러</h3>
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                        title="Movie Trailer"
                    ></iframe>
                </div>
            )}
        </div>
    );
};

export default MovieDetailPage;
