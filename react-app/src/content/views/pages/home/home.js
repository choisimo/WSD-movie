import React, { useEffect, useRef, useState } from 'react';
import { TMDBApi } from 'api/tmdbApi';
import './home.css';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [featuredMovie, setFeaturedMovie] = useState(null);

    const sections = [
        { title: '최신 컨텐츠', category: 'now_playing' },
        { title: '인기 컨텐츠', category: 'popular' },
        { title: '최고 평점 컨텐츠', category: 'top_rated' },
        { title: '내가 찜한 컨텐츠', category: 'upcoming' }
    ];

    useEffect(() => {
        const loadMovies = async () => {
            const allMovies = await Promise.all(
                sections.map(async (section) => ({
                    title: section.title,
                    movies: await TMDBApi.getMovies(section.category)
                }))
            );
            setMovies(allMovies);

            if (allMovies.length > 0 && allMovies[0].movies.length > 0) {
                const randomIndex = Math.floor(Math.random() * allMovies[0].movies.length);
                setFeaturedMovie(allMovies[0].movies[randomIndex]);
            }
        };
        loadMovies();
    }, []);

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <div className="home">
            {featuredMovie && (
                <div className="banner" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${featuredMovie.backdrop_path})` }}>
                    <div className="banner-content">
                        <h1>{featuredMovie.title}</h1>
                        <p>{featuredMovie.overview}</p>
                        <button onClick={() => handleMovieClick(featuredMovie.id)}>바로보기</button>
                    </div>
                </div>
            )}

            {movies.map((section, idx) => (
                <div key={idx} className="content-section">
                    <h2>{section.title}</h2>
                    <ContentRow movies={section.movies} onMovieClick={handleMovieClick} />
                </div>
            ))}
        </div>
    );
};

const ContentRow = ({ movies, onMovieClick }) => {
    const rowRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const startDrag = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - rowRef.current.offsetLeft);
        setScrollLeft(rowRef.current.scrollLeft);
    };

    const stopDrag = () => {
        setIsDragging(false);
    };

    const handleDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - rowRef.current.offsetLeft;
        const walk = (x - startX) * 2; // 스크롤 속도 조절
        rowRef.current.scrollLeft = scrollLeft - walk;
    };

    return (
        <div
            className="content-row"
            ref={rowRef}
            onMouseDown={startDrag}
            onMouseLeave={stopDrag}
            onMouseUp={stopDrag}
            onMouseMove={handleDrag}
        >
            {movies.slice(0, 6).map((movie) => (
                <div key={movie.id} className="content-item" onClick={() => onMovieClick(movie.id)}>
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                    <p>{movie.title}</p>
                </div>
            ))}
        </div>
    );
};

export default HomePage;
