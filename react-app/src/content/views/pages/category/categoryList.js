import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getCategoryList, getMovies, getGenres } from 'api/tmdbApi';
import './categoryList.css';
import styles from './genre.module.css';
import tableStyles from './moviesTable.module.css';
import categoryListStyle from './categoryList.module.css';
import route from 'routes.json';
import MovieCard from 'content/views/pages/movieCardView/MovieCard';
import { getLikedMovies } from "content/components/utility/bookMark/likeMovies";
import {useAlert} from "content/components/alert/customAlert";

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
    const defaultViewMode = localStorage.getItem('viewMode') || 'infinite';
    const [viewMode, setViewMode] = useState(defaultViewMode);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [likedMovies, setLikedMovies] = useState(getLikedMovies || []);
    const {showAlert} = useAlert();
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
                viewMode === 'table' ? data.results : page === 1 ? data.results : [...prevMovies, ...data.results]
            );

            setTotalPages(data.total_pages);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    }, [category, page, viewMode]);

    const fetchGenres = useCallback(async () => {
        try {
            const data = await getGenres();
            setGenres(data);
        } catch (error) {
            console.error('Error fetching genres:', error);
            showAlert('error', '장르를 불러오는 중 오류가 발생했습니다.');
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


    useEffect(() => {
        localStorage.setItem('viewMode', viewMode);
        setPage(1); // 뷰 모드 변경 시 페이지를 초기화
        setMovies([]); // 기존 데이터를 초기화
        fetchMovies(); // 새로운 데이터 로드
    }, [viewMode]); // viewMode 변경 시 동작

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    const handlePagination = (direction) => {
        if (direction === "prev" && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
            setPage((prev) => prev - 1);
        }
        if (direction === "next" && currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
            setPage((prev) => prev + 1);
        }
    };
    const handleToggleRecommend = (movie) => {
        setLikedMovies((prevLikedMovies) => {
            const isLiked = prevLikedMovies.some((m) => m.id === movie.id);

            const updatedMovies = isLiked
                ? prevLikedMovies.filter((m) => m.id !== movie.id)
                : [...prevLikedMovies, movie];

            // 로컬 스토리지 업데이트
            localStorage.setItem('likedMovies', JSON.stringify(updatedMovies));
            return updatedMovies;
        });
    };
    const handleGenreClick = async (genreId) => {
        navigate(route['category/genre/:id'].replace(':id', genreId));
    };

    const handleScroll = useCallback(() => {
        if (viewMode !== 'infinite') return;

        const scrollPosition = window.scrollY;
        const threshold = 200; // 버튼이 나타날 스크롤 위치

        if (scrollPosition > threshold) {
            setShowTopBtn(true);
        } else {
            setShowTopBtn(false);
        }

        const bottomThreshold = document.body.offsetHeight - 500;
        if (window.innerHeight + scrollPosition >= bottomThreshold && !loading && page < totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [loading, page, totalPages, viewMode]);



    useEffect(() => {
        if (viewMode === "infinite") {
            window.addEventListener("scroll", handleScroll);
        }
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll, viewMode]);

    return (
        <div className="category-page">
            {/* 알 수 없는 카테고리 처리 */}
            {!allCategories.some((cat) => cat.id === category) ? (
                <div className="unknown-category">
                    <h1>카테고리 목록</h1>
                    <p>다음 카테고리 중 하나를 선택하세요:</p>
                    <ul className="category-list">
                        {allCategories.map((cat) => (
                            <li key={cat.id}>
                                <Link to={`/${cat.id}`}>{cat.name}</Link>
                            </li>
                        ))}
                    </ul>

                    {/* 태그 리스트 렌더링 */}
                    <div className={styles.tagsContainer}>
                        <h2>영화 태그</h2>
                        {genres.length > 0 ? (
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
                        ) : (
                            <p>태그를 불러오는 중입니다...</p>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* View Mode Toggle */}
                    <div className={categoryListStyle.viewModeToggle}>
                        <button
                            onClick={() => handleViewChange('table')}
                            className={viewMode === 'table' ? 'active' : ''}
                        >
                            테이블 뷰
                        </button>
                        <button
                            onClick={() => handleViewChange('infinite')}
                            className={viewMode === 'infinite' ? 'active' : ''}
                        >
                            무한 스크롤
                        </button>
                    </div>

                    {/* View Mode 렌더링 */}
                    {viewMode === 'table' ? (
                        <div className={tableStyles.tableViewContainer}>
                            <table className={tableStyles.moviesTable}>
                                <thead>
                                <tr>
                                    <th>포스터</th>
                                    <th>제목</th>
                                    <th>평점</th>
                                    <th>개봉일</th>
                                    <th>북마크</th>
                                </tr>
                                </thead>
                                <tbody>
                                {movies.map((movie) => (
                                    <tr key={movie.id}>
                                        <td>
                                            <img
                                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                alt={movie.title}
                                                className={tableStyles.posterImage}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className={tableStyles.titleButton}
                                                onClick={() => navigate(route.movieInfo.replace(':id', movie.id))}
                                            >
                                                {movie.title}
                                            </button>
                                        </td>
                                        <td>{movie.vote_average}</td>
                                        <td>{movie.release_date}</td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleRecommend(movie)}
                                                className={`${tableStyles.bookmarkButton} ${
                                                    likedMovies.some((m) => m.id === movie.id)
                                                        ? tableStyles.active
                                                        : ''
                                                }`}
                                            >
                                                {likedMovies.some((m) => m.id === movie.id)
                                                    ? '취소'
                                                    : '북마크'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className={tableStyles.paginationContainer}>
                                <button
                                    onClick={() => handlePagination('prev')}
                                    className={tableStyles.paginationButton}
                                    disabled={page === 1}
                                >
                                    이전
                                </button>
                                <span>
                {page} / {totalPages}
            </span>
                                <button
                                    onClick={() => handlePagination('next')}
                                    className={tableStyles.paginationButton}
                                    disabled={page === totalPages}
                                >
                                    다음
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="movies-grid">
                            {movies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={movie}
                                    liked={likedMovies.some((m) => m.id === movie.id)}
                                    onToggleRecommend={() => handleToggleRecommend(movie)}
                                />
                            ))}
                            {showTopBtn && (
                                <button className="scroll-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                                    Top
                                </button>
                            )}
                            {loading && <div className="loading-spinner">Loading...</div>}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};


export default CategoryList;
