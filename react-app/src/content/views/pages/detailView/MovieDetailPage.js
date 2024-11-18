import React, {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { getDetailMovie, getMovieCredits, getMovieReviews,getPersonMovieCredits} from 'api/tmdbApi';
import './MovieDetailPage.css';
import './movieDetailView_actor_review.css';
import './actor_related_list.css';
import main_style from './movieDetailPage.module.css';
import SimilarMoviesList from "content/views/pages/detailView/SimilarMovieList";
import route from 'routes.json'

const MovieDetailPage = () => {

    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [showReviews, setShowReviews] = useState(false); // 리뷰 표시 여부
    const [credits, setCredits] = useState({ cast: [], crew: [] });
    const [reviews, setReviews] = useState([]);
    const [actorMovies, setActorMovies] = useState([]); // 배우 영화 리스트
    const [selectedActor, setSelectedActor] = useState(null); // 선택된 배우 정보
    const [actorMoviesPage, setActorMoviesPage] = useState(1); // 배우 영화 페이지
    const [actorMoviesTotalPages, setActorMoviesTotalPages] = useState(1); // 총 페이지
    const navigate = useNavigate();

    const scrollContainerRef = useRef(null);
    const touchStartX = useRef(0);
    const scrollLeftStart = useRef(0);

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX; // 터치 시작 위치 저장
        scrollLeftStart.current = scrollContainerRef.current.scrollLeft; // 현재 스크롤 위치 저장
    };

    const handleTouchMove = (e) => {
        const deltaX = touchStartX.current - e.touches[0].clientX; // 터치 이동 거리 계산
        scrollContainerRef.current.scrollLeft = scrollLeftStart.current + deltaX; // 스크롤 위치 업데이트
    };

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                setActorMovies([]); // 배우 영화 리스트 초기화
                setSelectedActor(null); // 선택된 배우 초기화
                setActorMoviesPage(1); // 배우 영화 페이지 초기화
                setActorMoviesTotalPages(1); // 배우 영화 총 페이지 초기화

                const [detail, creditData, reviewData] = await Promise.all([
                    getDetailMovie(id),
                    getMovieCredits(id),
                    getMovieReviews(id),
                ]);

                setMovie(detail || null);
                setCredits(creditData || { cast: [], crew: [] });
                setReviews(reviewData || []);
            } catch (error) {
                console.error('Error fetching movie details:', error);
                setError('영화 정보를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);


    useEffect(() => {
        if (selectedActor && actorMoviesPage > 1) {
            fetchActorMovies(selectedActor, actorMoviesPage);
        }
    }, [actorMoviesPage, selectedActor]);

    const fetchActorMovies = async (actor, page) => {
        try {
            const movies = await getPersonMovieCredits(actor.id);
            setActorMovies((prev) => [...prev, ...movies.slice((page - 1) * 10, page * 10)]);
            setActorMoviesTotalPages(Math.ceil(movies.length / 10)); // 페이지 계산
        } catch (error) {
            console.error('Error fetching actor movies:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const handleShowReviews = () => {
        setShowReviews((prev) => !prev);
    };

    const handleToggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleActorClick = async (actor) => {
        if (selectedActor?.id === actor.id) {
            // 같은 배우를 클릭하면 리스트 접기
            setSelectedActor(null);
            setActorMovies([]);
            return;
        }

        // 다른 배우를 클릭하면 새로운 영화 리스트 가져오기
        setSelectedActor(actor);
        setActorMovies([]);
        setActorMoviesPage(1); // 페이지 초기화
        await fetchActorMovies(actor, 1);
    };

    const handleScroll = (e) => {
        const { scrollLeft, scrollWidth, clientWidth } = e.target;
        if (scrollLeft + clientWidth >= scrollWidth - 50 && actorMoviesPage < actorMoviesTotalPages) {
            setActorMoviesPage((prev) => prev + 1);
        }
    };

    const overviewText = isExpanded ? movie.overview : movie.overview.slice(0, 100) + "...";
    const selectedGenres = movie.genres.slice(0, 3);
    const trailerUrl = movie.videos && movie.videos.results.length > 0
        ? `https://www.youtube.com/embed/${movie.videos.results[0].key}`
        : null;
    const handleGenreClick = (genre) => {
        navigate(route["category/genre/:id"].replace(':id', genre));
    }
    const handleMovieClick = (movieId) => {
        navigate(route.movieInfo.replace(':id', movieId));
    };
    return (
        <div className="movie-detail">
            <div
                className="movie-banner"
                style={{backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`}}
            >
                <div className="overlay">
                    <div className="content">
                        <h1>{movie.title}</h1>
                        <p className="movie-description">
                            {overviewText}
                            <span className={main_style.toggleOverview} onClick={handleToggleExpand}>
                                {isExpanded ? " 접기" : " 더보기"}
                            </span>
                        </p>
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
            {/* 배우 정보 섹션 */}
            <div className="movie-cast">
                <h2>주요 출연진</h2>
                <ul className="cast-list">
                    {credits.cast.map((actor) => (
                        <li key={actor.id} onClick={() => handleActorClick(actor)}>
                            <img
                                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                                alt={actor.name}
                                className="actor-photo"
                            />
                            <p>{actor.name}</p>
                            <p className="character">({actor.character})</p>
                        </li>
                    ))}
                </ul>
            </div>

            {selectedActor && (
                <div className="actor-movies">
                    <h2>{selectedActor.name} 출연 영화</h2>
                    <div className={main_style.movieScrollButtons}>
                        <button className={main_style.scrollButton.left} onClick={() => handleScroll(-300)}>
                            {"<"}
                        </button>
                        <div
                            className="movie-scroll-container"
                            ref={scrollContainerRef}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                        >
                            {actorMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="actor-movie-item"
                                    onClick={() => handleMovieClick(movie.id)}
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                        className="actor-movie-poster"
                                    />
                                    <p>{movie.title}</p>
                                </div>
                            ))}
                        </div>
                        <button className="scroll-button right" onClick={() => handleScroll(300)}>
                            {">"}
                        </button>
                    </div>
                </div>
            )}


            {/* 사용자 리뷰 섹션 */}
            {reviews.length > 0 && (
                <div className="movie-reviews">
                    <button onClick={handleShowReviews}>
                        {showReviews ? '리뷰 닫기' : '리뷰 보기'}
                    </button>
                    {showReviews && (
                        <ul className="review-list">
                            {reviews.map((review) => (
                                <li key={review.id} className="review-item">
                                    <h3>{review.author}</h3>
                                    <p>{review.content}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            <SimilarMoviesList genreIds={selectedGenres.map((genre) => genre.id)} />
        </div>
    );
};


export default MovieDetailPage;
