import React from 'react';
import './home.css'

const HomePage = () => {
    return (
        <div className="home">
            <div className="banner">
                <h1>Welcome to Netflix</h1>
                <p>Watch your favorite movies and series now</p>
                <button>Watch Now</button>
            </div>
            <div className="content-section">
                <h2>Popular on Netflix</h2>
                <div className="content-row">
                    {/* 각 콘텐츠 아이템 */}
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="content-item">
                            <img src={`https://via.placeholder.com/150?text=Content+${index + 1}`} alt={`Content ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </div>
            {/* 필요한 만큼 다른 콘텐츠 섹션 추가 */}
        </div>
    );
};

export default HomePage;
