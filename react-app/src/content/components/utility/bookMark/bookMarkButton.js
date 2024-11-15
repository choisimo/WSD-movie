import React from 'react';
import { bookMarkStarFilledIcon, bookMarkStarIcon } from 'artifacts/icons';
import { toggleLikeMovie, getLikedMovies } from 'content/components/utility/bookMark/likeMovies';

const BookmarkButton = ({ isLiked, onClick }) => {
    const handleClick = (e) => {
        e.stopPropagation(); // 클릭 이벤트 전파 방지
        onClick(); // 북마크 클릭 이벤트 처리
    };

    return (
        <button
            className={`bookmark-icon ${isLiked ? 'liked' : ''}`}
            onClick={handleClick} // 수정된 클릭 핸들러
        >
            {isLiked ? '★' : '☆'}
        </button>
    );
};

BookmarkButton.defaultProps = {
    isLiked: false,
    onClick: () => {},
};

export default BookmarkButton;
