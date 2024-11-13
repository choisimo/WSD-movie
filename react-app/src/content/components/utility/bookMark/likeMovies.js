export const getLikedMovies = () => {
    return JSON.parse(localStorage.getItem('likedMovies') || '[]');
};



export const toggleLikeMovie = (movieId) => {
    const likedMovies = getLikedMovies();
    let updatedLikes;

    if (likedMovies.includes(movieId)) {
        updatedLikes = likedMovies.filter(id => id !== movieId);
    } else {
        updatedLikes = [...likedMovies, movieId];
    }

    localStorage.setItem("likedMovies", JSON.stringify(updatedLikes));
    return updatedLikes;
};
