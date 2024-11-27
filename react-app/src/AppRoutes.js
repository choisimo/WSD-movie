import React, {useEffect, useState} from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import routes from './routes.json';
import SignIn from 'content/views/pages/SignIn/SignIn';
import Dashboard from 'content/views/pages/Dashboard';
import HomePage from 'content/views/pages/home/home';
import ProtectionRouter from 'content/components/security/protectionRouter';
import MovieDetailPage from 'content/views/pages/detailView/MovieDetailPage';
import NotFound from 'content/views/pages/error/404'; // 404 페이지 컴포넌트
import LoadingSpinner from "content/components/utility/LoadingSpinner";
import CategoryList from "content/views/pages/category/categoryList";
import MyWishLists from "content/views/pages/bookMark/myWishLists";
import SearchPage from "content/views/pages/search/search";
import GenreList from "content/views/pages/genre/GenreList";
import UserPage from "content/views/pages/user/userPage";

const AppRoutes = () => {

    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleStartLoading = () => setLoading(true);
        const handleStopLoading = () => setLoading(false);

        // 페이지 변경 감지
        handleStartLoading();
        const timeoutId = setTimeout(handleStopLoading, 200); // 로딩 0.5초 후 종료

        return () => clearTimeout(timeoutId);
    }, [location]);


    return (
        <div>
            {loading && <LoadingSpinner />}
        <Routes>
            {/* 공개된 경로 */}
            <Route path={routes.SignIn} element={<SignIn />} />
            <Route path={routes.home} element={<HomePage />} />
            <Route path={routes["category/genre/:id"]} element={<GenreList />} />


            {/* 보호된 경로 */}
            <Route
                path={routes.setting}
                element={
                <ProtectionRouter>
                    <UserPage />
                </ProtectionRouter>
                }
                />


            <Route
                path={routes.dashboard}
                element={
                    <ProtectionRouter>
                        <Dashboard />
                    </ProtectionRouter>
                }
            />
            <Route
                path={routes.movieInfo}
                element={
                    <ProtectionRouter>
                        <MovieDetailPage />
                    </ProtectionRouter>
                }
            />

            <Route
                path={routes.categoryList}
                element={
                    <ProtectionRouter>
                        <CategoryList />
                    </ProtectionRouter>
                }
            />
            {/* 카테고리별 경로 추가 */}
            <Route
                path={routes["category/popular"]}
                element={
                    <ProtectionRouter>
                        <CategoryList category="popular"/>
                    </ProtectionRouter>
                }
            />
            <Route
                path={routes["category/top_rated"]}
                element={
                    <ProtectionRouter>
                        <CategoryList category="top_rated"/>
                    </ProtectionRouter>
                }
            />
            <Route
                path={routes["category/upcoming"]}
                element={
                    <ProtectionRouter>
                        <CategoryList category="upcoming"/>
                    </ProtectionRouter>
                }
            />
            <Route
                path={routes["category/now_playing"]}
                element={
                    <ProtectionRouter>
                        <CategoryList category="now_playing"/>
                    </ProtectionRouter>
                }
            />
            <Route
                path={routes["category/trending"]}
                element={
                    <ProtectionRouter>
                        <CategoryList category="trending"/>
                    </ProtectionRouter>
                }
            />
            <Route
                path={routes["category/genre/:id"]}
                element={
                    <ProtectionRouter>
                        <CategoryList />
                    </ProtectionRouter>
                }
            />

            <Route
                path={routes.wishList}
                element={
                    <ProtectionRouter>
                        <MyWishLists />
                    </ProtectionRouter>
                }
            />

            <Route
                path={routes.search}
                element={
                    <ProtectionRouter>
                        <SearchPage />
                    </ProtectionRouter>
                }
            />


            {/* 잘못된 경로는 404 페이지로 리다이렉트 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
    );
};

export default AppRoutes;