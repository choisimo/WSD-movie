import React, { useState, useEffect, useCallback } from 'react';
import { searchMovies, getGenres } from 'api/tmdbApi';
import './search.css';
import './m_search.css';
import searchModule from './search.module.css';
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
    const [likedMovies, setLikedMovies] = useState(() => {
        return JSON.parse(localStorage.getItem('likedMovies') || '[]');
    });

    const [useAndSearch, setUseAndSearch] = useState(true);
    const currentYear = new Date().getFullYear();
    const [searchHistory, setSearchHistory] = useState(() => {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    })

    // Fetch genres on component mount
    useEffect(() => {
        const fetchGenres = async () => {
            const genreData = await getGenres();
            setGenres(genreData);
        };
        fetchGenres();
    }, []);

// Fetch movies
    const fetchMovies = useCallback(async (reset = false) => {
        setLoading(true);
        try {
            let data;
            if (query.trim() && useAndSearch) {
                // 제목 + 옵션 검색 (AND)
                data = await searchMovies({ query, page });
                let filteredResults = data.results;

                // 클라이언트에서 추가 필터링
                if (selectedGenre) {
                    filteredResults = filteredResults.filter((movie) =>
                        movie.genre_ids.includes(parseInt(selectedGenre))
                    );
                }
                if (rating) {
                    filteredResults = filteredResults.filter(
                        (movie) => movie.vote_average >= parseFloat(rating)
                    );
                }
                if (year) {
                    filteredResults = filteredResults.filter(
                        (movie) => movie.release_date?.startsWith(year)
                    );
                }

                setMovies((prev) =>
                    reset ? filteredResults : [...prev, ...filteredResults]
                );
            } else {
                // 기본 검색 (query만 or 옵션만)
                data = await searchMovies({
                    query,
                    page,
                    genre: selectedGenre,
                    rating,
                    sort,
                    year,
                });

                setMovies((prev) => {
                    const existingMovieIds = new Set(reset ? [] : prev.map((movie) => movie.id));

                    // 중복 데이터 제거
                    const filteredMovies = data.results.filter((movie) => !existingMovieIds.has(movie.id));

                    return reset ? filteredMovies : [...prev, ...filteredMovies];
                });


            }
            setTotalPages(data.total_pages);
        } catch (error) {
            console.error('Error searching movies:', error);
        } finally {
            setLoading(false);
        }
    }, [query, page, selectedGenre, rating, sort, year, useAndSearch]);

    // 검색 버튼 클릭 시
    const handleSearch = () => {
        setPage(1);
        fetchMovies(true);
    };


// 옵션 변경 시 검색 실행
    useEffect(() => {
        setPage(1); // 페이지 초기화
        fetchMovies(true); // 새로운 옵션으로 검색 시 reset = true
    }, [selectedGenre, rating, sort, year, useAndSearch]);

// 페이지 변경 시 추가 데이터 로드
    useEffect(() => {
        if (page > 1) {
            fetchMovies(false); // 추가 데이터 로드 시 reset = false
        }
    }, [page, fetchMovies]);


// Infinite scroll handling
    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
            !loading &&
            page < totalPages
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [loading, page, totalPages]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Toggle movie recommendation
    const toggleRecommend = (movie) => {
        const updatedLikes = likedMovies.some((m) => m.id === movie.id)
            ? likedMovies.filter((m) => m.id !== movie.id)
            : [...likedMovies, movie];

        setLikedMovies(updatedLikes);
        localStorage.setItem('likedMovies', JSON.stringify(updatedLikes));
    };


    const handleHistoryClick = (history) => {
        setQuery(history);
        setPage(1);
        fetchMovies();
    };

    const handleHistoryDelete = (history) => {
        const updatedHistory = searchHistory.filter((h) => h !== history);
        setSearchHistory(updatedHistory);
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    };

    return (
        <div className="search-page">
            <h1>영화 검색</h1>

            {/* 검색 제목 섹션 */}
            <div className={searchModule.titleSearchSection}>
                <input
                    type="text"
                    placeholder="영화 제목을 입력하세요..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={searchModule.titleInput}
                />
                <button className={searchModule.searchBtn} onClick={handleSearch}>
                    검색
                </button>
            </div>

            {/* 필터 옵션 섹션 */}
            <div className={searchModule.filterControls}>
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                    <option value="">장르 선택</option>
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                    <option value="">평점 선택</option>
                    {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1} 이상
                        </option>
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
                    min="1890"
                    max={currentYear}
                />
            </div>

            {/* 로딩 및 결과 출력 */}
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
                        />
                    ))}
                </div>
            )}
            {loading && page > 1 && <div className="loading-spinner">로딩 중...</div>}
        </div>
    );
};


export default SearchPage;
