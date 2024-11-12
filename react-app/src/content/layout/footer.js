import React from 'react';
import './footer.css';
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from 'artifacts/icons';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="social-media">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <FacebookIcon />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <InstagramIcon />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <TwitterIcon />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                    <YoutubeIcon />
                </a>
            </div>
            <div className="footer-links">
                <ul>
                    <li><a href="/faq">자주 묻는 질문</a></li>
                    <li><a href="/help">고객 센터</a></li>
                    <li><a href="/account">계정</a></li>
                    <li><a href="/media">미디어 센터</a></li>
                    <li><a href="/terms">이용 약관</a></li>
                    <li><a href="/privacy">개인정보 처리방침</a></li>
                    <li><a href="/cookies">쿠키 설정</a></li>
                    <li><a href="/corporate">회사 정보</a></li>
                </ul>
            </div>
            <div className="footer-copyright">
                <p>© 2024 Netflix Clone. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
