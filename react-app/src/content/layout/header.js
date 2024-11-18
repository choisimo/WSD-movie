import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './header.css';
import './header_categoryList.css';
import routes from "routes.json";
import { TicketIcon, SearchIcon, BellIcon, UserIcon, BarsIcon, TimesIcon } from 'artifacts/icons';

const Header = () => {

    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
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

                <button className="icon-button" onClick={() => navigate('/notifications')}>
                    <BellIcon/>
                </button>

                <button className="icon-button" onClick={() => navigate('/profile')}>
                    <UserIcon/>
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
