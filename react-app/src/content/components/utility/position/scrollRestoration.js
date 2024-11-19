import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollPosition } from './scrollPositionProvider';

const ScrollRestoration = () => {
    const location = useLocation();
    const { saveScrollPosition, getScrollPosition } = useScrollPosition();

    useEffect(() => {
        const currentPath = location.pathname;

        // 페이지 이동 전 현재 위치 저장
        const saveCurrentScrollPosition = () => {
            saveScrollPosition(currentPath);
        };

        // 뒤로 가기 및 앞으로 가기 버튼 처리
        const handlePopState = () => {
            const position = getScrollPosition(window.location.pathname);
            window.scrollTo(position.x, position.y);
        };

        // 현재 경로의 스크롤 위치 복원
        const position = getScrollPosition(currentPath);
        window.scrollTo(position.x, position.y);

        // 이벤트 리스너 등록
        window.addEventListener('popstate', handlePopState);
        window.addEventListener('beforeunload', saveCurrentScrollPosition);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('beforeunload', saveCurrentScrollPosition);
            saveCurrentScrollPosition(); // 컴포넌트 언마운트 시에도 저장
        };
    }, [location, saveScrollPosition, getScrollPosition]);

    return null;
};

export default ScrollRestoration;
