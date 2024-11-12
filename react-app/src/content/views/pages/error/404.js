import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>404</h1>
            <p style={styles.message}>페이지를 찾을 수 없습니다.</p>
            <Link to="/" style={styles.link}>홈으로 돌아가기</Link>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#333',
    },
    title: {
        fontSize: '6rem',
        margin: 0,
    },
    message: {
        fontSize: '1.5rem',
        margin: '1rem 0',
    },
    link: {
        fontSize: '1rem',
        color: '#61dafb',
        textDecoration: 'none',
        marginTop: '1rem',
    }
};


export default NotFound;
