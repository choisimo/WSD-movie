import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from './routes.json';
import SignIn from 'content/views/pages/SignIn/SignIn';
import Dashboard from 'content/views/pages/Dashboard';
import HomePage from 'content/views/pages/home/home';
import ProtectionRouter from 'content/components/security/protectionRouter';
import MovieDetailPage from 'content/views/pages/detailView/MovieDetailPage';
import NotFound from 'content/views/pages/error/404'; // 404 페이지 컴포넌트

const AppRoutes = () => {
    return (
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
    );
};

export default AppRoutes;