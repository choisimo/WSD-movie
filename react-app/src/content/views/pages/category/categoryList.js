import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategoryList, getMovies, getGenres } from 'api/tmdbApi';
import './categoryList.css';
import styles from './genre.module.css';
import route from 'routes.json';
import MovieCard from 'content/views/pages/movieCardView/MovieCard';
import { getLikedMovies } from "content/components/utility/bookMark/likeMovies";

const allCategories = [
    { id: 'popular', name: '인기 영화' },
    { id: 'now_playing', name: '현재 상영 중인 영화' },
    { id: 'top_rated', name: '평점이 높은 영화' },
    { id: 'upcoming', name: '개봉 예정 영화' },
];

const CategoryList = ({ category: propCategory }) => {
    const { category: paramCategory } = useParams();
    const category = propCategory || paramCategory;
    const [genres, setGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [likedMovies, setLikedMovies] = useState(getLikedMovies || []);

    const navigate = useNavigate();

    const categoryName = (category) => {
        const matchedCategory = allCategories.find((cat) => cat.id === category);
        return matchedCategory ? matchedCategory.name : '알 수 없는 카테고리';
    };

    const fetchMovies = useCallback(async () => {
        if (!allCategories.some((cat) => cat.id === category)) return;

        setLoading(true);
        try {
            const data = await getCategoryList(category, page);
            setMovies((prevMovies) =>
                page === 1 ? data.results : [...prevMovies, ...data.results]
            );
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    }, [category, page]);

    const fetchGenres = useCallback(async () => {
        try {
            const data = await getGenres();
            setGenres(data);
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    }, []);

    useEffect(() => {
        if (page > 0) {
            fetchMovies();
        }
    }, [page, fetchMovies]);


    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]);

    const handleToggleRecommend = (movie) => {
        setLikedMovies((prevLikedMovies) => {
            const updatedMovies = prevLikedMovies.some((m) => m.id === movie.id)
                ? prevLikedMovies.filter((m) => m.id !== movie.id)
                : [...prevLikedMovies, movie];
            localStorage.setItem('likedMovies', JSON.stringify(updatedMovies));
            return updatedMovies;
        });
    };

    const handleGenreClick = async (genreId) => {
        navigate(route['category/genre/:id'].replace(':id', genreId));
    };

    const handleScroll = useCallback(() => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const threshold = document.body.offsetHeight - 500;

        console.log(`Scroll Position: ${scrollPosition}, Threshold: ${threshold}`);
        if (scrollPosition >= threshold && !loading && page < totalPages) {
            console.log("Loading next page...");
            setPage((prevPage) => prevPage + 1);
        }
    }, [loading, page, totalPages]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if (!allCategories.some((cat) => cat.id === category)) {
        return (
            <div className={styles.unknownCategory}>
                <h1>카테고리 리스트</h1>
                <p>다음 카테고리 중 하나를 선택하세요:</p>
                <ul className="category-list">
                    {allCategories.map((cat) => (
                        <li key={cat.id}>
                            <Link to={`/${cat.id}`}>{cat.name}</Link>
                        </li>
                    ))}
                </ul>
                <div className={styles.tagsContainer}>
                    <h2>영화 태그</h2>
                    <div className={styles.tagsList}>
                        {genres.map((genre) => (
                            <button
                                key={genre.id}
                                className={styles.genreButton}
                                onClick={() => handleGenreClick(genre.id)}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="category-page">
            <h1>{categoryName(category)}</h1>
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

export default CategoryList;
