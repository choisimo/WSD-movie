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

            {/* 보호된 경로 */}
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

            {/* 잘못된 경로는 404 페이지로 리다이렉트 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        </div>
    );
};

export default AppRoutes;