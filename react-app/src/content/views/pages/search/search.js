import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { searchMovies, getGenreMovieList } from 'api/tmdbApi';
import './search.css';
import route from 'routes.json';
import MovieCard from 'content/views/pages/movieCardView/MovieCard';

const SearchPage = () => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [rating, setRating] = useState('');
    const [sort, setSort] = useState('popularity.desc');
    const [year, setYear] = useState('');
    const [initialLoad, setInitialLoad] = useState(true); // 초기 로드 상태 관리
    const [likedMovies, setLikedMovies] = useState([]);

    // 장르 목록 가져오기
    useEffect(() => {
        const fetchGenres = async () => {
            const genreData = await getGenreMovieList();
            const resultMovies = genreData.results || [];
            setGenres(resultMovies);
        };
        fetchGenres();
    }, []);
    // 좋아요 목록 가져오기
    useEffect(() => {
        const storedLikedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
        setLikedMovies(storedLikedMovies);
    }, []);

    const handleSearch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await searchMovies({ query, page, genre: selectedGenre, rating, sort, year });
            setMovies((prev) => page === 1 ? data.results : [...prev, ...data.results]);
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error("Error searching movies:", error);
        } finally {
            setLoading(false);
            setInitialLoad(false); // 초기 로드 완료
        }
    }, [query, page, selectedGenre, rating, sort, year]);

    useEffect(() => {
        handleSearch();
    }, [page, query, selectedGenre, rating, sort, year, handleSearch]);

    // 무한 스크롤 처리
    const handleScroll = useCallback(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading && page < totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [loading, page, totalPages]);

    useEffect(() => {
        if (!initialLoad) {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll, initialLoad]);

    const resetFilters = () => {
        setQuery('');
        setSelectedGenre('');
        setRating('');
        setSort('popularity.desc');
        setYear('');
        setMovies([]);
        setPage(1);
    };
    const toggleRecommend = (movie) => {
        const updatedLikes = likedMovies.some((m) => m.id === movie.id)
            ? likedMovies.filter((m) => m.id !== movie.id) // 영화 제거
            : [...likedMovies, movie]; // 영화 추가

        setLikedMovies(updatedLikes);
        localStorage.setItem('likedMovies', JSON.stringify(updatedLikes)); // localStorage 업데이트
    };



    return (
        <div className="search-page">
            <h1>영화 검색</h1>
            <div className="filter-controls">
                <input
                    type="text"
                    placeholder="영화 제목을 입력하세요..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                    <option value="">장르 선택</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                </select>
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="">평점 선택</option>
                    {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>{i + 1} 이상</option>
                    ))}
                </select>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="popularity.desc">인기순</option>
                    <option value="release_date.desc">최신순</option>
                    <option value="vote_average.desc">평점순</option>
                </select>
                <input
                    type="number"
                    placeholder="개봉 연도"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                />
                <button onClick={resetFilters}>초기화</button>
            </div>

            {loading && page === 1 ? (
                <div className="loading-spinner">Loading...</div>
            ) : (
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            likedMovies={likedMovies}
                            onMovieClick={(id) => console.log(`Navigating to movie with id ${id}`)}
                            onToggleRecommend={toggleRecommend}
                        />
                    ))}
                </div>
            )}
            {loading && page > 1 && <div className="loading-spinner">Loading more...</div>}
        </div>
    );
};



export default SearchPage;
