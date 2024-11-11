import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routes from './routes.json';
import SignIn from 'content/views/pages/SignIn/SignIn';
import Dashboard from 'content/views/pages/Dashboard';
import HomePage from 'content/views/pages/home/home';
import ProtectedRoute from 'content/components/security/protectionRouter';

const AppRoutes = () => {
    return (
        <Routes>
            {/* 로그인 페이지 */}
            <Route path={routes.SignIn} element={<SignIn />} />

            {/* 보호된 경로: 인증된 사용자만 접근 가능 */}
            <Route
                path={routes.dashboard}
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* 홈 페이지 */}
            <Route path={routes.home} element={<HomePage />} />

            {/* 추가 경로는 필요에 따라 여기에 정의 */}
        </Routes>
    );
};

export default AppRoutes;
