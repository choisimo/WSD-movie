import React, {useCallback, useEffect, useRef , useState} from 'react';
import { useParams } from 'react-router-dom';
import {getCategoryList, getGenreMovieList, getGenres} from 'api/tmdbApi';
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
    const [genreName, setGenreName] = useState('');
    const observer = useRef();

    // 장르 이름 가져오기
    useEffect(() => {
        const fetchGenreNames = async () => {
            try {
                const genreList = await getGenres();
                const current_genre = genreList.find((g) => g.id.toString() === genreId);
                setGenreName(current_genre ? current_genre.name : 'Unknown');
            } catch (error) {
                console.error('Error fetching genre names:', error);
            }
        };
        fetchGenreNames();
    }, [genreId]);

    const fetchMovies = useCallback(async () => {
        if (!genreId) {
            console.error('Invalid genre ID');
            return;
        }

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


    const lastMovieElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && page < totalPages) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        }, [loading, page, totalPages]
    );


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
            <h1>{genreName}</h1>
            <div className="movies-grid">
                {movies.map((movie, index) => (
                    <MovieCard
                        key={movie.id}
                        movie={movie}
                        likedMovies={likedMovies}
                        onToggleRecommend={handleToggleRecommend}
                        onMovieClick={() => console.log(`Clicked movie ID: ${movie.id}`)}
                        ref={index === movies.length - 1 ? lastMovieElementRef : null}
                    />
                ))}
            </div>
            {loading && <div className="loading-spinner">Loading...</div>}
        </div>
    );
};

export default GenreList;
