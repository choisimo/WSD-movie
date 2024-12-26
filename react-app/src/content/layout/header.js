import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './header.css';
import './header_categoryList.css';
import moduleStyle from './header.module.css';
import {useTheme} from 'content/components/context/themeContext';
import routes from "routes.json";
import { TicketIcon, SearchIcon, BellIcon, UserIcon, BarsIcon, TimesIcon, KakaoIcon } from 'artifacts/icons';
import {kakaoLogout} from "content/views/pages/SignIn/OauthService";

function openPopup(로그아웃되었습니다) {
    alert(로그아웃되었습니다);
}

const Header = () => {

    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const [ userInfo, setUserInfo ] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    useEffect(() => {
        const storedUserInfo = localStorage.getItem('Kakao-user-info');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-left">
                <div className="logo">
                    <Link to="/">
                        <TicketIcon />
                    </Link>
                </div>
                &ensp;
                <nav className="nav-links desktop-nav">
                    <ul>
                        <li><Link to={routes["category/popular"]}>대세 콘텐츠</Link></li>
                        <li><Link to={routes.wishList}>내가 찜한 리스트</Link></li>
                        <li><Link to={routes.categoryList}>카테고리</Link></li>
                    </ul>
                </nav>
            </div>
            <div className="header-right">

                <button className="icon-button" onClick={() => navigate(routes.search)}>
                    <SearchIcon/>
                </button>

                {userInfo ? (
                    <div className="user-info">
                    <span
                        className={moduleStyle.userName}
                        onClick={() => {
                            if (window.confirm('로그아웃 하시겠습니까?')) {
                                kakaoLogout().then(r => {
                                    console.log('Kakao logout:', r);
                                    openPopup('로그아웃 되었습니다.');
                                }).then(() =>
                                    navigate(routes.home)
                                );
                                setUserInfo(null);
                            }
                        }}
                    >
                        {userInfo.name}
                    </span>

                        <button className="icon-button" onClick={() => navigate(routes.kakaoUserPage)}>
                            <KakaoIcon/>
                        </button>
                    </div>
                ) : (
                    <button className="icon-button" onClick={() => navigate(routes.setting)}>
                        <UserIcon/>
                    </button>
                )}
                {/* 다크모드 버튼 추가 */}
                <button className="icon-button dark-mode-button" onClick={toggleTheme}>
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>


                <button className="icon-button mobile-menu-button" onClick={toggleMobileMenu}>
                    <BarsIcon/>
                </button>

            </div>
            {isMobileMenuOpen && (
                <div className="mobile-nav open">
                    <button className="close-button" onClick={toggleMobileMenu}>
                        <TimesIcon />
                    </button>
                    <nav>
                        <ul>
                            <li><Link to={routes.home} onClick={toggleMobileMenu}>홈</Link></li>
                            <li><Link to="/popular" onClick={toggleMobileMenu}>대세 콘텐츠</Link></li>
                            <li><Link to="/wishlist" onClick={toggleMobileMenu}>내가 찜한 리스트</Link></li>
                            <li><Link to={routes.search} onClick={toggleMobileMenu}>찾아보기</Link></li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
