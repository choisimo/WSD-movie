export const getLikedMovies = () => {
    return JSON.parse(localStorage.getItem('likedMovies') || '[]');
};

export const toggleLikeMovie = (movie) => {
    const likedMovies = getLikedMovies();
    let updatedLikes;

    if (likedMovies.some((m) => m.id === movie.id)) {
        updatedLikes = likedMovies.filter((m) => m.id !== movie.id); // 영화 제거
    } else {
        updatedLikes = [...likedMovies, movie]; // 영화 추가
    }

    localStorage.setItem("likedMovies", JSON.stringify(updatedLikes));
    return updatedLikes;
};
