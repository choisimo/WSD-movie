import React from 'react';
import { bookMarkStarFilledIcon, bookMarkStarIcon } from 'artifacts/icons';
import { toggleLikeMovie, getLikedMovies } from 'content/components/utility/bookMark/likeMovies';

const BookmarkButton = ({ movieId, likedMovies, onToggle }) => {
    const isLiked = likedMovies.includes(movieId);

    const handleClick = (e) => {
        e.stopPropagation(); // 이벤트 버블링 방지
        const updatedLikedMovies = toggleLikeMovie(movieId);
        onToggle(updatedLikedMovies); // 외부에서 likedMovies 상태를 업데이트하기 위한 콜백 호출
    };

    return (
        <button className="bookmark-icon" onClick={handleClick}>
            {isLiked ? bookMarkStarFilledIcon : bookMarkStarIcon}
        </button>
    );
};

export default BookmarkButton;
